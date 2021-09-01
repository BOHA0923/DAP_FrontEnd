import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { DwCmcHttpClient } from '@webdpt/framework/cmc';


/**
 * 行事曆活動Repository
 */
@Injectable()
export class DwPlanCalendarEventRepository {
  constructor(
    public http: DwCmcHttpClient,
  ) {
  }

  /**
   * 新增行事曆活動
   */
  eventsCreate(params: any): Observable<any> {
    return this.http.post('api/cmc/v2/events/create', params);
  }

  /**
   * 查詢行事曆活動詳情
   */
  eventsDetail(params: any): Observable<Array<any>> {
    return this.http.post('api/cmc/v2/events/detail', params);

    // return Observable.create(
    //   (observer: any) => {
    //     const mock = {
    //       'calAttendeePermission': 'READ_DETAIL', // 行事曆权限
    //       // 事件权限
    //       'eventlAttendeePermission': [
    //         'VIEW',
    //         'INVITE',
    //         'EDIT'
    //       ],
    //       'eventInfo': {
    //         'sid': 112117888102976,
    //         'calendarSid': 112117888102975,
    //         // 事件类型创建：OWNER，参与者：ATTENDEE
    //         'eventType': 'OWNER',
    //         'summary': '产品回顾会议',
    //         'description': '会议描述会议描述',
    //         'location': '鼎捷南京',
    //         'color': '#039BE5',
    //         'allDay': true,
    //         'startDatetime': '2019-10-25 15:52:49',
    //         'endDatetime': '2019-10-30 15:52:49',
    //         'tenantId': 'default',
    //         'userId': 'superadmin',
    //         'userName': '超級管理員',
    //         'attendees': [
    //           {
    //             'sid': 111,
    //             'tenantId': 'default',
    //             'eventStatus': 'TENTATIVE',
    //             'attendeeId': 'cloud03',
    //             'attendeeSid': '50168810897984',
    //             'attendeeName': 'cloud03',
    //             'attendeeType': 'USER'
    //           },
    //           {
    //             'sid': 111,
    //             'tenantId': 'default',
    //             'eventStatus': 'CONFIRMED',
    //             'attendeeId': 'lingxiang',
    //             'attendeeSid': '55765865849408',
    //             'attendeeName': 'lingxiang',
    //             'attendeeType': 'USER'
    //           },
    //           {
    //             'sid': 111,
    //             'tenantId': 'default',
    //             'eventStatus': 'CANCELED',
    //             'attendeeId': 'Teamwork',
    //             'attendeeSid': '35642940723776',
    //             'attendeeName': '李志江',
    //             'attendeeType': 'USER'
    //           }
    //         ]
    //       }
    //     };

    //     observer.next(mock);
    //     observer.complete();
    //   }
    // );
  }

  /**
   * 修改行事曆活動
   */
  eventsUpdate(params: any): Observable<any> {
    return this.http.post('api/cmc/v2/events/update', params);
  }

  /**
   * 刪除行事曆活動
   */
  eventsDelete(params: any): Observable<any> {
    return this.http.post('api/cmc/v2/events/delete', params);
  }

  /**
   * 查詢行事曆活動
   */
  events(params: any): Observable<Array<any>> {
    return this.http.post('api/cmc/v2/events', params).pipe(
      catchError((error: any, msg: Observable<any>): any => {
        return Observable.create(
          (observer: any) => {
            observer.next([]);
            observer.complete();
          }
        );
      })
    );

    // return Observable.create(
    //   (observer: any) => {
    //     const mock = [
    //       {
    //         'calendarSid': 300001,
    //         'calAttendeePermission': 'READ_DETAIL',
    //         'events': [
    //           {
    //             'sid': 1,
    //             'summary': '活動一',
    //             'color': '#AD1457',
    //             'startDatetime': '2019-09-30 08:30:00',
    //             'endDatetime': '2019-11-06 17:45:00',
    //             'allDay': false,
    //             'attendeeSid': 137904750309952,
    //             'eventStatus': 'TENTATIVE'
    //           },
    //           {
    //             'sid': 11,
    //             'summary': '活動二',
    //             'color': '#AD1457',
    //             'startDatetime': '2019-10-01 00:00:00',
    //             'endDatetime': '2019-10-01 23:59:59',
    //             'allDay': true,
    //             'attendeeSid': 222204750306666,
    //             'eventStatus': 'CONFIRMED'
    //           },
    //           {
    //             'sid': 17,
    //             'summary': '活動三',
    //             'color': '#AD1457',
    //             'startDatetime': '2019-10-01 16:00:00',
    //             'endDatetime': '2019-10-01 21:00:00',
    //             'allDay': false,
    //             'attendeeSid': 222204750306666,
    //             'eventStatus': 'CONFIRMED'
    //           }
    //         ]
    //       },
    //       {
    //         'calendarSid': 300002,
    //         'calAttendeePermission': 'READ_ONLY',
    //         'events': [
    //           {
    //             'sid': 2,
    //             'summary': '任務一',
    //             'color': '#039BE5',
    //             'startDatetime': '2019-11-06 00:00:00',
    //             'endDatetime': '2019-11-06 17:45:00',
    //             'allDay': false,
    //             'attendeeSid': null,
    //             'eventStatus': null
    //           },
    //           {
    //             'sid': 22,
    //             'summary': '任務二',
    //             'color': '#039BE5',
    //             'startDatetime': '2019-10-01 00:00:00',
    //             'endDatetime': '2019-10-01 23:59:59',
    //             allDay: true,
    //             'attendeeSid': null,
    //             'eventStatus': null
    //           }
    //         ]
    //       }
    //     ];

    //     observer.next(mock);
    //     observer.complete();
    //   }
    // );
  }

  /**
   * 用戶修改行事曆活動參與狀態
   */
  eventsUpdateStatus(params: any): Observable<any> {
    return this.http.post('api/cmc/v2/events/update/status', params);
  }
}
