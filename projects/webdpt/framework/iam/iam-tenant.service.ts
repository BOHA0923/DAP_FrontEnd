import { Injectable, Inject, Injector } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { DwIamRepository } from './iam-repository';
import { DwTenantService } from '@webdpt/framework/user';
import { DwAuthService, DW_AUTH_TOKEN } from '@webdpt/framework/auth';
import { DwUserService } from '@webdpt/framework/user';

@Injectable()
export class DwIamTenantService extends DwTenantService {

  // 取得 DwAuthService for isLoggedIn$ 與 setAuthToken().
  private _authService: DwAuthService = null;

  constructor(
    protected userService: DwUserService,
    private iamRepository: DwIamRepository,
    @Inject(DW_AUTH_TOKEN) private authToken: any
  ) {
    super(userService);
    // 使用BehaviorSubject是為了給初始值, 尤其在 F5 reload 時, 可以讀取 session storage 的值.
    this.tokenValidSubject = new BehaviorSubject<boolean>(this.tokenValid);
    this.tenantSubject = new BehaviorSubject<any[]>(this.currTenantList);

  }

  /**
   * 获取有權限的租户清單.
   */
  getTenants(): Observable<any> {
    return this.iamRepository.getTenantList().pipe(
      tap((currTenantList) => {
        this.setTenantList(currTenantList);
      })
    );
  }

  /**
   * 切换租户，重新刷新UserToken, 刷新UserToken時, 需帶入舊的UserToken.
   *
   * param {number} tenantSid: 租戶的 Sid.
   *
   * returns {Observable<any>}
   */
  tokenRefreshTenant(tenantSid: number): Observable<any> {
    // 刷新UserToken時, 需帶入舊的UserToken.
    return this.iamRepository.tokenRefreshTenant(tenantSid).pipe(
      tap((tenantInfo) => {
        // 當新舊 userToken 都一樣時, userToken為有效.
        if (this.authToken.token !== tenantInfo.token) {
          this.setTokenValid(false);
        }

        // 如果是在[isLoggedIn$:true 已登入]狀態下, 並不會重發登入通知.
        // this.authService.setLogined(tenantInfo);
        this.tenantInfoRefresh$.next(tenantInfo);
        this.setTokenValid(true);
      })
    );
  }

}
