import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { DwPlanCalendarRepository } from '../repository/plan-calendar-repository';
import { DwPlanCalendarPermissionService } from './plan-calendar-permission.service';

/**
 * 行事曆管理服務
 */
@Injectable()
export class DwPlanCalendarManageService {
  constructor(
    public dwPlanCalendarRepository: DwPlanCalendarRepository,
    public dwPlanCalendarPermissionService: DwPlanCalendarPermissionService,
  ) {
  }

  /**
   * 行事曆新增
   */
  add(params: any): Observable<any> {
    return this.dwPlanCalendarRepository.calendarsCreate(params);
  }

  /**
   * 行事曆修改
   */
  update(params: any): Observable<any> {
    return this.dwPlanCalendarRepository.calendarsUpdate(params);
  }

  /**
   * 行事曆刪除
   *
   * @param [calendarSids=[]] 行事曆sid陣列
   */
  delete(calendarSids: Array<number> = []): Observable<any> {
    const params = {
      calendarSids: calendarSids
    };

    return this.dwPlanCalendarRepository.calendarsDelete(params);
  }

  /**
   * 取得行事曆可訂閱列表
   *
   * @param appArr 指定應用，預設為登入的應用
   */
  getSubscriptionList(appArr: Array<string> = []): Observable<any> {
    return this.dwPlanCalendarRepository.calendarsSubscriptionList(appArr);
  }

  /**
   * 訂閱行事曆
   *
   * @param [calendarSids=[]] 行事曆sid陣列
   */
  calendarsSubscribe(calendarSids: Array<number> = []): Observable<any> {
    const params = {
      calendarSids: calendarSids
    };

    return this.dwPlanCalendarRepository.calendarsSubscribe(params);
  }

  /**
   * 行事曆取消訂閱
   *
   * @param [calendarSids=[]] 行事曆sid陣列
   */
  calendarsUnSubscribe(calendarSids: Array<number> = []): Observable<any> {
    const params = {
      calendarSids: calendarSids
    };

    return this.dwPlanCalendarRepository.calendarsUnSubscribe(params);
  }

  /**
   * 行事曆列表(已訂閱)
   *
   * @param appArr 指定應用，預設為登入的應用
   */
  getCalendarList(appArr: Array<string> = []): Observable<any> {
    return this.dwPlanCalendarRepository.getCalendarList(appArr).pipe(
      map(
        (calendarList: any) => {
          calendarList.forEach((calendarInfo: any) => {
            const permission = this.dwPlanCalendarPermissionService.permission(calendarInfo.attendeePermission, calendarInfo.defaultCal);
            calendarInfo['modifyDetail'] = permission.modifyDetail;
            calendarInfo['delete'] = permission.delete;
            calendarInfo['unsubscribe'] = permission.unsubscribe;
          });

          return calendarList;
        }
      )
    );
  }

  /**
   * 選中行事曆，儲存顯示或隱藏的狀態
   *
   * @param calendarSid 行事曆sid
   * @param visible 是否顯示
   */
  calendarSelected(calendarSid: number, visible: boolean): Observable<any> {
    const params = [
      {
        sid: calendarSid,
        visible: visible
      }
    ];

    return this.dwPlanCalendarRepository.calendarSelected(params);
  }

  /**
   * 行事曆詳情
   *
   * @param calendarSid 行事曆sid
   */
  calendarDetail(calendarSid: number): Observable<any> {
    return this.dwPlanCalendarRepository.calendarDetail({ sid: calendarSid });
  }

  /**
   * 取得活動可歸屬的行事曆列表
   *
   * @description 行事曆的權限需要是: MANAGE,EDIT
   */
  public getBelongCalenars(): Observable<Array<any>> {
    return Observable.create(
      (observer: any) => {
        this.getCalendarList().subscribe(
          res => {
            const result = res || [];
            // 行事曆的權限需要是: MANAGE,EDIT
            const calendarList: Array<any> = result.filter(
              (d: any) => d.attendeePermission === 'MANAGE' || d.attendeePermission === 'EDIT'
            );

            observer.next(calendarList);
            observer.complete();
          },
          (errorResponse: any) => {
            observer.next([]);
            observer.complete();
          }
        );
      }
    );
  }
}
