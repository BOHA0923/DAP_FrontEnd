import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { IDwAccountInfoDataSource } from './account-info.interface';
import { DwAccountModule } from './account.module';


@Injectable({
  providedIn: DwAccountModule
})
export class DwAccountInfoDataSourceService implements IDwAccountInfoDataSource {

  constructor(
  ) {
  }

  /**
    * 取得用戶的基本資料.
    *
    * param {string} userId: 用戶 ID
    *
    */
  getUserBasicInfo(userId?: string): Observable<any> {
    return new Observable((observer): void => {
      observer.next({
        'sid': 39882414600768,
        'createBy': 0,
        'createProvider': 0,
        'createOrg': 0,
        'createDate': '2019-04-08 08:00:00',
        'modifyBy': 39882414600768,
        'modifyById': 'cloud01',
        'modifyProvider': 822023381984619651,
        'modifyDate': '2019-08-06 08:00:00',
        'hash': '1736a33b1c129c49ffe7175f1596986989b963d4',
        'disabled': false,
        'deleted': false,
        'id': 'cloud01',
        'name': 'cloud01',
        'telephone': '11111111001',
        'email': 'cloud01@digiwin.com1',
        'headImageUrl': '',
        'nickname': 'cloud01',
        'sex': '女',
        'birthday': '1977/01/23',
        'cellphonePrefix': '+86',
        'address': '台中',
        'activated': true,
        'enterprise': false,
        'defaultTenantSid': 0,
        'confirm': false,
        'visible': true,
        'readonly': false,
        'chargeSid': 0
      });
      observer.complete();
    });
  }


  /**
    * 更新用戶的基本資料.
    *
    * param {*} userInfo: 用戶基本資料
    *
    */
  updateUserBasicInfo(userInfo: any): Observable<any> {
    return new Observable((observer): void => {
      observer.next(true);
      observer.complete();
    });
  }


  /**
    * 刷新用戶在session storage的資料.
    *
    * param {*} userInfo: 用戶基本資料
    *
    */
   refreshUserInfo(userInfo?: any): Observable<any> {
    return new Observable((observer): void => {
      observer.next(true);
      observer.complete();
    });
  }

}
