import { Injectable } from '@angular/core';
import { Params } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, distinctUntilChanged } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';

import { IDwIframeGeneralService } from './interface/dw-iframe-service.interface';
import { IDwIframe } from './interface/dw-iframe.interface';
import { DwIframeCoreModule } from './iframe-core.module';


@Injectable({
  providedIn: DwIframeCoreModule
})
export class DwIframeGeneralService implements IDwIframeGeneralService {
  itemRxjsBehavior: BehaviorSubject<IDwIframe>; // 需要透過 service 取得 url.

  constructor() { }

  /**
   * 內嵌外部網頁動態串接網址可插入Service設計邏輯, 在 framework 裡, 不操作而直接 return.
   *
   * @param item: DwIframeComponent 操作 object.
   */
  public getIframeGeneralData(programId: string, queryParams: Params, item: IDwIframe): Observable<IDwIframe> {
    this.itemRxjsBehavior = new BehaviorSubject<IDwIframe>(null);
    this.itemRxjsBehavior.next(item);

    return this.itemRxjsBehavior.asObservable().pipe(
      filter(obsData => obsData !== null), // 不廣播初始值
      distinctUntilChanged() // 有改變時才廣播
    );
  }

}
