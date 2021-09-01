import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { IDwSelectModalDataSource } from './select-modal-datasource.interface';
import { DwQueryOrder } from '@webdpt/framework/document';

/**
 * 開窗服務 - 後端分頁.
 *
 */

export abstract class DwServerPagingDataSource implements IDwSelectModalDataSource {
  abstract getDataList(pageNumber: number, pageSize: number, queryString: string, orderby: DwQueryOrder): Observable<any>; // 取清單.
}
