import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ISelectModalDataSourceResponse, DwClientPagingDataSource } from '@webdpt/components/modals/select';


// @Injectable() // Can't resolve all parameters ([object Object], ?). This will become an error in Angular v6.x.
export class MockDataDataSourceService extends DwClientPagingDataSource {
  private _url: string;
  private _http: HttpClient;
  private _result: ISelectModalDataSourceResponse;

  constructor(http: HttpClient, url: string) {
    super();
    this._http = http;
    this._url = url;
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
    return this._http.post(this._url, {}).pipe(
      map((ret: any) => {
        this._result = {
          currentPage: pageNumber,
          datas: Object.assign([], ret),
          pageCount: Math.ceil(ret.length / pageSize),
          pageSize: pageSize,
          rowCount: ret.length
        };
      return this._result;
    }));
  }

}
