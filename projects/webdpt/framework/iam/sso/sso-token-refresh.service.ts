import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';

import { DW_APP_TYPE } from '@webdpt/framework/config';
import { DwIamRepository } from '../iam-repository';

@Injectable()
export class DwSsoTokenRefreshService {
  constructor(
    public iamRepository: DwIamRepository,
    @Inject(DW_APP_TYPE) public dwAppType: string
  ) {
  }

  /**
   * SSO刷新應用下的UserToken
   */
  public tokenRefreshApp(userToken: string): Observable<string> {
    if (this.dwAppType === 'SharedApp') {
      // 非產品不刷新 ex.業務中台
      return Observable.create(
        (observer: any) => { // 格式要和tokenRefreshApp()相同
          const response = {
            user_token: userToken
          };

          observer.next(response);
          observer.complete();
        }
      );
    } else {
      // 產品刷新
      return this.iamRepository.tokenRefreshApp();
    }
  }
}
