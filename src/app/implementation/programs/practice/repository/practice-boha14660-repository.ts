import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
const mockResponse = require('../../../../../mock-data/programs/practice/boha14660-list/boha-header.json');

/**@description BOHA14660
 * @export
 * @class PracticeBoha14660Repository
 * @author BOHA, at 21.09.02 THU
 */
@Injectable()
export class PracticeBoha14660Repository {
    constructor(private http: HttpClient) { }
public SearchDatas: any;
    /**
     * 取訂單列表
     *
     * @param params
     * @returns {Observable<any>}
     * @memberof Demo1OrderRepository
     */
    getHeaderList(): Observable<any> {
      this.SearchDatas = mockResponse;
      console.log('....', this.SearchDatas);
      return this.SearchDatas;
    }
 }
