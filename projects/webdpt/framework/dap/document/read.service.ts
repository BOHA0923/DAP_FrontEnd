import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { IDwRead } from '@webdpt/framework/document';
import { DwDapHttpClient } from '../dap-http-client';


@Injectable()
export class DwDapReadService implements IDwRead {
  constructor(private http: DwDapHttpClient) { }

  read(url: string, oid: any): Observable<any> {
    let params: any;
    if (Array.isArray(oid)) {
      params = oid;
    } else {
      params = [oid];
    }

    return this.http.get(url, { params: {oids: JSON.stringify(params)}});
  }
}
