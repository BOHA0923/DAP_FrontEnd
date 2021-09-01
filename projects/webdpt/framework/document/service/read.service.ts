import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { IDwRead } from '../interface/read-interface';

@Injectable()
export class DwReadService implements IDwRead {
  constructor(
    private http: HttpClient
  ) { }

  read(url: string, oid: any): Observable<any> {
    let params: any;
    if (Array.isArray(oid)) {
      params = oid;
    } else {
      params = [oid];
    }

    return this.http.get(url, { params: { oids: JSON.stringify(params) } });
  }
}
