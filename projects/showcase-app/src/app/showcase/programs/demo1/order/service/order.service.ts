import { Inject, Injectable } from '@angular/core';
import { FormArray } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import fnsFormat from 'date-fns/format';
// 應用共享的模組Repository
import {
  Demo1OrderRepository,
  IDemo1OrderSearchField,
  IDemo1OrderSortSet,
  IGetOrderDetailParam,
  IGetOrderListParam
} from '../../repository';
import {
  OrderDistributionOrderStatusModel,
  OrderGenderModel,
  OrderMasterModel,
  OrderProductInfo,
  OrderSearchConditionModel,
  OrderStatusModel
} from '../model';
import { APP_DATE_FORMAT } from '@webdpt/framework/config';


@Injectable()
export class OrderService {

  constructor(
    private searchConditionModel: OrderSearchConditionModel,
    private demo1OrderRepository: Demo1OrderRepository,
    @Inject(APP_DATE_FORMAT) private dwDateFormat: string) {
  }

  getDateFormat(): string {
    return this.dwDateFormat;
  }

  /**
   * 查詢取訂單列表
   *
   * @param pageIndex
   * @param pageSize
   * @param searchParam
   * @param sortSet
   * @returns {Observable<any>}
   * @memberof OrderService
   */
  public getOrderList(
    pageIndex: number,
    pageSize: number,
    searchParam: IDemo1OrderSearchField,
    sortSet: IDemo1OrderSortSet[]
  ): Observable<any> {

    this.setOrderSearchConditionModel(pageIndex, pageSize, searchParam, sortSet);

    const paramObj: IGetOrderListParam = {
      pageSize: pageSize,
      currentPage: pageIndex,
      param: searchParam,
      sortSet: sortSet
    };

    // 訂單列表
    // switchMap 將每個源值投射成 Observable，該 Observable 會合併到輸出 Observable 中， 並且只發出最新投射的 Observable 中的值。
    const obsGetOrderList = this.demo1OrderRepository.getOrderList(paramObj).pipe(
      switchMap(
        orderList => {
          // 性別篩選列舉
          return OrderGenderModel.getList();
        },
        (orderList: any, enumGender: OrderGenderModel[]) => {
          const enumGenderLen = enumGender.length;
          if (orderList.hasOwnProperty('datas')) {
            // 業務員性別描述
            orderList.datas.forEach(obj => {
              if (obj.hasOwnProperty('gender')) {
                for (let i = 0; i < enumGenderLen; i++) {
                  if (enumGender[i].value === obj.gender) {
                    obj.genderDesc = enumGender[i].label;
                  }
                }
              }
            });
          }
          return orderList;
        }
      ),
      switchMap(
        orderListResp => {
          // 狀態碼
          return OrderStatusModel.getList();
        },
        (orderListResp: any, enumStatus: OrderStatusModel[]) => {
          const enumStatusLen = enumStatus.length;
          if (orderListResp.hasOwnProperty('datas')) {
            // 業務員性別描述
            orderListResp.datas.forEach(obj => {
              if (obj.hasOwnProperty('status')) {
                for (let i = 0; i < enumStatusLen; i++) {
                  if (enumStatus[i].value === obj.status) {
                    obj.statusDesc = enumStatus[i].label;
                  }
                }
              }
            });
          }
          return orderListResp;
        }
      )
    );

    return obsGetOrderList;
  }

  /**
   * 取得訂單詳情
   *
   * @param  orderId 訂單編號
   * @returns {Observable<any>}
   * @memberof OrderService
   */
  public getOrderDetail(orderId: string): Observable<any> {
    const paramObj: IGetOrderDetailParam = {
      orderId: orderId
    };

    const ObsDistributionStatus: Observable<any> = OrderDistributionOrderStatusModel.getList(); // 單身配送狀態碼列舉

    const ObsOrderDetail = ObsDistributionStatus.pipe(
      switchMap(
        statusList => {
          // 取訂單明細
          return this.demo1OrderRepository.getOrderDetail(paramObj);
        },
        (statusListValue: any, orderDetailValue: any) => {
          const detail = orderDetailValue.detail;

          if (detail.length > 0) {
            // 配送狀態碼描述
            detail.forEach(element => {
              element.subtotal = element.price * element.quantity;

              const descItem = statusListValue.filter(status => {
                if (status.key === element.distributionStatus) {
                  return status;
                }
              });

              if (descItem.length === 0) {
                element.distributionStatusDesc = '';
              } else {
                element.distributionStatusDesc = descItem[0].lable;
              }
            });
          }

          return orderDetailValue;
        }
      )
    );

    return ObsOrderDetail;
  }

  /**
   * 修改訂單
   *
   * @param master
   * @param detail
   * @param  dwDateFormat
   * @returns {Observable<any>}
   * @memberof OrderService
   */
  public modifyOrder(master: OrderMasterModel, detail: OrderProductInfo[]): Observable<any> {
    // 日期轉字串再傳給API
    const masterStr = {
      ...master,
      orderDate:  (master.orderDate instanceof Date) ? fnsFormat(master.orderDate, this.dwDateFormat) : master.orderDate
    };

    const paramObj = {
      master: masterStr,
      detail: detail
    };

    return this.demo1OrderRepository.modifyOrder(paramObj).pipe(
      map(
        result => {
          return result;
        }
      )
    );
  }

  public orderDetailMaxSeq(validateFormDetail: FormArray): number {
    let maxSeq = 0;

    const getMax = (max: number, cur: number): number => Math.max(max, cur);

    maxSeq = validateFormDetail.controls.map(
      item => {
        return item.get('seq').value;
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
   * @memberof OrderService
   */
  private setOrderSearchConditionModel(
    pageIndex: number,
    pageSize: number,
    searchParam: IDemo1OrderSearchField,
    sortSet: IDemo1OrderSortSet[]
  ): void {
    this.searchConditionModel.pageIndex = pageIndex;
    this.searchConditionModel.pageSize = pageSize;
    this.searchConditionModel.fields = searchParam;
    this.searchConditionModel.sortSet = sortSet;
  }
}
