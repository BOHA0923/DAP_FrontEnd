import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { DwDmcModule } from './dmc.module';


@Injectable({
  providedIn: DwDmcModule
})
export class DwLoginDmcRepository {
  constructor() {
  }

  /**
    * 後端登入 DMC 文檔中心
    */
  loginDmc(): Observable<string> {
    // TODO: return API
    return Observable.create(
      (observer: any) => {
        observer.next(null);
        observer.complete();
      }
    );
  }
}
