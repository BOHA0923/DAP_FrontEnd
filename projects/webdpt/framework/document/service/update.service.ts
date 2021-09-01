import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { IDwUpdate } from '../interface/update-interface';

@Injectable()
export class DwUpdateService implements IDwUpdate {
  constructor(
    private http: HttpClient
  ) { }

  update(url: string, data: object): Observable<any> {
    return this.http.put(url, { dataset: data });
  }
}
