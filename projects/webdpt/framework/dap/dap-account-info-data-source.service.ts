import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { DwIamRepository } from '@webdpt/framework/iam';

import { DwUserService } from '@webdpt/framework/user';
import { IDwAccountInfoDataSource } from '@webdpt/framework/account';


@Injectable()
export class DwDapAccountInfoDataSourceService implements IDwAccountInfoDataSource {
  constructor(
    private userService: DwUserService,
    private iamRepository: DwIamRepository
  ) {
  }


  /**
    * 取得用戶的基本資料.
    *
    * param {string} userId: 用戶 ID
    *
    */
  getUserBasicInfo(userId?: string): Observable<any> {
    const id = (userId) ? userId : this.userService.getUser('userId');
    return this.iamRepository.getUserBasicInfo(id);
  }


  /**
    * 更新用戶的基本資料.
    *
    * param {*} userInfo: 用戶基本資料
    *
    */
  updateUserBasicInfo(userInfo: any): Observable<any> {
    return this.iamRepository.updateUserBasicInfo(userInfo);
  }


  /**
    * 刷新用戶在session storage的資料.
    *
    * param {*} userInfo: 用戶基本資料
    *
    */
   refreshUserInfo(userInfo?: any): Observable<any> {
    return this.userService.read();
  }

}
