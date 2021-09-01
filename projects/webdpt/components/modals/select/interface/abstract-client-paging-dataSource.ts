import { Observable } from 'rxjs';

import { IDwSelectModalDataSource } from './select-modal-datasource.interface';


/**
 * 開窗服務 - 前端分頁
 *
 */

export abstract class DwClientPagingDataSource implements IDwSelectModalDataSource {
  abstract getDataList(pageNumber: number, pageSize: number): Observable<any>; // 取清單.
}
