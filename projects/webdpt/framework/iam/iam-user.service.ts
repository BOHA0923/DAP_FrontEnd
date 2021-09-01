import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { DwIamRepository } from './iam-repository';
import { DwUserStorage } from '@webdpt/framework/user';
import { DwUserService } from '@webdpt/framework/user';


@Injectable()
export class DwIamUserService extends DwUserService {
  constructor(
    protected userStorage: DwUserStorage,
    private iamRepository: DwIamRepository
  ) {
    super(userStorage);
  }


  /**
   * 取得使用者資訊
   * return 返回Observable
   */
  public read(userId?: string): Observable<object> {
    return new Observable((observer): void => {
      this.iamRepository.getUserInfo(userId).subscribe(
        (userDatas) => {
          this.setUserInfo(userDatas);

          const info = {
            success: true,
            description: '', // 取值失敗時, 顯示.
            userInfo: userDatas // 取得的回傳值.
          };
          observer.next(info);
          observer.complete();
        }
      );
    });
  }

}
