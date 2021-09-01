import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';

import { IDwUpdatePassword, IDwUpdatePasswordForce } from './update-password.interface';
import { DwAccountModule } from './account.module';


@Injectable({
  providedIn: DwAccountModule
})
export class DwUpdatePasswordService {

  constructor(
  ) {
  }


  /**
   * 取得用戶的基本資料.
   *
   */
  getUserBasicInfo(userId?: string): Observable<any> {
    return new Observable((observer): void => {
      observer.next({
        email: 'miller@abc.com',
        telephone: '11111111111'
      });
      observer.complete();
    });
  }


  /**
   * 取得 [mail驗證碼 / 手機驗證碼].
   *
   * param {string} type: 驗證碼類型, [email: Email] / [telephone: 手機號碼].
   * param {string} value: email 帳號 / 手機號碼.
   *
   */
  getVerificationCode(type: string, value: string): Observable<any> {
    const result = {};
    switch (type)  {
      case 'email':
      case 'mobilephone':
        result['result'] = 'success';
        break;
    }

    return of(result);
  }


  /**
   * 通過手機號、邮箱修改密碼.
   *
   * param {IUpdatePassword} params
   * params.account: Email帳號/手機號碼
   * params.password: 密碼
   * params.verificationCode: 驗證碼
   *
   */
  userPasswordUpdate(params: IDwUpdatePassword): Observable<any> {
    return of(null);
  }



  /**
   * 強制更新用戶密碼.
   *
   * param {IUpdatePassword} params
   * params.id?: 用戶Id
   * params.sid?: 用戶Sid
   * params.newPassword?: 用戶密碼
   * params.newPasswordHash?: 用戶加密後的密碼
   *
   */
  userPasswordUpdateForce(params: IDwUpdatePasswordForce): Observable<any> {
    return of(null);
  }


}
