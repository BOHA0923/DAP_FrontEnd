import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { DwDapHttpClient } from './dap-http-client';
import { DwHttpModule } from '@webdpt/framework/http';


@Injectable({
  providedIn: DwHttpModule
})
export class DwDapRepository {

  constructor(private http: DwDapHttpClient) {
  }

  /**
   * 取得組織樹資料.
   *
   */
  getOrganizeTree(param: any): Observable<any> {
    return this.http.post('restful/service/DWSys/IOrgService/getOrg', { params: param });
  }

}
