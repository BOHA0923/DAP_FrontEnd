
import { Inject, Injectable, InjectionToken } from '@angular/core';
import { Router, RouterStateSnapshot } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
import { filter, distinctUntilChanged } from 'rxjs/operators';

import { LONIG_DEFAULT } from '@webdpt/framework/config';
import { DwUserService } from '@webdpt/framework/user';
import { DwTenantService } from '@webdpt/framework/user';
import { DwAuthModule } from './auth.module';

export function DW_AUTH_TOKEN_FACTORY(): any {
  return {};
}
export const DW_AUTH_TOKEN = new InjectionToken<DwAuthToken>('DW_AUTH_TOKEN', {
  providedIn: DwAuthModule,
  factory: DW_AUTH_TOKEN_FACTORY
});

@Injectable({
  providedIn: DwAuthModule
})
export class DwAuthService {

  loginSubject: BehaviorSubject<boolean>; // 廣播登入狀態
  loginSuccess = (typeof this.userService.getUser('isLoggedin') === 'boolean') ? this.userService.getUser('isLoggedin') : null;

  /**
   * 注入Angular Router及DW_AUTH_TOKEN做為保存token訊息用
   * param router Angular Router
   * param authToken DW_AUTH_TOKEN
   */
  constructor(
    protected router: Router,
    protected userService: DwUserService,
    @Inject(DW_AUTH_TOKEN) protected authToken: any,
    @Inject(LONIG_DEFAULT) protected defaultLogin: string,
    protected dwTenantService: DwTenantService
  ) {
    this.loginSubject = new BehaviorSubject<boolean>(this.loginSuccess);
    // 設定預設值, 當 F5 reload 時, this.authToken.token 會消失, 必需重新指定.
    this.setAuthToken({});
  }


  // 廣播 [登入或登出] 狀態, 只有在改變時, 才需要廣播.
  get isLoggedIn$(): Observable<boolean> {
    return this.loginSubject.asObservable().pipe(
      filter(obsData => obsData !== null), // 不廣播初始值
      distinctUntilChanged()
    );
  }

  get isLoggedIn(): boolean {
    return this.loginSuccess;
  }



  /**
   * 是否已通過驗證, 提供給DwAuthGuardService驗證用.
   *
   * param  currentUrl 當下的URL，如果驗證不通過，將會導向至登入頁，登入完成後會再導回currentUrl
   * return  是否已驗證
   */
  isAuthenticated(state: RouterStateSnapshot): boolean {

    const currentUrl = state.url;
    const isLoggedIn = (typeof this.userService.getUser('isLoggedin') === 'boolean') ? this.userService.getUser('isLoggedin') : null;

    // 未登入時轉跳登入頁
    if (!isLoggedIn) {
      this.router.navigate(
        [this.defaultLogin], // 如果使用this.defaultApp, 會造成無窮迴圈.
        {
          queryParams:
          {
            returnUrl: currentUrl
          }
        });
    }
    return isLoggedIn;
  }


  /**
   * 登入.
   *
   * param userConfig 登入的資訊.
   * return 返回Observable.
   */
  login(userConfig: any): Observable<any> {
    const info = {
      success: true,
      description: '', // 登入失敗時, 顯示.
      currTenantList: []
    };

    return new Observable((observer): void => {
      const userData = {
        userId: userConfig.userId,
        userName: userConfig.userId,
        token: ''
      };

      this.setLogined(userData);
      this.dwTenantService.setTokenValid(true);
      observer.next(info);
      observer.complete();
    });

  }

  /**
   * 登出並清除儲存紀錄(session storage).
   * 登出時, 先廣播再清值.
   *
   */
  logout(isforward: boolean = true): void {
    if (this.userService.getUser('token') === undefined) {
      // 在非多頁籤下, 直接貼 url 會出現空白的 layout, 然後點登出沒有反應.
      this.router.navigateByUrl(this.defaultLogin);
      return;
    }

    this.loginSuccess = false;
    this.loginSubject.next(this.loginSuccess); // 廣播登入狀態

    this.userService.clearUser();
    this.authToken.token = '';


    if (isforward === true) {
      this.router.navigateByUrl(this.defaultLogin); // 如果使用this.defaultApp, 當在 / 進行登出時, 因為 url 一樣, 會無法跳轉.
    }

  }


  /**
   * 設定 DW_AUTH_TOKEN 的值提供給外部使用, DwIamHttpClient, DwDapHttpClient.
   *
   */
  setAuthToken(datas: any): void {
    if (Object.keys(datas).length > 0) {
      this.userService.setUserInfo(datas);
    }
    this.authToken.token = this.userService.getUser('token') ? this.userService.getUser('token') : '';
  }

  /**
   * 登入成功後, 設定登入的資訊.
   * 登入時, 先設定值再廣播.
   *
   * param {*} loginInfo
   */
  setLogined(loginInfo: any): void {
    this.userService.setUserInfo({isLoggedin: true});

    // 設定 DW_AUTH_TOKEN.
    this.setAuthToken(loginInfo);

    // 廣播登入狀態
    this.loginSuccess = true;
    this.loginSubject.next(this.loginSuccess);
  }


  /**
   * 切换租户，重新刷新UserToken.
   *
   * param {number} tenantSid: 租戶的 Sid.
   *
   * returns {Observable<any>}
   */
  tokenRefreshTenant(tenantSid: number): Observable<any> {
    console.error('請注意：DwTenantService.tokenRefreshTenant() 取代 DwAuthService.tokenRefreshTenant()'); // 警語
    return new Observable((observer): void => {
      observer.next({});
      observer.complete();
    });
  }


}

export interface DwAuthToken {
  token: string;
  expiredDate: any;
}
