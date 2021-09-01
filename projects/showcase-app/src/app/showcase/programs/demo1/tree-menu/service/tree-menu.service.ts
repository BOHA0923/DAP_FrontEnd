import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import fnsFormat from 'date-fns/format';

import { APP_DATE_FORMAT } from '@webdpt/framework/config';
import { HttpClient } from '@angular/common/http';
import { TreeDetailsInfoModel, TreeMasterModel } from '../model';
import {
  TreeStatusModel,
  TreeCurrencyModel,
  TreeExchangeSourceModel,
  TreeExchangeClassModel,
  TreeExchangeWayModel
} from '../model/tree-enum.model';
import { IGetTreeDetailParam } from '../model/tree-model';

@Injectable()
export class TreeMenuService {
  public searchStatusOptions: Observable<TreeStatusModel[]> = TreeStatusModel.getList();
  public currencyOptions: Observable<TreeCurrencyModel[]> = TreeCurrencyModel.getList();
  public exchangeSourceOptions: Observable<TreeExchangeSourceModel[]> = TreeExchangeSourceModel.getList();
  public exchangeClassOptions: Observable<TreeExchangeClassModel[]> = TreeExchangeClassModel.getList();
  public exchangeWayOptions: Observable<TreeExchangeWayModel[]> = TreeExchangeWayModel.getList();

  constructor(
    private http: HttpClient,
    @Inject(APP_DATE_FORMAT) private dwDateFormat: string) {
  }

  /**
   *  依列舉value值返回label值
   *
   * @param  id //value值
   * @param  modelName //enum model
   * @returns {Observable<any>}
   * @memberof TreeMenuService
   */
  public showLabel(id: string, modelName: string): Observable<any> {
    return Observable.create(observer => {
      this[modelName].subscribe((result) => {
        const filteredOption = result.filter((option) => {
          return option.value === id;
        });
        if (filteredOption.length) {
          observer.next(filteredOption[0].label);
          observer.complete();
        } else {
          observer.next('');
          observer.complete();
        }
      });
    });
  }

  /**
   * 提供需轉換的日期格式.
   *
   * @returns {string}
   * @memberof TreeMenuService
   */
  public getDateFormat(): string {
    return this.dwDateFormat;
  }
  /**
   * 刪除右側單頭+單身.
   *
   * @param params 集團 id.
   * @returns {Observable<any>}
   * @memberof TreeMenuService
   */
  public deleteTreeList(params: { 'groupIds': string[] }): Observable<any> {
    return this.http.post('showcase/demo1/tree-menu/deleteTreeList', params);
  }

  /**
   * 取得單頭(集團)詳情
   *
   * @param  groupId 集團編號
   * @returns {Observable<any>}
   * @memberof TreeMenuService
   */
  public getTreeDetail(groupId: string): Observable<any> {
    const paramObj: IGetTreeDetailParam = {
      groupId: groupId
    };
    return this.http.post('showcase/demo1/tree-menu/getTreeDetail', paramObj);
  }

  /**
   * 修改單頭(集團)
   *
   * @param master
   * @param detail
   * @param  dwDateFormat
   * @returns {Observable<any>}
   * @memberof TreeMenuService
   */
  public modifyTree(master: TreeMasterModel, detail: TreeDetailsInfoModel[]): Observable<any> {
    // 日期轉字串再傳給API
    const masterStr = {
      ...master,
      groupDate: (master.groupDate instanceof Date) ? fnsFormat(master.groupDate, this.dwDateFormat) : master.groupDate
    };

    const paramObj = {
      master: masterStr,
      detail: detail
    };

    return this.http.post('showcase/demo1/tree-menu/modifyTree', paramObj).pipe(
      map(
        result => {
          return result;
        }
      )
    );
  }

  /**
   * 新增單頭(集團)
   *
   * @param master
   * @param detail
   * @param dwDateFormat
   * @returns {Observable<any>}
   * @memberof TreeMenuService
   */
  public addTree(master: TreeMasterModel, detail: TreeDetailsInfoModel[]): Observable<any> {
    // 日期轉字串再傳給API
    const masterStr = {
      ...master,
      groupDate: (master.groupDate instanceof Date) ? fnsFormat(master.groupDate, this.dwDateFormat) : master.groupDate
    };

    const paramObj = {
      master: masterStr,
      detail: detail
    };

    return this.http.post('showcase/demo1/tree-menu/addTree', paramObj).pipe(
      map(
        result => {
          return result;
        }
      )
    );
  }

  /**
   * 取得單身的最大序號.
   *
   * @param list 單身.
   * @returns {number} 單身的最大序號.
   * @memberof TreeMenuService
   */
  public treeDetailMaxSeq(list: TreeDetailsInfoModel[]): number {
    let maxSeq = 0;

    const getMax = (max: number, cur: number): number => Math.max(max, cur);
    maxSeq = list.map(
      item => {
        return item.seq;
      }
    ).reduce(getMax, 0);

    return maxSeq;
  }

  /**
   * 取得樹狀階層
   *
   * @returns {Observable<any>}
   * @memberof TreeMenuService
   */
  public getTreeMenu(): Observable<any> {
    return this.http.post('showcase/demo1/tree-menu/getTreeMenu', {});
  }

}
