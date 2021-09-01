import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { DwPlanCalendarService } from './plan-calendar.service';
import { DwPlanCalendarManageService } from './plan-calendar-manage.service';
import { DwPlanCalendarEventManageService } from './plan-calendar-event-manage.service';
import { DwHttpMessageService } from '@webdpt/framework/http';

/**
 * 行事曆開窗服務
 */
@Injectable()
export class DwPlanCalendarModalService {
  constructor(
    public dwPlanCalendarService: DwPlanCalendarService,
    public planCalendarManageService: DwPlanCalendarManageService,
    public dwPlanCalendarEventManageService: DwPlanCalendarEventManageService,
    public translateService: TranslateService,
    public dwMessageService: DwHttpMessageService
  ) {
  }

  /**
   * 新增行事曆開窗確定
   *
   * @description 完成後要做行事曆列表刷新
   */
  public calendarAddOnOk(modalData: any): Observable<any> {
    return Observable.create(
      (observer: any) => {
        this.dwPlanCalendarService.resetViewCalendarList();

        observer.next(modalData);
        observer.complete();
      }
    );
  }

  /**
   * 修改行事曆開窗確定
   *
   * @description 完成後要做行事曆列表刷新
   */
  public calendarModifyOnOk(modalData: any): Observable<any> {
    return Observable.create(
      (observer: any) => {
        this.dwPlanCalendarService.resetViewCalendarList();

        observer.next(modalData);
        observer.complete();
      }
    );
  }

  /**
   * 刪除行事曆
   *
   * @description 完成後要做行事曆列表刷新
   * @param data 行事曆列表要刪除的行事曆
   */
  public calendarDelete(data: any): Observable<any> {
    return Observable.create(
      (observer: any) => {
        this.dwMessageService.confirm({
          dwTitle: this.translateService.instant('dw-msg-confirm-delete', { value1: data.name }),
          dwContent: this.translateService.instant('dw-plan-calendar-remove-tips', { calendarName: data.name }),
        }).subscribe((status) => {
          if (status) { // 確定
            this.planCalendarManageService.delete([data.sid]).subscribe(
              (res: any) => {
                this.dwPlanCalendarService.resetViewCalendarList();
                observer.next('ok');
                observer.complete();
              },
              (errorResponse: any) => {
                if (errorResponse.error.hasOwnProperty('dwHttpErrorResponse')) {
                  let msgContent = '';

                  if (errorResponse.error.message) {
                    msgContent = errorResponse.error.message;
                  } else if (errorResponse.error.dwHttpErrorResponse.errorStatusMessage) {
                    msgContent = errorResponse.error.dwHttpErrorResponse.errorStatusMessage;
                  }

                  this.dwMessageService.error({
                    dwTitle: data.name,
                    dwContent: msgContent,
                  }).subscribe(() => {
                    observer.next({ error: errorResponse });
                    observer.complete();
                  });
                } else {
                  observer.next({ error: errorResponse });
                  observer.complete();
                }
              }
            );

          } else { // 取消
            observer.next('cancel');
            observer.complete();
          }

        });
      }
    );
  }


  /**
   * 訂閱行事曆開窗確定
   *
   * @description 完成後要做行事曆列表刷新
   */
  public calendarSubscribeOnOk(modalData: any): Observable<any> {
    return Observable.create(
      (observer: any) => {
        this.dwPlanCalendarService.resetViewCalendarList();
        observer.next(modalData);
        observer.complete();
      }
    );
  }

  /**
   * 取消訂閱行事曆
   *
   * @description 完成後要做行事曆列表刷新
   * @param data 行事曆列表要取消訂閱的行事曆
   */
  public calendarUnsubscribe(data: any): Observable<any> {
    return Observable.create(
      (observer: any) => {
        this.dwMessageService.confirm({
          dwTitle: this.translateService.instant('dw-plan-calendar-msg-confirm-unsubscribe'),
          dwContent: this.translateService.instant('dw-plan-calendar-unsubscribe-tips', { calendarName: data.name }),
        }).subscribe((status) => {
          if (status) {
            this.planCalendarManageService.calendarsUnSubscribe([data.sid]).subscribe(
              (res: any) => {
                this.dwPlanCalendarService.resetViewCalendarList();
                observer.next('ok');
                observer.complete();
              },
              (errorResponse: any) => {
                if (errorResponse.error.hasOwnProperty('dwHttpErrorResponse')) {
                  let msgContent = '';

                  if (errorResponse.error.message) {
                    msgContent = errorResponse.error.message;
                  } else if (errorResponse.error.dwHttpErrorResponse.errorStatusMessage) {
                    msgContent = errorResponse.error.dwHttpErrorResponse.errorStatusMessage;
                  }

                  this.dwMessageService.error({
                    dwTitle: data.name,
                    dwContent: msgContent,
                  }).subscribe(() => {
                    observer.next({ error: errorResponse });
                    observer.complete();
                  });
                } else {
                  observer.next({ error: errorResponse });
                  observer.complete();
                }
              }
            );

          } else {
            observer.next('cancel');
            observer.complete();
          }
        });

      }
    );
  }


  /**
   * 新增活動開窗確定
   *
   * @description 完成後要做行事曆畫面資料變更，行事曆顯示
   */
  public calendarEventAddOnOk(modalData: any): Observable<any> {
    return Observable.create(
      (observer: any) => {
        let returnData = { // 開窗回傳值
          calendarSid: null, // 行事曆sid，編輯活動後，行事曆列表必須要勾選此行事曆
          isUpdate: false // 是否有更新資料，如果有更新，關閉視窗後也要重取行事曆活動
        };

        if (modalData.hasOwnProperty('returnData')) {
          returnData = Object.assign({}, modalData.returnData);

          if (returnData.calendarSid) {
            this.dwPlanCalendarService.calendarVisible(returnData.calendarSid, true);
          } else {
            this.dwPlanCalendarService.viewChange();
          }
        }

        modalData['returnData'] = returnData;

        observer.next(modalData);
        observer.complete();
      }
    );
  }

  /**
   * 修改活動開窗確定
   *
   * @description 完成後要做行事曆畫面資料變更，行事曆顯示
   */
  public calendarEventEditOnOk(modalData: any): Observable<any> {
    return Observable.create(
      (observer: any) => {
        let returnData = { // 開窗回傳值
          calendarSid: null, // 行事曆sid，編輯活動後，行事曆列表必須要勾選此行事曆
          isUpdate: false // 是否有更新資料，如果有更新，關閉視窗後也要重取行事曆活動
        };

        if (modalData.hasOwnProperty('returnData')) {
          returnData = Object.assign({}, modalData.returnData);

          if (returnData.calendarSid) {
            this.dwPlanCalendarService.calendarVisible(returnData.calendarSid, true);
          } else {
            this.dwPlanCalendarService.viewChange();
          }
        }

        modalData['returnData'] = returnData;

        observer.next(modalData);
        observer.complete();
      }
    );
  }

  /**
   * 查看活動詳情開窗確定
   *
   * @description 完成後要做行事曆畫面資料變更，行事曆顯示
   */
  public calendarEventDetailOnOk(modalData: any, eventDetail: any): void {
    if (modalData.hasOwnProperty('returnData')) {
      const returnData = Object.assign({}, modalData.returnData);

      if (returnData.calendarSid && returnData.calendarSid !== eventDetail.calendarSid) {
        // 活動所屬行事曆改變，則自動顯示行事曆(勾選列表)
        this.dwPlanCalendarService.calendarVisible(returnData.calendarSid, true);
      } else {
        this.dwPlanCalendarService.viewChange();
      }
    }
  }

  /**
   * 刪除活動
   * @param data 要刪除的活動
   */
  public calendarEventDelete(eventSid: number, eventName: string): Observable<any> {
    return Observable.create(
      (observer: any) => {
        this.dwMessageService.confirm({
          dwTitle: this.translateService.instant('dw-msg-confirm-delete', { value1: eventName }),
          dwContent: '',
        }).subscribe((status) => {
          if (status) {
            this.dwPlanCalendarEventManageService.delete({ eventSid: eventSid }).subscribe(
              (res: any) => {
                observer.next('ok');
                observer.complete();
              },
              (errorResponse: any) => {
                if (errorResponse.error.hasOwnProperty('dwHttpErrorResponse')) {
                  let msgContent = '';

                  if (errorResponse.error.message) {
                    msgContent = errorResponse.error.message;
                  } else if (errorResponse.error.dwHttpErrorResponse.errorStatusMessage) {
                    msgContent = errorResponse.error.dwHttpErrorResponse.errorStatusMessage;
                  }

                  this.dwMessageService.error({
                    dwTitle: eventName,
                    dwContent: msgContent,
                  }).subscribe(() => {
                    observer.next({ error: errorResponse });
                    observer.complete();
                  });
                } else {
                  observer.next({ error: errorResponse });
                  observer.complete();
                }
              }
            );

          } else {
            observer.next('cancel');
            observer.complete();
          }
        });

      }
    );
  }


}
