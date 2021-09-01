import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IGetGroupDetailParam, IGetGroupListParam } from './demo1-group-repository-interface';
import { MasterModel } from '../group/model/index';

@Injectable()
export class Demo1GroupRepository {
  constructor(private http: HttpClient) { }

  /**
   * 取集團列表
   *
   * @param params
   * @returns {Observable<any>}
   * @memberof Demo1GroupRepository
   */
  getGroupList(params: IGetGroupListParam): Observable<any> {
    return this.http.post('showcase/demo1/getGroupList', params);
  }
  deleteGroupList(params: { [param: string]: string[] }): Observable<any> {
    return this.http.post('showcase/demo1/deleteGroupList', params);
  }
  /**
   * 取集團明細
   *
   * @param params
   * @returns {Observable<any>}
   * @memberof Demo1GroupRepository
   */
  getGroupDetail(params: IGetGroupDetailParam): Observable<any> {
    return this.http.post('showcase/demo1/getGroupDetail', params);

    // return this.http.post('showcase/demo1/getGroupDetail', params).pipe( // 模擬delay
    //   delay(2000)
    // );
  }

  /**
   * 集團修改
   *
   * @param params
   * @returns {Observable<any>}
   * @memberof Demo1GroupRepository
   */
  modifyGroup(params: any): Observable<any> {
    return this.http.post('showcase/demo1/modifyGroup', params);
  }
  /**
   * 集團新增
   *
   * @param params
   * @returns {Observable<any>}
   * @memberof Demo1GroupRepository
   */
  addGroup(params: any): Observable<any> {
    return this.http.post('showcase/demo1/addGroup', params);
  }
}


