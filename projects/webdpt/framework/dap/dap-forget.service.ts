import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { DwForgetService } from '@webdpt/framework/account';
import { IDwForgetUpdatePassword } from '@webdpt/framework/account';
import { DwIamRepository } from '@webdpt/framework/iam';
import { DwEmcRepository } from '@webdpt/framework/emc';


@Injectable()
export class DwDapForgetService extends DwForgetService {
  constructor(
    private iamRepository: DwIamRepository,
    private emcRepository: DwEmcRepository
  ) {
    super();
  }


  /**
   * 取得 [mail驗證碼 / 手機驗證碼].
   *
   * param {string} type: 驗證碼類型, [email: Email] / [telephone: 手機號碼].
   * param {string} value: email 帳號 / 手機號碼.
   *
   * returns {Observable<any>}
   */
  getVerificationCode(type: string, value: string): Observable<any> {
    switch (type)  {
      case 'email':
      case 'mobilephone':
        return this.emcRepository.verificationCode(type, value);

      default:
        return of(null);
    }

  }


  /**
   * [忘記密碼]裡的修改密碼.
   *
   * param {*} params, params.account: Email帳號/手機號碼, params.password: 密碼, params.verificationCode: 驗證碼.
   * returns {Observable<any>}
   */
  updatePassword(params: IDwForgetUpdatePassword): Observable<any> {
    return this.iamRepository.updatePassword(params);
  }


  /**
   * 驗證 [E-mail / mobilephone] 是否有重覆.
   *
   * param {string} type: 驗證類型, [email: Email] / [telephone: 手機號碼].
   * param {string} value: email 帳號[email: value] / 手機號碼[telephone: value] .
   * returns {Observable<any>}
   */
  verifyExist(type: string, value: string): Observable<any> {
    const params = {
      [type]: value
    };

    switch (type)  {
      case 'email':
        return this.iamRepository.verifyEmailExist(params);

      case 'telephone': // 這一個接口的入參是{telephone: value}, url 是用mobilephone, 沒有統一, 無法只使用一個變數.
        return this.iamRepository.verifyMobilephoneExist(params);

      default:
        return of(null);
    }

  }


}
