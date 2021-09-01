import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';

import { dwStatusListJson } from './model/http-error-statusList';
import { DwErrorHandlerCoreModule } from './error-handler-core.module';


@Injectable({
  providedIn: DwErrorHandlerCoreModule
})
export class DwHttpErrorStatusList {
  private statusList: Array<any>;
  statusList$: BehaviorSubject<Array<any>>;

  constructor() {
    const list: Array<any> = dwStatusListJson;
    this.statusList = [];
    this.statusList$ = new BehaviorSubject<Array<any>>(this.statusList);
    list.forEach(
      item => {
        this.statusList[item.status] = item;
      }
    );
    this.statusList$.next(this.statusList);
  }

  get dwStatusList(): Observable<any> {
    return this.statusList$;
  }
}
