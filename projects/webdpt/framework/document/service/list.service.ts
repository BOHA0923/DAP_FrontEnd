import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { IDwList } from '../interface/list-interface';

@Injectable()
export class DwListService implements IDwList {
  constructor(
    private http: HttpClient
  ) { }

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
