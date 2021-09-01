import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';

import { TranslateService } from '@ngx-translate/core';

import { DwIamRepository } from '@webdpt/framework/iam';

import { DwAccountInfoService } from '@webdpt/framework/account';
import { DwSystemConfigService } from '@webdpt/framework/config';


@Injectable()
export class DwDapAccountInfoService extends DwAccountInfoService {

  constructor(
    protected configService: DwSystemConfigService,
    protected translateService: TranslateService,
    private iamRepository: DwIamRepository
  ) {
    super(configService, translateService);
  }


  /**
   * 驗證 [E-mail / telephone] 是否有重覆.
   *
   * param {string} type: 驗證類型, E-mail或手機號碼.
   * param {string} value: E-mail或手機號碼.
   *
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
