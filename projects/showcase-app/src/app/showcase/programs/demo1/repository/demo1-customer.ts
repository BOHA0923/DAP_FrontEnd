import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IGetOrderListParam } from './demo1-order-repository-interface';

@Injectable()
export class Demo1CustomerRepository {
  constructor(private http: HttpClient) { }

  /**
   * 取得客戶清單
   *
   * @returns {Observable<any>}
   * @memberof Demo1CustomerRepository
   */
  getCustomers(): Observable<any> {
    return this.http.post('showcase/demo1/getCustomers', {});
  }

}


