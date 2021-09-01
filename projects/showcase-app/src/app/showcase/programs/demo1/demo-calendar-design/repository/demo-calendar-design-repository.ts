import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { DW_APP_ID } from '@webdpt/framework/config';
import { DwCmcHttpClient } from '@webdpt/framework/cmc';
import { DwPlanCalendarRepository } from '@webdpt/framework/plan-calendar';

/**
 * 【Demo】行事曆Repository
 */
@Injectable()
export class DemoCalendarDesignRepository extends DwPlanCalendarRepository {
  constructor(
    public http: DwCmcHttpClient,
    @Inject(DW_APP_ID) public dwAppId: string,
  ) {
    super(http, dwAppId);
  }

  // /**
  //  * 新增行事曆
  //  */
  // calendarsCreate(params: any): Observable<any> {
  //   return this.http.post('api/cmc/v2/calendars/create', params);
  // }

  // /**
  //  * 修改行事曆
  //  */
  // calendarsUpdate(params: any): Observable<any> {
  //   return this.http.post('api/cmc/v2/calendars/update', params);
  // }

  // /**
  //  * 刪除行事曆
  //  */
  // calendarsDelete(params: any): Observable<any> {
  //   return this.http.post('api/cmc/v2/calendars/remove', params);
  // }

  /**
   * 行事曆可訂閱列表
   *
   * @param appArr 指定應用，預設為登入的應用
   */
  calendarsSubscriptionList(appArr: Array<string> = []): Observable<any> {
    console.log('【Demo】行事曆可訂閱列表');
    const params = {
      appIds: []
    };

    // 預設為登入的應用
    if (appArr.length === 0) {
      params.appIds.push(this.dwAppId);
    } else {
      params.appIds = JSON.parse(JSON.stringify(appArr));
    }

    return this.http.post('api/cmc/v2/calendars/subscription/list', params).pipe(
      map(
        (response: any) => {
          const list = [];

          response.forEach(
            (calendarInfo: any) => {
              // 行事曆層級：TENANT（企業級），APP（應用級）
              if (calendarInfo.category === 'TENANT' || calendarInfo.category === 'APP') {
                list.push(calendarInfo);
              }
            }
          );

          return list;
        }
      )
    );
  }

  // /**
  //  * 行事曆訂閱
  //  */
  // calendarsSubscribe(params: any): Observable<any> {
  //   return this.http.post('api/cmc/v2/calendars/subscribe', params);
  // }

  // /**
  //  * 行事曆取消訂閱
  //  */
  // calendarsUnSubscribe(params: any): Observable<any> {
  //   return this.http.post('api/cmc/v2/calendars/unsubscribe', params);
  // }

  /**
   * 行事曆列表(已訂閱)
   *
   * @param appArr 指定應用，預設為登入的應用
   */
  getCalendarList(appArr: Array<string> = []): Observable<any> {
    console.log('【Demo】行事曆列表');
    const params = {
      appIds: []
    };

    // 預設為登入的應用
    if (appArr.length === 0) {
      params.appIds.push(this.dwAppId);
    } else {
      params.appIds = JSON.parse(JSON.stringify(appArr));
    }

    return this.http.post('api/cmc/v2/calendars/currentuser', params).pipe(
      map(
        (response: any) => {
          const list = [];

          response.forEach(
            (calendarInfo: any) => {
              // 行事曆層級：TENANT（企業級），APP（應用級）
              if (calendarInfo.category === 'TENANT' || calendarInfo.category === 'APP') {
                list.push(calendarInfo);
              }
            }
          );

          return list;
        }
      )
    );
  }

  // /**
  //  * 查詢假日行事曆列表
  //  */
  // calendarsHoliday(params: any): Observable<any> {
  //   return this.http.post('api/cmc/v2/calendars/holiday', params);
  // }

  // /**
  //  * 選中行事曆
  //  */
  // calendarSelected(params: any): Observable<any> {
  //   return this.http.post('api/cmc/v2/calendars/visible', params);
  // }

  // /**
  //  * 行事曆详情
  //  */
  // calendarDetail(params: any): Observable<any> {
  //   return this.http.post('api/cmc/v2/calendars/detail', params);
  // }
}
