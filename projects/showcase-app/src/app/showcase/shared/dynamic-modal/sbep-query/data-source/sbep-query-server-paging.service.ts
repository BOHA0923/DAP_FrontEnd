import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { DwListService } from '@webdpt/framework/document';
import { SbepQueryInfo } from '../model/sbep-query';

// @Injectable() // Can't resolve all parameters ([object Object], ?, ?, ?). This will become an error in Angular v6.x.
export class SbepQueryServerPagingService {
  private _selectWindowId: string;
  private _url: string;
  private _listService: DwListService;
  private _pickList: object;

  constructor(
    http: HttpClient,
    url: string,
    selectWindowId: any
  ) {
    this._pickList = {};
    this._url = url;
    this._selectWindowId = selectWindowId;
    this._listService = new DwListService(http);
  }


  /**
   * 向後端取得清單.
   *
   * param {number} pageNumber: 當前頁碼.
   * param {number} pageSize: 每頁展示多少數據.
   * param {string} queryString: 搜尋字串.
   * returns {Observable<any>}
   */
  public getDataList(pageNumber: number, pageSize: number, queryInfo: SbepQueryInfo): Observable<any> {
    queryInfo.selectWindowId = this._selectWindowId;
    queryInfo.pageSize = pageSize;
    queryInfo.pageNumber = pageNumber;

    return this._listService.list(this._url, queryInfo.getRawValue()).pipe(
      map((ret: any) => {
        this._setPickList(ret.data);
        ret.data = this._mapPickList(ret.data);
        return ret;
      })
    );
  }


  /**
   * 將欄位定義裡, 需要轉換值成名稱的對應來源取出.
   *
   * param {*} retData
   * returns {void}
   */
  private _setPickList(retData: any): void {
    if (!retData.hasOwnProperty('fields')) {
      return;
    }

    retData.fields.forEach(ele => {
      // 欄位定義裡, 有 picklist 表示為下拉選單, 其值為來源.
      if (ele.hasOwnProperty('picklist') && ele.picklist) {
        // 欄位名稱 => 選單來源.
        this._pickList[ele.field_name] = ele.picklist;
      }
    });
  }

  /**
   * 將 rows 裡, 將有需要轉換[選單值]成[名稱]的欄位值, 進行轉換.
   *
   * param {*} retData: 後端回參裡的 data.
   * returns {*}: 轉換後, return.
   */
  private _mapPickList(retData: any): any {
    const pickListKeys = Object.keys(this._pickList);
    if (pickListKeys.length === 0) {
      return retData;
    }

    retData.rows.forEach(ele => {
      for (const prop in ele) {
        if (this._pickList[prop] !== undefined) {
          const value = ele[prop];
          ele[prop] = this._getPickListValue(retData.picklists, this._pickList[prop], value);
        }
      }
    });

    return retData;
  }

  /**
   * 將下拉選單值轉換成名稱.
   *
   * param {Array<any>} picklists: 所有的選單.
   * param {string} sourceName: 進行比對的選單名稱.
   * param {*} value: 值.
   * returns {string}: 比對到的名稱.
   */
  private _getPickListValue(picklists: Array<any>, sourceName: string, value: any): string {
    let _retult = '';

    picklists.forEach(ele => {
      if (!_retult && ele.name === sourceName) {
        // map 結果只會有一個元素.
        const _ret = ele.child.items.filter(val => val.id === value).map(ret => {
          return ret.display_name;
        });

        // 比對到的名稱.
        if (_ret.length > 0) {
          _retult = _ret[0];
        }
      }
    });

    return _retult;
  }

}
