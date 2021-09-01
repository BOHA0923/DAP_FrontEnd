import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { IDwAccountInfoUpload } from './account-info.interface';
import { DwAccountModule } from './account.module';


@Injectable({
  providedIn: DwAccountModule
})
export class DwAccountInfoUploadService implements IDwAccountInfoUpload {

  constructor(
  ) {
  }


  /**
    * 上傳並取得分享連結.
    *
    * param {File} file: 上傳檔案的原始 file 型態
    * param {string} bucketName: 儲存區
    * param {string} dirId: 目錄 ID
    *
    */
  uploadAndShare(file: File, bucketName?: string, dirId?: string): Observable<any> {
    return new Observable((observer): void => {
      observer.next({
        fileId: '1234567890'
      });
      observer.complete();
    });

  }


  /**
    * 更新用戶頭像
    *
    * param {string} headImageUrl: 頭像地址
    * param {string} userSid: 用戶sid
    *
    */
  updateUserHeadimageUrl(headImageUrl: string, userSid?: string): Observable<any> {
    return new Observable((observer): void => {
      observer.next(true);
      observer.complete();
    });
  }

}
