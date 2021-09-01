import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { IDwUpdate } from '@webdpt/framework/document';
import { DwDapHttpClient } from '../dap-http-client';


@Injectable()
export class DwDapUpdateService implements IDwUpdate {
  constructor(public http: DwDapHttpClient) { }
  update(url: string, data: object): Observable<any> {
    return this.http.put(url, {dataset: data});
  }
}
