import { Inject, Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import fnsFormat from 'date-fns/format';
// 應用共享的模組Repository
import {
  Demo1AsisRepository,
  IDemo1AsisSearchField,
  IDemo1AsisSortSet,
  IGetAsisDetailParam,
  IGetAsisListParam,
} from '../../repository';
import {
  MasterModel,
  DetailsInfoModel,
  DetailsChildInfoModel,
  SearchConditionModel,
  StatusModel
} from '../model';
import { APP_DATE_FORMAT, APP_TIME_FORMAT } from '@webdpt/framework/config';


@Injectable()
export class AsisService {
  public searchStatusOptions: Observable<StatusModel[]> = StatusModel.getList();
  constructor(
    private searchConditionModel: SearchConditionModel,
    private demo1AsisRepository: Demo1AsisRepository,
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
   * @memberof AsisService
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
   * 查詢取列表
   *
   * @param  pageIndex
   * @param  pageSize
   * @param  searchParam
   * @param  sortSet
   * @returns {Observable<any>}
   * @memberof AsisService
   */
  public getAsisList(pageIndex: number,
    pageSize: number,
    searchParam: IDemo1AsisSearchField,
    sortSet: IDemo1AsisSortSet[]): Observable<any> {

    this.setSearchConditionModel(pageIndex, pageSize, searchParam, sortSet);

    const paramObj: IGetAsisListParam = {
      pageSize: pageSize,
      currentPage: pageIndex,
      param: searchParam,
      sortSet: sortSet
    };
    // 列表
    const obsGetAsisList = this.demo1AsisRepository.getAsisList(paramObj).pipe(
      switchMap(
        asisListResp => {
          // 狀態碼
          return StatusModel.getList();
        },
        (asisListResp: any, enumStatus: StatusModel[]) => {
          // console.log(asisListResp);
          // console.log(enumStatus);
          const enumStatusLen = enumStatus.length;
          if (asisListResp.hasOwnProperty('datas')) {
            asisListResp.datas.forEach(obj => {
              if (obj.hasOwnProperty('status')) {
                for (let i = 0; i < enumStatusLen; i++) {
                  if (enumStatus[i].value === obj.status) {
                    obj.statusDesc = enumStatus[i].label;
                  }
                }
              }
            });
          }
          return asisListResp;
        }
      )
    );

    return obsGetAsisList;
  }
  public deleteAsisList(params: { 'asisIds': string[] }): Observable<any> {
    return this.demo1AsisRepository.deleteAsisList(params);
  }
  /**
   * 取得詳情
   *
   * @param  asisId 編號
   * @returns {Observable<any>}
   * @memberof AsisService
   */
  public getAsisDetail(asisId: string): Observable<any> {
    const paramObj: IGetAsisDetailParam = {
      asisId: asisId
    };

    return this.demo1AsisRepository.getAsisDetail(paramObj);
  }

  /**
   * 修改
   *
   * @param master
   * @param detail
   * @param  dwDateFormat
   * @returns {Observable<any>}
   * @memberof AsisService
   */
  public modifyAsis(master: MasterModel, detail: DetailsInfoModel[], detailChildren: any[]): Observable<any> {
    // 日期轉字串再傳給API
    const masterStr = {
      ...master,
      asisDate: (master.asisDate instanceof Date) ? fnsFormat(master.asisDate, this.getDateTimeFormat()) : master.asisDate
    };

    const paramObj = {
      master: masterStr,
      detail: detail,
      detailChildren: detailChildren
    };

    return this.demo1AsisRepository.modifyAsis(paramObj).pipe(
      map(
        result => {
          return result;
        }
      )
    );
  }
  /**
    * 新增單頭
    *
    * @param master
    * @param detail
    * @param dwDateFormat
    * @returns {Observable<any>}
    * @memberof AsisService
    */
  public addAsis(master: MasterModel, detail: DetailsInfoModel[], detailChildren: any[]): Observable<any> {
    // 日期轉字串再傳給API
    const masterStr = {
      ...master,
      asisDate: (master.asisDate instanceof Date) ? fnsFormat(master.asisDate, this.getDateTimeFormat()) : master.asisDate
    };

    const paramObj = {
      master: masterStr,
      detail: detail,
      detailChildren: detailChildren
    };
    console.log(paramObj);
    return this.demo1AsisRepository.addAsis(paramObj).pipe(
      map(
        result => {
          return result;
        }
      )
    );
  }
  public asisDetailMaxSeq(list: DetailsInfoModel[]): number {
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
   * @param pageIndex
   * @param pageSize
   * @param searchParam
   * @param sortSet
   * @memberof AsisService
   */
  private setSearchConditionModel(pageIndex: number, pageSize: number,
    searchParam: IDemo1AsisSearchField, sortSet: IDemo1AsisSortSet[]): void {
    this.searchConditionModel.pageIndex = pageIndex;
    this.searchConditionModel.pageSize = pageSize;
    this.searchConditionModel.fields = searchParam;
    this.searchConditionModel.sortSet = sortSet;
  }
}
