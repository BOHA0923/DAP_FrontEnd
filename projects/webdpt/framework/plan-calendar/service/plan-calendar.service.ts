import { DatePipe } from '@angular/common';
import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { distinctUntilChanged, filter } from 'rxjs/operators';

import { CalendarView, CalendarVisibleDateRange } from '../interface/interfaces';
import { DwPlanCalendarManageService } from './plan-calendar-manage.service';
import { DwPlanCalendarEventManageService } from './plan-calendar-event-manage.service';

/**
 * 行事曆服務
 */
@Injectable()
export class DwPlanCalendarService {
  calendars: Subject<any> = new Subject<any>();
  private visibleRange: CalendarVisibleDateRange;
  private visibleRangeSubject$: BehaviorSubject<CalendarVisibleDateRange> = new BehaviorSubject<CalendarVisibleDateRange>(null);
  private calendarList: any[] = []; // 行事曆列表
  private calendarListSubject$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  public eventsSubject$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  public viewChange$: BehaviorSubject<CalendarView> = new BehaviorSubject<CalendarView>(CalendarView.GridMonth);
  public todayEventEmitter: EventEmitter<void> = new EventEmitter<void>();
  public nextEventEmitter: EventEmitter<void> = new EventEmitter<void>();
  public previousEventEmitter: EventEmitter<void> = new EventEmitter<void>();

  constructor(
    public datePipe: DatePipe,
    public planCalendarManageService: DwPlanCalendarManageService,
    public planCalendarEventManageService: DwPlanCalendarEventManageService,
  ) {
  }

  /**
   * 日期時間轉字串
   *
   * @param dateTime 日期時間
   * @returns 字串
   */
  public dateTimeToString(dateTime: Date): string {
    return this.datePipe.transform(dateTime, 'yyyy-MM-dd HH:mm:ss');
  }

  /**
   * 全天的起訖時間
   *
   * @param isAllDay 是否全天
   * @param startDatetime 開始時間
   * @param endDatetime 結束時間
   * @returns 起訖時間
   */
  public allDayTime(isAllDay: boolean, startDatetime: Date, endDatetime: Date): any {
    const result = {
      startDatetime: new Date(startDatetime),
      endDatetime: new Date(endDatetime)
    };

    if (isAllDay) {
      result.startDatetime = new Date(this.datePipe.transform(startDatetime, 'yyyy-MM-dd') + ' 00:00:00');
      result.endDatetime = new Date(this.datePipe.transform(endDatetime, 'yyyy-MM-dd') + ' 23:59:59');
    }

    return result;
  }

  /**
   * 設定可視日期範圍
   *
   * @param visibleRange 可視日期範圍
   */
  public setVisibleRange(visibleRange: CalendarVisibleDateRange): void {
    this.visibleRange = visibleRange;
    this.visibleRangeSubject$.next(this.visibleRange);
    this.viewChange();
  }

  /**
   * 取得可視日期範圍
   *
   * @returns 可視日期範圍
   */
  public getVisibleRange(): Observable<CalendarVisibleDateRange> {
    return this.visibleRangeSubject$.asObservable().pipe(
      filter(obsData => obsData !== null), // 不廣播初始值
      distinctUntilChanged() // 有改變時才廣播
    );
  }

  /**
   * 行事曆列表刷新
   */
  public resetViewCalendarList(): void {
    this.planCalendarManageService.getCalendarList().subscribe(
      (calendarList: any) => {
        this.setViewCalendarList(calendarList);
      }
    );
  }

  /**
   * 設定行事曆列表
   *
   * @param calendarList 行事曆列表
   */
  public setViewCalendarList(calendarList: any[]): void {
    this.calendarList = JSON.parse(JSON.stringify(calendarList));
    this.calendarListSubject$.next(this.calendarList);
    this.viewChange();
  }

  /**
   * 取得行事曆列表
   *
   * @returns 行事曆列表
   */
  public getViewCalendarList(): Observable<any[]> {
    return this.calendarListSubject$.asObservable().pipe(
      filter(obsData => obsData !== null), // 不廣播初始值
      distinctUntilChanged() // 有改變時才廣播
    );
  }

  /**
   * 行事曆顯示或隱藏
   *
   * @param calendarSid 行事曆sid
   * @param visible 顯示：true，隱藏：false
   */
  calendarVisible(calendarSid: number, visible: any): void {
    if (calendarSid) {
      // 修改活動後，所屬行事曆可能原本沒顯示，要自動勾選顯示
      const list = JSON.parse(JSON.stringify(this.calendarList));
      const len = list.length;

      for (let i = 0; i < len; i++) {
        if (list[i].sid === calendarSid) {
          if (visible && list[i].visible !== visible) {
            list[i].visible = visible;
          }

          break;
        }
      }

      this.planCalendarManageService.calendarSelected(calendarSid, visible).subscribe(
        (response: any) => {
          this.setViewCalendarList(list);
        }
      );
    }
  }

  /**
   * 行事曆畫面資料變更
   *
   * @param visibleRange 行事曆檢視日期範圍
   */
  public viewChange(): void {
    const calendarSids = [];

    if (this.visibleRange) {
      this.calendarList.forEach(
        (item: any) => {
          if (item.visible) {
            calendarSids.push(item.sid);
          }
        }
      );

      this.planCalendarEventManageService.events(this.visibleRange.activeStart, this.visibleRange.activeEnd, calendarSids).subscribe(
        (eventsResult: Array<any>) => {
          this.eventsSubject$.next(eventsResult);
        }
      );
    } else {
      this.eventsSubject$.next([]);
    }
  }

  /**
   * 取得行事曆活動資料
   *
   * @returns 行事曆活動資料
   */
  public getViewEvents(): Observable<any[]> {
    return this.eventsSubject$.asObservable().pipe(
      distinctUntilChanged() // 有改變時才廣播
    );
  }

  /**
   * 變更行事曆檢視模式
   *
   * @param gridView 行事曆檢視模式
   */
  changeView(gridView: CalendarView): void {
    this.viewChange$.next(gridView);
  }

  /**
   * 轉跳到今日
   */
  today(): void {
    this.todayEventEmitter.emit();
  }

  /**
   * 下一個週期
   */
  next(): void {
    this.nextEventEmitter.emit();
  }

  /**
   * 前一個週期
   */
  previous(): void {
    this.previousEventEmitter.emit();
  }

}
