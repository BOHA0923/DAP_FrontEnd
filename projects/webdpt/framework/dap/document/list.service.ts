import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { IDwList } from '@webdpt/framework/document';
import { DwDapHttpClient } from '../dap-http-client';


@Injectable()
export class DwDapListService implements IDwList {
  constructor(private http: DwDapHttpClient) { }
  list(url: string, queryInfo: any): Observable<any> {
    const conditions = [];
    // TODO
    // for (const item of Object.values(queryInfo.condition.items)) {
    //   if (item['value'] !== '') {conditions.push(item); }
    // }
    // queryInfo.condition.items = conditions;
    return this.http.get(url, { params: { queryInfo: JSON.stringify(queryInfo) } });
  }
}
