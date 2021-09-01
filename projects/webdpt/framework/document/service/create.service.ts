import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { IDwCreate } from '../interface/create-interface';

@Injectable()
export class DwCreateService implements IDwCreate {

  constructor(
    private http: HttpClient
  ) { }

  create(url: string, data: object): Observable<any> {
    return this.http.post(url, { dataset: data });
  }
}
