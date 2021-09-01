import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { IDwDelete } from '@webdpt/framework/document';
import { DwDapHttpClient } from '../dap-http-client';


@Injectable()
export class DwDapDeleteService implements IDwDelete {
  constructor(public http: DwDapHttpClient) { }
  delete(url: string, oid: any): Observable<any> {
    if (Array.isArray(oid)) {
      return this.http.request('DELETE', url, { body: {oids: oid} });
    } else {
      return this.http.request('DELETE', url, { body: {dataset: oid} });
    }
  }
}
