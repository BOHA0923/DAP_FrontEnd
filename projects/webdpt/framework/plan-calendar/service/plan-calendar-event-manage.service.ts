import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import fnsFormat from 'date-fns/format';
import { DwPlanCalendarEventRepository } from '../repository/plan-calendar-event-repository';

/**
 * 行事曆活動管理服務
 */
@Injectable()
export class DwPlanCalendarEventManageService {
  constructor(
    public dwPlanCalendarEventRepository: DwPlanCalendarEventRepository,
    private translateService: TranslateService,
  ) {
  }

  /**
   * 行事曆活動新增
   */
  add(params: any): Observable<any> {
    return this.dwPlanCalendarEventRepository.eventsCreate(params);
  }

  /**
   * 查詢行事曆活動詳情
   */
  eventsDetail(params: any): Observable<Array<any>> {
    return this.dwPlanCalendarEventRepository.eventsDetail(params);
  }

  /**
   * 行事曆活動修改
   */
  update(params: any): Observable<any> {
    return this.dwPlanCalendarEventRepository.eventsUpdate(params);
  }

  /**
   * 行事曆活動刪除
   */
  delete(params: any): Observable<any> {
    return this.dwPlanCalendarEventRepository.eventsDelete(params);
  }

  /**
   * 查詢行事曆活動
   *
   * @param startTime 開始時間
   * @param endTime 結束時間
   * @param calendarSids 行事曆sid
   * @returns 行事曆活動
   */
  events(startTime: Date, endTime: Date, calendarSids: Array<number>): Observable<Array<any>> {
    const params = {
      calendarSids: calendarSids, // 行事歷Sid列表
      startTime: fnsFormat(startTime, 'yyyy-MM-dd HH:mm:ss'), // 開始時間：2019-10-01 00:00:00
      endTime: fnsFormat(endTime, 'yyyy-MM-dd HH:mm:ss') // 結束時間：2019-10-30 23:59:59
    };
console.log(params);
    return this.dwPlanCalendarEventRepository.events(params).pipe(
      map(
        (eventsResponse: Array<any>) => {
          const eventList = [];

          eventsResponse.forEach(
            (calendar: any) => {
              calendar.events.forEach(
                (event: any) => {
                  // 只能顯示忙碌時，API不會回傳活動標題
                  let title = event.summary;
                  if (!title) {
                    title = this.translateService.instant('dw-plan-calendar-view-busy');
                  }

                  const item: any = {
                    calendarSid: calendar.calendarSid,
                    // 有可能是個人行事曆本身的權限，不是參與活動原始行事曆的權限，取活動詳情得到的行事曆權限才準確
                    // calAttendeePermissions: calendar.calAttendeePermissions,
                    title: title,
                    start: event.startDatetime,
                    end: event.endDatetime,
                    allDay: event.allDay,
                    classNames: event.eventStatus ? [event.eventStatus.toLowerCase()] : [],
                    extendedProps: Object.assign({}, event)
                  };
                  if (event.eventStatus !== 'TENTATIVE') {
                    item.color = event.color;
                  }
                  const start = new Date(event.startDatetime);
                  const end = new Date(event.endDatetime);

                  if (item.end.endsWith('23:59:59')) {
                    item.end = new Date(new Date(event.endDatetime).setSeconds(60));
                  }
                  if (!item.allDay) {
                    delete item['color'];
                  }
                  // if (item.allDay) {
                  //   if (item.end.endsWith('23:59:59')) {
                  //     item.end = new Date(new Date(event.endDatetime).setSeconds(60));
                  //   }
                  //   if (start.getFullYear() !== end.getFullYear() ||
                  //     start.getMonth() !== end.getMonth() ||
                  //     start.getDate() !== end.getDate()) {
                  //     // item.extendedProps.allDay = true;
                  //     // item.textColor = '#333333';
                  //     // item.backgroundColor = 'none';
                  //     // item.borderColor = 'none';
                  //     // delete item['color'];
                  //     item.classNames.push('notAllDayEvent');
                  //   }
                  // }

                  eventList.push(item);
                }
              );
            }
          );

          return eventList;
        }
      )
    );
  }

  /**
   * 用戶修改行事曆活動參與狀態
   *
   * @param eventSid 行事曆活動sid
   * @param status 活動參與狀態
   */
  eventsUpdateStatus(eventSid: string, status: string): Observable<any> {
    const params = {
      eventSid: eventSid,
      status: status
    };

    return this.dwPlanCalendarEventRepository.eventsUpdateStatus(params);
  }

}
