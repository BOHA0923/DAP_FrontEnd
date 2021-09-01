import { Inject, Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { DwIamHttpClient } from './iam-http-client';
import { IDwUpdatePassword, IDwUpdatePasswordForce } from '@webdpt/framework/account';
import { IDwForgetUpdatePassword } from '@webdpt/framework/account';
import { DW_APP_ID } from '@webdpt/framework/config';
import { DwHttpClientOptionsService } from '@webdpt/framework/http';
import { DwHttpModule } from '@webdpt/framework/http';


@Injectable({
  providedIn: DwHttpModule
})
export class DwIamRepository {
  constructor(
    private http: DwIamHttpClient,
    @Inject(DW_APP_ID) private dwAppId: string,
    private dwHttpClientOptionsService: DwHttpClientOptionsService
  ) {
  }

  /**
   * 登入.
   *
   * returns {Observable<any>}
   */
  login(params: any): Observable<any> {
    return this.http.post('api/iam/v2/identity/login', params);
  }

  /**
   * 登出, Headers：digi-middleware-auth-user: userToken.
   *
   * returns {Observable<any>}
   */
  logout(): Observable<any> {
    return this.http.post('api/iam/v2/identity/logout', {});
  }


  /**
   * appId為空, 返回用戶加入的所有企業，傳入appId時, 返回用戶加入並且授權該應用的所有企業.
   *
   * returns {Observable<any>}
   */
  getTenantList(): Observable<any> {
    if (this.dwAppId) {
      return this.http.post(`api/iam/v2/tenant?appId=${this.dwAppId}`, {}).pipe(
        map(
          (tenants: Array<{}>) => {
            // tenants會是一個array.
            return tenants.map((info: {}) => {
              return Object.assign(info, {
                tenantSid: info['sid'],
                tenantId: info['id'],
                tenantName: info['name']
              });
            });
          }
        )
      );
    } else {
      return Observable.create(
        (observer: any) => {
          observer.next([]);
          observer.complete();
          console.log('tenants error');
        }
      );
    }
  }

  /**
   * 獲取用戶的租戶信息.
   * 調用時, 如果有的userId時, 會依userId取得對應值, 如果沒有userId時, 會解析digi-middleware-auth-user取得對應值.
   *
   * returns {Observable<any>}
   */
  getUserInfo(userId?: string): Observable<any> {
    const params = (userId) ? { id: userId } : {};
    return this.http.post('api/iam/v2/user/withtenant', params).pipe(
      map((ret: any) => {
        return Object.assign(ret, {
          userId: ret['id'],
          userName: ret['name']
        });
      })
    );
  }

  /**
   * 解析USERTOKEN.
   *
   * returns {Observable<any>}
   */
  analyzeToken(): Observable<any> {
    return this.http.post('api/iam/v2/identity/token/analyze', {}).pipe(
      map((ret: any) => {
        return Object.assign(ret, {
          userId: ret['id'],
          userName: ret['name']
        });
      })
    );
  }

  /**
   * SSO刷新應用下的UserToken
   */
  tokenRefreshApp(): Observable<any> {
    return this.http.post('api/iam/v2/identity/token/refresh/app', {});
  }

  /**
   * 切換租戶，重新刷新UserToken.
   *
   * returns {Observable<any>}
   */
  tokenRefreshTenant(tenantSid: number): Observable<any> {
    return this.http.post('api/iam/v2/identity/token/refresh/tenant', {
      tenantSid: tenantSid
    }).pipe(
      map((ret: any) => {
        return Object.assign(ret, {
          token: ret['user_token']
        });
      })
    );
  }

  /**
   * 忘記密碼，裡的修改密碼.
   *
   * returns {Observable<any>}
   */
  updatePassword(params: IDwForgetUpdatePassword): Observable<any> {
    const updateParams = {
      account: params.account,
      password: params.password,
      verificationCode: params.verificationCode
    };
    return this.http.post('api/iam/v2/user/password/update', updateParams);
  }

  /**
   * 驗證E-mail，是否有重覆.
   *
   * returns {Observable<any>}
   */
  verifyEmailExist(params: any): Observable<any> {
    const options = this.dwHttpClientOptionsService.setLoadMaskCfg({}, false);
    return this.http.post('api/iam/v2/user/email/exist', params, options);
  }

  /**
   * 驗證mobilephone，是否有重覆.
   *
   * returns {Observable<any>}
   */
  verifyMobilephoneExist(params: any): Observable<any> {
    const options = this.dwHttpClientOptionsService.setLoadMaskCfg({}, false);
    return this.http.post('api/iam/v2/user/mobilephone/exist', params, options);
  }

  /**
   * 取得服務雲用戶的salt值
   */
  getUserSalt(userId: string): Observable<any> {
    return this.http.post('api/iam/v2/user/salt', { id: userId });
  }

  /**
   * 取得用戶授權模組行為(作業授權清單)
   */
  public permissionUserActions(): Observable<any> {
    return this.http.post('api/iam/v2/permission/user/actions', { id: this.dwAppId });
  }


  /**
   * 通過手機號、邮箱修改密碼.
   *
   */
  userPasswordUpdate(params: IDwUpdatePassword): Observable<any> {
    return this.http.post('api/iam/v2/user/password/update', params);
  }


  /**
   * 強制更新用戶密碼.
   *
   */
  userPasswordUpdateForce(params: IDwUpdatePasswordForce): Observable<any> {
    return this.http.post('api/iam/v2/user/update/password/force', params);
  }


  /**
   * 取得單一用戶基本資料.
   *
   * param {string} userId: 用戶 ID
   *
   */
  getUserBasicInfo(userId: string): Observable<any> {
    return this.http.post('api/iam/v2/user', {
      id: userId // 類型：String 必有字段 備註：無
    });
  }


  /**
   * 更新用戶基本資料.
   *
   * param {*} userInfo: 用戶基本資料
   *
   */
  updateUserBasicInfo(userInfo: any): Observable<any> {
    return this.http.post('api/iam/v2/user/update', userInfo);
  }


  /**
   * 更新用戶頭像
   *
   * param {string} headImageUrl: 用戶sid
   * param {string} userId: 頭像地址
   *
   */
  updateUserHeadimageUrl(headImageUrl: string, userSid: string): Observable<any> {
    return this.http.post('api/iam/v2/user/update/headimageurl', {
      sid: userSid, // 類型：String必有字段備註：用戶sid
      headImageUrl: headImageUrl  // 類型：字符串可有字段備註：頭像地址
    });
  }


  /**
   * 獲取rsa公鑰
   *
   */
  getIdentityPublickey(): Observable<any> {
    return this.http.get('api/iam/v2/identity/publickey');
  }


  /**
   * 獲取加密後的aes的key值
   *
   */
  getIdentityAeskey(publicKey: any): Observable<any> {
    return this.http.post('api/iam/v2/identity/aeskey', {
      clientEncryptPublicKey: publicKey
    });
  }

}
