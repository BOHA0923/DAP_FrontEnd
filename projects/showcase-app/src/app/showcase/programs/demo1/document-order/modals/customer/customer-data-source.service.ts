import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ISelectModalDataSourceResponse, DwClientPagingDataSource } from '@webdpt/components/modals/select';


// @Injectable() // Can't resolve all parameters ([object Object], ?). This will become an error in Angular v6.x.
export class CustomerDataSourceService extends DwClientPagingDataSource {
  private _result: ISelectModalDataSourceResponse;

  constructor() {
    super();
  }

  /**
   * 向 MockData 取得清單.
   *
   * param {number} pageNumber: 當前頁碼.
   * param {number} pageSize: 每頁展示多少數據.
   * param {string} queryString: 搜尋字串.
   * returns {Observable<any>}
   * memberof ClientPagingService
   */
  public getDataList(pageNumber: number, pageSize: number): Observable<any> {
    const ret = [{
      'id': 'c02',
      'name': 'co2-Ken',
    }, {
      'id': 'c03',
      'name': 'c03-Joe',
    }];

    return Observable.create((observer: any) => {
      this._result = {
        currentPage: pageNumber,
        datas: ret,
        pageCount: Math.ceil(ret.length / pageSize),
        pageSize: pageSize,
        rowCount: ret.length
      };
      observer.next(this._result);
      observer.complete();
    });

  }

}
