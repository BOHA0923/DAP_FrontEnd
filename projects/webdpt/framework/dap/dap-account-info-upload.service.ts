import { Injectable, Inject } from '@angular/core';

import { Observable } from 'rxjs';

import { DwIamRepository } from '@webdpt/framework/iam';
import { DwUserService } from '@webdpt/framework/user';
import { DwUploadFileService } from '@webdpt/framework/dmc';
import { IDwAccountInfoUpload } from '@webdpt/framework/account';
import { IDWDmcUserInfo } from '@webdpt/framework/config';
import { DW_DMC_USERINFO } from '@webdpt/framework/config';


@Injectable()
export class DwDapAccountInfoUploadService implements IDwAccountInfoUpload {
  private defaultBucketName: string = ''; // 默認的儲存區(將會與 username 一致)
  private defaultDirId: string = '00000000-0000-0000-0000-000000000000'; // 默認的目錄ID,

  constructor(
    private userService: DwUserService,
    private iamRepository: DwIamRepository,
    private dwUploadFileService: DwUploadFileService,
    @Inject(DW_DMC_USERINFO) private dwDmcUserInfo: IDWDmcUserInfo
  ) {
    this.defaultBucketName = this.dwDmcUserInfo.username;
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
    bucketName = bucketName || this.defaultBucketName;
    dirId = dirId || this.defaultDirId;

    return this.dwUploadFileService.uploadAndShare(file, bucketName, dirId);
  }


  /**
    * 更新用戶頭像
    *
    * param {string} headImageUrl: 頭像地址
    * param {string} userSid: 用戶sid
    *
    */
  updateUserHeadimageUrl(headImageUrl: string, userSid?: string): Observable<any> {
    const sid = (userSid) ? userSid : this.userService.getUser('sid');
    return this.iamRepository.updateUserHeadimageUrl(headImageUrl, sid);
  }

}
