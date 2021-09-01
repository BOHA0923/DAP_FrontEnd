import { Inject, Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import fnsFormat from 'date-fns/format';
// 應用共享的模組Repository
import {
  Demo1GroupRepository,
  IDemo1GroupSearchField,
  IDemo1GroupSortSet,
  IGetGroupDetailParam,
  IGetGroupListParam,
} from '../../repository';
import {
  MasterModel,
  DetailsInfoModel,
  SearchConditionModel,
  StatusModel
  , CurrencyModel, ExchangeSourceModel, ExchangeClassModel, ExchangeWayModel
} from '../model';
import { APP_DATE_FORMAT, APP_TIME_FORMAT } from '@webdpt/framework/config';


@Injectable()
export class GroupService {
  public searchStatusOptions: Observable<StatusModel[]> = StatusModel.getList();
  public currencyOptions: Observable<CurrencyModel[]> = CurrencyModel.getList();
  public exchangeSourceOptions: Observable<ExchangeSourceModel[]> = ExchangeSourceModel.getList();
  public exchangeClassOptions: Observable<ExchangeClassModel[]> = ExchangeClassModel.getList();
  public exchangeWayOptions: Observable<ExchangeWayModel[]> = ExchangeWayModel.getList();
  constructor(
    private searchConditionModel: SearchConditionModel,
    private demo1GroupRepository: Demo1GroupRepository,
    @Inject(APP_DATE_FORMAT) private dwDateFormat: string,
    @Inject(APP_TIME_FORMAT) private dwTimeFormat: string

  ) {

  }
  /**
   *  依列舉value值返回label值
   *
   * @param  id //value值
   * @param  modelName //enum model
   * @returns {Observable<any>}
   * @memberof GroupService
   */
  showLabel(id: string, modelName: string): Observable<any> {
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
  getDateFormat(): string {
    return this.dwDateFormat;
  }
  getTimeFormat(): string {
    return this.dwTimeFormat;
  }
  getDateTimeFormat(): string {
    return `${this.getDateFormat()} ${this.getTimeFormat()}`;
  }
  /**
   * 查詢取集團列表
   *
   * @param  pageIndex
   * @param  pageSize
   * @param  searchParam
   * @param  sortSet
   * @returns {Observable<any>}
   * @memberof GroupService
   */
  public getGroupList(pageIndex: number,
    pageSize: number,
    searchParam: IDemo1GroupSearchField,
    sortSet: IDemo1GroupSortSet[]): Observable<any> {

    this.setSearchConditionModel(pageIndex, pageSize, searchParam, sortSet);

    const paramObj: IGetGroupListParam = {
      pageSize: pageSize,
      currentPage: pageIndex,
      param: searchParam,
      sortSet: sortSet
    };
    // 集團列表
    const obsGetGroupList = this.demo1GroupRepository.getGroupList(paramObj).pipe(
      switchMap(
        groupListResp => {
          // 狀態碼
          return StatusModel.getList();
        },
        (groupListResp: any, enumStatus: StatusModel[]) => {
          // console.log(groupListResp);
          // console.log(enumStatus);
          const enumStatusLen = enumStatus.length;
          if (groupListResp.hasOwnProperty('datas')) {
            groupListResp.datas.forEach(obj => {
              if (obj.hasOwnProperty('status')) {
                for (let i = 0; i < enumStatusLen; i++) {
                  if (enumStatus[i].value === obj.status) {
                    obj.statusDesc = enumStatus[i].label;
                  }
                }
              }
            });
          }
          return groupListResp;
        }
      )
    );

    return obsGetGroupList;
  }
  public deleteGroupList(params: { 'groupIds': string[] }): Observable<any> {
    return this.demo1GroupRepository.deleteGroupList(params);
  }
  /**
   * 取得集團詳情
   *
   * @param  groupId 集團編號
   * @returns {Observable<any>}
   * @memberof GroupService
   */
  public getGroupDetail(groupId: string): Observable<any> {
    const paramObj: IGetGroupDetailParam = {
      groupId: groupId
    };

    return this.demo1GroupRepository.getGroupDetail(paramObj);
  }

  /**
   * 修改集團
   *
   * @param  master
   * @param  detail
   * @param  dwDateFormat
   * @returns {Observable<any>}
   * @memberof GroupService
   */
  public modifyGroup(master: MasterModel, detail: DetailsInfoModel[]): Observable<any> {
    // 日期轉字串再傳給API
    const masterStr = {
      ...master,
      groupDate: (master.groupDate instanceof Date) ? fnsFormat(master.groupDate, this.getDateTimeFormat()) : master.groupDate
    };

    const paramObj = {
      master: masterStr,
      detail: detail
    };

    return this.demo1GroupRepository.modifyGroup(paramObj).pipe(
      map(
        result => {
          return result;
        }
      )
    );
  }
  /**
    * 新增集團
    *
    * @param  master
    * @param  detail
    * @param  dwDateFormat
    * @returns {Observable<any>}
    * @memberof GroupService
    */
  public addGroup(master: MasterModel, detail: DetailsInfoModel[]): Observable<any> {
    // 日期轉字串再傳給API
    const masterStr = {
      ...master,
      groupDate: (master.groupDate instanceof Date) ? fnsFormat(master.groupDate, this.getDateTimeFormat()) : master.groupDate
    };

    const paramObj = {
      master: masterStr,
      detail: detail
    };

    return this.demo1GroupRepository.addGroup(paramObj).pipe(
      map(
        result => {
          return result;
        }
      )
    );
  }
  public groupDetailMaxSeq(list: DetailsInfoModel[]): number {
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
   * 設定查詢條件
   *
   * @private
   * @param  pageIndex
   * @param  pageSize
   * @param  searchParam
   * @param  sortSet
   * @memberof GroupService
   */
  private setSearchConditionModel(pageIndex: number, pageSize: number,
    searchParam: IDemo1GroupSearchField, sortSet: IDemo1GroupSortSet[]): void {
    this.searchConditionModel.pageIndex = pageIndex;
    this.searchConditionModel.pageSize = pageSize;
    this.searchConditionModel.fields = searchParam;
    this.searchConditionModel.sortSet = sortSet;
  }
}
