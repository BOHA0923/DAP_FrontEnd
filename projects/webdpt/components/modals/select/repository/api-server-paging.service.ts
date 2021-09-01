import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ISelectModalDataSourceResponse } from '../interface/select-modal.interface';
import { DwServerPagingDataSource } from '../interface/abstract-server-paging-dataSource';
import { DwQueryInfo, DwQueryOrder, DwQueryCondition, DwQueryConditionOperator } from '@webdpt/framework/document';
import { DwListService } from '@webdpt/framework/document';
import { DwHttpClient } from '@webdpt/framework/http';

// @Injectable() // Can't resolve all parameters ([object Object], ?, ?, ?). This will become an error in Angular v6.x.
export class ApiServerPagingService extends DwServerPagingDataSource {
  private _url: string;
  private _tableName: string;
  private _searchFileds: Array<string>;
  private _queryInfo: DwQueryInfo;
  private _listService: DwListService;
  private _result: ISelectModalDataSourceResponse;

  constructor(
    http: DwHttpClient,
    url: string,
    tableName: string,
    searchFileds?: Array<string>
  ) {
    super();
    this._url = url;
    this._tableName = tableName;
    this._listService = new DwListService(http as any);
    this._searchFileds = (searchFileds) ? searchFileds : [];
  }


  /**
   * 向後端取得清單.
   *
   * param {number} pageNumber: 當前頁碼.
   * param {number} pageSize: 每頁展示多少數據.
   * param {string} queryString: 搜尋字串.
   * returns {Observable<any>}
   */
  public getDataList(pageNumber: number, pageSize: number, queryString: string, orderby: DwQueryOrder): Observable<any> {
    this._queryInfo = new DwQueryInfo();
    this._queryInfo.pageSize = pageSize;
    this._queryInfo.pageNumber = pageNumber;
    this._setCondition(queryString);
    this._setOrderBy(orderby);

    return this._listService.list(this._url, this._queryInfo.getRawValue()).pipe(
      map((ret: any) => {
        this._result = {
          currentPage: pageNumber,
          datas: Object.assign([], ret.data[this._tableName]),
          pageCount: ret.pageCount,
          pageSize: pageSize,
          rowCount: ret.rowCount
        };
        return this._result;
      }));
  }


  /**
   * 設定 queryIfo 的 orderfields(允許一個欄位的排序).
   *
   * param {Array<any>} orderfields: 排序欄位 object.
   */
  private _setOrderBy(orderby: DwQueryOrder): void {
    // 如果沒有排序欄位, 不需要產生 order field.
    if (!orderby.name) {
      return;
    }

    // 取得最後的排序.
    this._queryInfo.addOrderField(orderby);
  }


  /**
   * 依搜尋字串, 建立 queryIfo 的 condition, 需包括初始條件.
   *
   * param {string} queryString: 搜尋字串.
   * returns {Array<any>}
   */
  private _setCondition(queryString: string): void {
    if (!queryString) {
      return;
    }

    if (queryString && this._searchFileds.length > 0) {
      const conditions = new DwQueryCondition(DwQueryConditionOperator.OR);
      this._searchFileds.forEach((val) => {
        conditions.addCondition({ name: val, value: '%' + queryString + '%', operator: DwQueryConditionOperator.LIKE });
      });

      this._queryInfo.setCondition(conditions);
    }
  }

}
