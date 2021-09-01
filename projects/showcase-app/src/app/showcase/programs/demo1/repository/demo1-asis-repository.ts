import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IGetAsisDetailParam, IGetAsisListParam } from './demo1-asis-repository-interface';
import { MasterModel } from '../asis/model/index';

@Injectable()
export class Demo1AsisRepository {
  constructor(private http: HttpClient) { }

  /**
   * 取列表
   *
   * @param params
   * @returns {Observable<any>}
   * @memberof Demo1AsisRepository
   */
  getAsisList(params: IGetAsisListParam): Observable<any> {
    return this.http.post('showcase/demo1/getAsisList', params);
  }
  deleteAsisList(params: { [param: string]: string[] }): Observable<any> {
    return this.http.post('showcase/demo1/deleteAsisList', params);
  }
  /**
   * 取明細
   *
   * @param params
   * @returns {Observable<any>}
   * @memberof Demo1AsisRepository
   */
  getAsisDetail(params: IGetAsisDetailParam): Observable<any> {
    return this.http.post('showcase/demo1/getAsisDetail', params);

    // return this.http.post('showcase/demo1/getAsisDetail', params).pipe( // 模擬delay
    //   delay(2000)
    // );
  }

  /**
   * 修改
   *
   * @param params
   * @returns {Observable<any>}
   * @memberof Demo1AsisRepository
   */
  modifyAsis(params: any): Observable<any> {
    return this.http.post('showcase/demo1/modifyAsis', params);
  }
  /**
   * 新增
   *
   * @param params
   * @returns {Observable<any>}
   * @memberof Demo1AsisRepository
   */
  addAsis(params: any): Observable<any> {
    return this.http.post('showcase/demo1/addAsis', params);
  }
}


