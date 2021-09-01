import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { DwEmcHttpClient } from './emc-http-client';
import { DwHttpModule } from '@webdpt/framework/http';


@Injectable({
  providedIn: DwHttpModule
})
export class DwEmcRepository {

  constructor(private http: DwEmcHttpClient) {
  }


  /**
   * 取得 [mail驗證碼 / 手機驗證碼].
   *
   * param {string} type: 驗證碼類型, [email: Email] / [telephone: 手機號碼].
   * param {string} value: email 帳號 / 手機號碼.
   *
   * returns {Observable<any>}
   */
  verificationCode(type: string, value: string): Observable<any> {
    return this.http.post(`api/emc/v1/verificationCode/${type}/${value}/changepassword`, {});
  }


}
