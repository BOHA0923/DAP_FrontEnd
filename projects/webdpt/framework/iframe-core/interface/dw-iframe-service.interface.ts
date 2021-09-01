import { Observable } from 'rxjs';
import { Params } from '@angular/router';

import { IDwIframe } from './dw-iframe.interface';

/**
 * 內嵌外部網頁動態串接網址可插入Service設計邏輯
 */
export interface IDwIframeGeneralService {
  getIframeGeneralData(programId: string, queryParams: Params, item: IDwIframe): Observable<IDwIframe>;
}


/**
 * 內嵌外部網頁資訊
 */
export interface IDwIframeGeneralInfoService {
  generalInfo(programId: string, queryParams: Params): Observable<IDwIframe>;
}
