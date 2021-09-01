import { Params } from '@angular/router';
import { Observable } from 'rxjs';

import { IDwIframe } from '@webdpt/framework/iframe-core';

/**
 * Finereport動態串接網址可插入Service設計邏輯
 */
export interface IDwIframeFinereportService {

  getIframeFinereportData(programId: string, queryParams: Params, item: IDwIframe): Observable<IDwIframe>;
}

/**
 * Finereport資訊
 */
export interface IDwIframeFinereportInfoService {
  finereportInfo(programId: string, queryParams: Params): Observable<IDwIframe>;
}

