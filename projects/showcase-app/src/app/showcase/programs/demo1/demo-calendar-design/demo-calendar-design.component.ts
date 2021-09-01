import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { EventSourceInput } from '@fullcalendar/core/structs/event-source';

import {
  DwPlanCalendarRepository, DwPlanCalendarCoreModule, CalendarVisibleDateRange, CalendarView,
  DwPlanCalendarService, DwPlanCalendarModalService
} from '@webdpt/framework/plan-calendar';
import { DemoCalendarDesignRepository } from './repository/demo-calendar-design-repository';

@Component({
  selector: 'app-demo-calendar-design',
  templateUrl: './demo-calendar-design.component.html',
  styleUrls: ['./demo-calendar-design.component.less'],
  providers: [
    ...DwPlanCalendarCoreModule.forChild().providers, // 載入行事曆providers
    DemoCalendarDesignRepository,
    {
      provide: DwPlanCalendarRepository,
      useExisting: DemoCalendarDesignRepository // 替換注入provider
    },
  ]
})
export class DemoCalendarDesignComponent implements OnInit, OnDestroy, AfterViewInit {

  public planCalendarTitleKey = 'dw-plan-calendar-title-my'; // 行事曆標題多語言Key，預設：我的行事曆
  public planCalendarCategory = 'APP'; // 行事曆層級：DAP（平台級），TENANT（企業級），APP（應用級），USER（用戶級）

  calendarList = [];
  private calendarListSubscription: Subscription;
  events: EventSourceInput[];
  private eventsSubscription: Subscription;

  calendarLeftPanelDisplay = true; // 是否顯示行事曆列表
  visibleRange: CalendarVisibleDateRange;
  private visibleRangeSubscription: Subscription;
  currentDate: Date;

  /**
   * 預設的行事曆檢視模式
   */
  defaultViewType: CalendarView = CalendarView.GridMonth;

  // 開窗
  public planCalendarEventAddClickDate: Date;
  public planCalendarAddVisible: boolean;
  public planCalendarEditVisible: boolean;
  public planCalendarEventAddVisible: boolean;
  public planCalendarSubscribeVisible: boolean;

  public planCalendarEventDetailVisible: boolean;
  public planCalendarEventDetailData: any;
  public planCalendarEditCalendarSid: number;

  constructor(
    public planCalendarService: DwPlanCalendarService,
    public planCalendarModalService: DwPlanCalendarModalService,
  ) {
  }

  ngOnInit(): void {
    this.calendarListSubscription = this.planCalendarService.getViewCalendarList().subscribe(
      (calendarList: any[]) => {
        this.calendarList = calendarList;
      }
    );

    this.eventsSubscription = this.planCalendarService.getViewEvents().subscribe(
      (events: any[]) => {
        this.events = events;
      }
    );

    this.visibleRangeSubscription = this.planCalendarService.getVisibleRange().subscribe(
      (visibleRange: CalendarVisibleDateRange) => {
        this.visibleRange = visibleRange;
        this.currentDate = visibleRange.start;
      }
    );

    this.planCalendarService.resetViewCalendarList();
  }

  ngOnDestroy(): void {
    this.calendarListSubscription.unsubscribe();
    this.eventsSubscription.unsubscribe();
    this.visibleRangeSubscription.unsubscribe();
  }

  ngAfterViewInit(): void {
  }

  next(): void {
    this.planCalendarService.next();
  }

  previous(): void {
    this.planCalendarService.previous();
  }

  today(): void {
    this.planCalendarService.today();
  }

  viewMonth(): void {
    this.planCalendarService.changeView(CalendarView.GridMonth);
  }

  viewWeek(): void {
    this.planCalendarService.changeView(CalendarView.GridWeek);
  }

  viewDay(): void {
    this.planCalendarService.changeView(CalendarView.GridDay);
  }

  viewMonthList(): void {
    this.planCalendarService.changeView(CalendarView.ListMonth);
  }

  viewWeekList(): void {
    this.planCalendarService.changeView(CalendarView.ListWeek);
  }

  viewDayList(): void {
    this.planCalendarService.changeView(CalendarView.ListDay);
  }

  visibleRangeChange(range: CalendarVisibleDateRange): void {
    // this.visibleRange = range;
    // this.currentDate = range.start;
    // this.planCalendarService.setVisibleRange(this.visibleRange);
  }

  /**
   * 日期點擊事件：可用於新增活動
   * @param date Date 點擊的日期
   */
  public dateClick(date: Date): void {
    this.planCalendarEventAddClickDate = date;
    this.planCalendarEventAddVisible = true;
  }

  /**
   * 新增活動開窗確定
   */
  public planCalendarEventAddHandleOk($event: any): void {
    this.planCalendarModalService.calendarEventAddOnOk($event).subscribe(
      (modalData: any): void => {
        // 開窗後的額外動作
      }
    );
  }

  /**
   * 活動的點擊：可用於查看活動詳情或修改活動
   * @param event any 後端的事件元數據
   */
  public eventClick(event: any): void {
    this.planCalendarEventDetailData = event;
    this.planCalendarEventDetailVisible = true;
  }

  public planCalendarEventDetailHandleOk($event: any): void {
    this.planCalendarModalService.calendarEventDetailOnOk($event, this.planCalendarEventDetailData);
  }

  /**
   * 小日曆 - 當前日期變更的事件
   * @param date Date
   */
  changeCurrentDate(date: Date): void {
    this.currentDate = date;
  }

  /**
   * 新增行事曆
   */
  public calendarAdd(): void {
    this.planCalendarAddVisible = true;
  }

  /**
   * 新增行事曆開窗確定
   */
  public planCalendarAddHandleOk($event: any): void {
    this.planCalendarModalService.calendarAddOnOk($event).subscribe(
      (modalData: any): void => {
        // 開窗後的額外動作
      }
    );
  }

  /**
   * 訂閱行事曆
   */
  public calendarSubscribe(): void {
    this.planCalendarSubscribeVisible = true;
  }

  /**
   * 訂閱行事曆開窗確定
   */
  public planCalendarSubscribeHandleOk($event: any): void {
    this.planCalendarModalService.calendarSubscribeOnOk($event).subscribe(
      (modalData: any): void => {
        // 開窗後的額外動作
      }
    );
  }

  /**
   * 修改行事曆
   *
   * @param data 行事曆列表要修改的行事曆
   */
  public calendarModify(data: any): void {
    this.planCalendarEditCalendarSid = data.sid;
    this.planCalendarEditVisible = true;
  }

  /**
   * 修改行事曆開窗確定
   */
  public planCalendarEditHandleOk($event: any): void {
    this.planCalendarModalService.calendarModifyOnOk($event).subscribe(
      (modalData: any): void => {
        // 開窗後的額外動作
      }
    );
  }

  /**
   * 刪除行事曆
   *
   * @param data 行事曆列表要刪除的行事曆
   */
  public calendarDelete(data: any): void {
    this.planCalendarModalService.calendarDelete(data).subscribe(
      (modalData: any): void => {
        // 開窗後的額外動作
      }
    );
  }

  /**
   * 取消訂閱行事曆
   *
   * @param data 行事曆列表要取消訂閱的行事曆
   */
  public calendarUnsubscribe(data: any): void {
    this.planCalendarModalService.calendarUnsubscribe(data).subscribe(
      (modalData: any): void => {
        // 開窗後的額外動作
      }
    );
  }

  /**
   * 選中行事曆
   * 可用於顯示或隱藏
   *
   * @param data 行事曆列表選中的行事曆
   */
  public calendarSelect(data: any): void {
    this.planCalendarService.calendarVisible(data.sid, data.visible); // 顯示或隱藏
  }
}
