import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { IDwForgetUpdatePassword } from './forget.interface';
import { DwAccountModule } from './account.module';


@Injectable({
  providedIn: DwAccountModule
})
export class DwForgetService {

  constructor( ) {

  }

  /**
   * 取得 [mail驗證碼 / 手機驗證碼].
   *
   * param {string} type: 驗證碼類型, [email: Email] / [telephone: 手機號碼].
   * param {string} value: email 帳號 / 手機號碼.
   * returns {Observable<any>}
   */
  getVerificationCode(type: string, value: string): Observable<any> {
    const result = {};
    switch (type)  {
      case 'mobilephone':
        result['result'] = 'success';
        break;
    }

    return of(result);
  }


  /**
   * [忘記密碼]裡的修改密碼.
   *
   * param {IUpdatePassword} params, params.account: Email帳號/手機號碼, params.password: 密碼, params.verificationCode: 驗證碼.
   * returns {Observable<any>}
   */
  updatePassword(params: IDwForgetUpdatePassword): Observable<any> {
    return of(null);
  }


  /**
   * 驗證 [E-mail / mobilephone] 是否有重覆.
   *
   * param {string} type: 驗證類型, Email / 手機號碼.
   * param {string} value: 值.
   * returns {Observable<any>}
   */
  verifyExist(type: string, value: string): Observable<any> {
    const result = {};
    switch (type)  {
      case 'email':
      case 'telephone':
        result['isRegister'] = true;
        break;
    }

    return of(result);
  }


}
