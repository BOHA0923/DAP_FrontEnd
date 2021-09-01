import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { IDwCreate } from '@webdpt/framework/document';
import { DwDapHttpClient } from '../dap-http-client';


@Injectable()
export class DwDapCreateService implements IDwCreate {

  constructor(private http: DwDapHttpClient) { }

  create(url: string, data: object): Observable<any> {
    return this.http.post(url, {dataset: data});
  }
}
