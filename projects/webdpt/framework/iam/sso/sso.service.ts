import { Injectable } from '@angular/core';
import { ParamMap } from '@angular/router';

import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { SsoUtility } from './sso-utility';
import { DwSystemConfigService } from '@webdpt/framework/config';
import { IDwSsoLogin } from '../interface/sso.interface';
import { DwUserService } from '@webdpt/framework/user';
import { DwAuthService } from '@webdpt/framework/auth';
import { DwTenantService } from '@webdpt/framework/user';
import { DwSsoTokenRefreshService } from './sso-token-refresh.service';
import { DwIamRepository } from '../iam-repository';


@Injectable()
export class DwSsoService implements IDwSsoLogin {
  private dwMultiTenant: boolean;

  constructor(
    public dwSsoTokenRefreshService: DwSsoTokenRefreshService,
    private userService: DwUserService,
    private authService: DwAuthService,
    private configService: DwSystemConfigService,
    private dwTenantService: DwTenantService,
    private iamRepository: DwIamRepository
  ) {
    this.configService.get('multiTenant').subscribe(
      multiTenant => this.dwMultiTenant = multiTenant
    );
  }


  /**
   * SSO 的轉頁.
   *
   * @param url SSO 前往的 url
   * @param newWin 是否開新窗
   * @param [otherParams] 要前往的額外參數, 若名稱相同, 以此為優先
   */
  public redirectUrl(url: string, newWin?: boolean, otherParams?: {}): void {

    const newUrl = SsoUtility.getSsoUrl(url, this.userService.getUser('token'), otherParams);

    if (newWin === true) {
      window.open(newUrl);
    } else {
      document.location.href = newUrl;
    }
  }

  /**
   * SSO Login.
   *
   * param {ParamMap} queryParam
   * returns {Observable<boolean>}
   */
  public ssoLogin(queryParam: ParamMap): Observable<boolean> {
    return new Observable(
      (observer): void => {
        let userToken = queryParam.get('userToken') || '';

        if (!userToken) {
          observer.next(false);
          observer.complete();
        } else {
          // 調用 DwIamHttpClient 時, 會取出 DW_AUTH_TOKEN, 所以要先設定
          this.authService.setAuthToken({ token: userToken });

          // SSO刷新應用下的UserToken
          this.dwSsoTokenRefreshService.tokenRefreshApp(userToken).pipe(
            switchMap(
              (refreshResponse: any) => {
                userToken = refreshResponse.user_token;
                this.authService.setAuthToken({ token: userToken });
                return this.iamRepository.getUserInfo();
              }
            )
          ).subscribe(
            (userDatas: any) => {
              // 必須依據正常的 after Login, 執行必要的設定, 因為有其他作業會觀察是否登入成功, 而進行對應的動作.
              this.authService.setLogined(userDatas);

              // 發出 token 有效通知, 讓menu與權限可以取得資料, 讓 DwAuthGuardService 裡的 authorizedService.canActivate() 有資料來源.
              this.dwTenantService.setTokenValid(true);

              // 云端-取多租戶清單
              if (this.dwMultiTenant) {
                this.dwTenantService.getTenants().subscribe();
              }

              observer.next(true);
              observer.complete();
            },
            (error: any) => {
              observer.next(false);
              observer.complete();
            }
          );
        }
      }
    );
  }
}
