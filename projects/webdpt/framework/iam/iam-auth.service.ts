import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { Observable, of, forkJoin } from 'rxjs';
import { switchMap, map, concatMap } from 'rxjs/operators';

import { TranslateService } from '@ngx-translate/core';
import * as crypto from 'crypto-js';
declare const JSEncrypt: any;

import { DwIamRepository } from './iam-repository';
import { DW_AUTH_TOKEN, DwAuthService } from '@webdpt/framework/auth';
import { DwUserService } from '@webdpt/framework/user';
import { DwSystemConfigService } from '@webdpt/framework/config';
import { LONIG_DEFAULT } from '@webdpt/framework/config';
import { DwTenantService } from '@webdpt/framework/user';


@Injectable()
export class DwIamAuthService extends DwAuthService {
  isServiceCloud: boolean;
  private dwMultiTenant: boolean;

  constructor(
    protected router: Router,
    protected userService: DwUserService,
    private iamRepository: DwIamRepository,
    private configService: DwSystemConfigService,
    private translateService: TranslateService,
    @Inject(DW_AUTH_TOKEN) protected authToken: any,
    @Inject(LONIG_DEFAULT) protected defaultLogin: string,
    protected dwTenantService: DwTenantService
  ) {
    super(router, userService, authToken, defaultLogin, dwTenantService);
    this.configService.get('multiTenant').subscribe(
      // 是否加入服務雲帳號機制(AD帳號登入 & 地端是不用呼叫salt的與dwMultiTenant設定一致)
      multiTenant => {
        this.isServiceCloud = multiTenant;
        this.dwMultiTenant = multiTenant;
      }
    );

    // 當收到 《token 無效》時, 要將目前的 token 註銷.
    this.dwTenantService.isTokenValid$.subscribe((isTokenValid: boolean) => {
      if (isTokenValid === false) {
        this.iamLogout();
      }
    });

    this.dwTenantService.tenantInfoRefresh$.subscribe(
      info => {
        this.setLogined(info);
      }
    );

    this.isLoggedIn$.subscribe(
      isLogging => {
        if (isLogging === false) {
          this.dwTenantService.setTenantList([]);
          this.dwTenantService.setTokenValid(false);
        }
      }
    );
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
      description: '' // 登入失敗時, 顯示.
    };

    return new Observable((observer): void => {
      this.getLoginApiBody(userConfig).pipe(
        concatMap((apiBody) => {
          return this.iamRepository.login(apiBody);
        })
        ).subscribe(
          (datas) => {
            // 多租戶未啟用時, 不需要調取有權限的租戶清單.
            if (!this.dwMultiTenant) {
              this.setLogined(datas);
              this.dwTenantService.setTokenValid(true);
              observer.next(info);
              observer.complete();
              return;
            }

            // 設定 DW_AUTH_TOKEN.
            this.setAuthToken(datas);

            // 取有權限的租戶清單
            this.dwTenantService.getTenants().subscribe(
              (currTenantList) => {
                // 如果 0 筆: 不允許登入, 要顯示特定訊息.
                if (currTenantList.length === 0) {
                  info.description = this.translateService.instant('dw-login-failure-noTenant');
                  observer.next(this.setLoginFail(info));
                  observer.complete();
                  return;
                }

                // 如果 1 筆: 自動幫登入;
                if (currTenantList.length === 1) {
                  this.dwTenantService.tokenRefreshTenant(currTenantList[0].tenantSid).subscribe(
                    (tenantInfo) => {
                      // 需等待 token 刷新後, 才能 next() 裝填回傳, 避免與導頁同時進行.
                      observer.next(info);
                      observer.complete();
                    },
                    (errorHandle: HttpErrorResponse) => {
                      observer.error(errorHandle);
                      observer.complete();
                    }
                  );
                  // 要先 return, 避免往下執行.
                  return;
                }

                // 如果 1 筆以上: 需要彈窗, 讓用戶選一個租戶登入, 所以返回 null 等待用戶選擇.
                info.success = null;
                observer.next(info);
                observer.complete();
              },
              (errorHandle: HttpErrorResponse) => {
                observer.error(errorHandle);
                observer.complete();
              }
            );
          },
          (errorHandle: HttpErrorResponse) => {
            observer.error(errorHandle);
            observer.complete();
          }
        );
      }
    );


  }


  /**
   * 設定登入失敗.
   *
   * param {*} info
   * returns {*}
   */
  protected setLoginFail(info: any): any {
    info.success = false;
    info.description = (info.description) ? info.description : this.translateService.instant('dw-login-failure');
    return info;
  }

  /**
   * 取得 API 的 body
   *
   * param {*} userConfig
   * returns {object}
   */
  protected getLoginApiBody(userConfig: any): Observable<any> {
    return forkJoin([
      this.getUserSalt(userConfig),
      this.getClientEncrypt(userConfig)
    ]).pipe(map((res) => {
      const body = {
        tenantId: userConfig.tenantId,
        userId: userConfig.userId,
        identityType: userConfig.identityType
      };

      Object.assign(body, {
        passwordHash: res[1].passwordHash,
        clientEncryptPublicKey: res[1].clientEncryptPublicKey
      });

      // 如果有服務雲帳號特有的salt則需加傳 passwordHash1
      if (res[0]['salt']) {
        Object.assign(body, {
          passwordHash1: crypto.MD5(userConfig.password + res[0]['salt']).toString()
        });
      }

      return body;
    }));
  }


  /**
   * 取得服務雲用戶的salt值
   *
   */
  protected getUserSalt(userConfig: any): Observable<any> {
    if (this.isServiceCloud) {
      return this.iamRepository.getUserSalt(userConfig.userId);
    } else {
      return of({});
    }
  }


  /**
   * 取得加密過的密碼與 public key
   *
   */
  protected getClientEncrypt(userConfig: any): Observable<any> {
    return this.getAESKey().pipe(
      // 使用 AES key 進行加密密碼
      map((aesKey) => {
        const key = crypto.enc.Utf8.parse(aesKey.aeskey);
        const iv = crypto.enc.Utf8.parse('ghUb#er57HBh(u%g');
        const passwordHash = crypto.AES.encrypt(userConfig.password, key, {
          iv: iv,
          mode: crypto.mode.CBC,
          padding: crypto.pad.Pkcs7
        }).toString();

        const keys = {
          passwordHash: passwordHash,
          clientEncryptPublicKey: aesKey.clientEncryptPublicKey
        };

        return keys;
      })
    );
  }


  /**
   * 取得編碼用的金鑰
   *
   */
  getAESKey(): Observable<any> {
    return this.iamRepository.getIdentityPublickey().pipe(
      switchMap(publicKey => {
        const crypt = new JSEncrypt({
          default_key_size: 1024
        });
        let rsaPublicKey = crypt.getPublicKey();
        rsaPublicKey = rsaPublicKey.replace('-----BEGIN PUBLIC KEY-----\n', '');
        rsaPublicKey = rsaPublicKey.replace('\n-----END PUBLIC KEY-----', '');
        const cryptSrv = new JSEncrypt({ default_key_size: 2048 });
        const publicKeyStr = publicKey['publicKey'];
        cryptSrv.setPublicKey(publicKeyStr);

        const clientEncryptPublicKey = cryptSrv.encrypt(rsaPublicKey);
        return this.iamRepository.getIdentityAeskey(clientEncryptPublicKey).pipe(
          map(encryptAesKey => {
            const aesKey = crypt.decrypt(encryptAesKey['encryptAesKey']);
            return {
              aeskey: aesKey,
              clientEncryptPublicKey: clientEncryptPublicKey
            };
          })
        );

      })
    );
  }



  /**
   * 用户登出.
   *
   * returns void.
   */
  protected iamLogout(): void {
    // 當 token 不存在時, 無需進行登出.
    if (!this.authToken.token) {
      return;
    }

    this.iamRepository.logout().subscribe();
  }


}
