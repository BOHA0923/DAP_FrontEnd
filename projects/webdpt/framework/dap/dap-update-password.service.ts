import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { DwUpdatePasswordService } from '@webdpt/framework/account';
import { IDwUpdatePassword, IDwUpdatePasswordForce } from '@webdpt/framework/account';

import { DwIamRepository } from '@webdpt/framework/iam';
import { DwEmcRepository } from '@webdpt/framework/emc';
import { DwUserService } from '@webdpt/framework/user';


@Injectable()
export class DwDapUpdatePasswordService extends DwUpdatePasswordService {

  constructor(
    private iamRepository: DwIamRepository,
    private emcRepository: DwEmcRepository,
    private userService: DwUserService
  ) {
    super();
  }


  /**
   * 取得用戶的基本資料.
   *
   */
  getUserBasicInfo(userId?: string): Observable<any> {
    const id = (userId) ? userId : this.userService.getUser('userId');
    return this.iamRepository.getUserBasicInfo(id);
  }


  /**
   * 取得 [mail驗證碼 / 手機驗證碼].
   *
   * param {string} type: 驗證碼類型, [email: Email] / [telephone: 手機號碼].
   * param {string} value: email 帳號 / 手機號碼.
   *
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
   * 通過手機號、邮箱修改密碼.
   *
   * param {IUpdatePassword} params
   * params.account: Email帳號/手機號碼
   * params.password: 密碼
   * params.verificationCode: 驗證碼
   *
   */
  userPasswordUpdate(params: IDwUpdatePassword): Observable<any> {
    return this.iamRepository.userPasswordUpdate(params);
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
    return this.iamRepository.userPasswordUpdateForce(params);
  }


}
