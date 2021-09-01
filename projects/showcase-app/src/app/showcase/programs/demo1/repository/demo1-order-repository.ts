import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IGetOrderDetailParam, IGetOrderListParam } from './demo1-order-repository-interface';

@Injectable()
export class Demo1OrderRepository {
  constructor(private http: HttpClient) { }

  /**
   * 取訂單列表
   *
   * @param params
   * @returns {Observable<any>}
   * @memberof Demo1OrderRepository
   */
  getOrderList(params: IGetOrderListParam): Observable<any> {
    return this.http.post('showcase/demo1/getOrderList', params);
  }

  /**
   * 取訂單明細
   *
   * @param params
   * @returns {Observable<any>}
   * @memberof Demo1OrderRepository
   */
  getOrderDetail(params: IGetOrderDetailParam): Observable<any> {
    return this.http.post('showcase/demo1/getOrderDetail', params);

    // return this.http.post('showcase/demo1/getOrderDetail', params).pipe( // 模擬delay
    //   delay(2000)
    // );
  }

  /**
   * 訂單修改
   *
   * @param params
   * @returns {Observable<any>}
   * @memberof Demo1OrderRepository
   */
  modifyOrder(params: any): Observable<any> {
    return this.http.post('showcase/demo1/modifyOrder', params);
  }
}


