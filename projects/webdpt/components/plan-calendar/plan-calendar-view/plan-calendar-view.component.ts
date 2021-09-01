import {
  OnInit, OnDestroy, DoCheck, AfterViewInit, Component, EventEmitter, Input, Output, HostListener,
  NgZone, Renderer2, ViewChild, Inject
} from '@angular/core';
import { Subscription } from 'rxjs';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { Calendar } from '@fullcalendar/core';
import { EventSourceInput } from '@fullcalendar/core/structs/event-source';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import rrule from '@fullcalendar/rrule';
import timeGridPlugin from '@fullcalendar/timegrid';
import { TranslateService } from '@ngx-translate/core';

import { CalendarView, CalendarVisibleDateRange } from '@webdpt/framework/plan-calendar';
import { DwPlanCalendarService } from '@webdpt/framework/plan-calendar';
import { DW_USING_TAB } from '@webdpt/framework/config';

/**
 * 行事曆組件
 */
@Component({
  selector: 'dw-plan-calendar-view',
  templateUrl: './plan-calendar-view.component.html',
  styleUrls: ['./plan-calendar-view.component.less']
})
export class DwPlanCalendarViewComponent implements OnInit, OnDestroy, DoCheck, AfterViewInit {

  @ViewChild('fullCalendar') fullCalendar: FullCalendarComponent;
  /**
   * 時間區間變更的事件。
   * 切換檢視模式、上下頁、今天時都會不同的時間範圍。
   */
  @Output() visibleRangeChange: EventEmitter<CalendarVisibleDateRange> = new EventEmitter<CalendarVisibleDateRange>();

  /**
   * 日期點擊事件：可用於新增活動
   */
  @Output() dateClick: EventEmitter<Date> = new EventEmitter<Date>();

  /**
   * 活動的點擊：可用於查看活動詳情或修改活動
   */
  @Output() eventClick: EventEmitter<any> = new EventEmitter<any>();

  /**
   * 活動清單
   */
  @Input() events: EventSourceInput[];
  /**
   * 預設的檢視模式
   */
  @Input() defaultViewType = CalendarView.GridMonth;

  /**
   * 當前的日期
   * @param currentDate Date
   */
  @Input()
  set currentDate(currentDate: Date) {

    this._currentDate = currentDate;
    if (this.calendarApi && currentDate) {
      this.calendarApi.gotoDate(currentDate);
      this.setCurrentRange();
    }
  }

  get currentDate(): Date {
    return this._currentDate;
  }

  private windowResize: boolean; // 視窗是否改變大小

  @HostListener('window:resize', ['$event']) // 監聽視窗改變大小
  onResize($event: any): void {
    // console.log('resize Width: ' + $event.target.innerWidth);
    this.windowResize = true;
  }

  handleWindowResize: boolean = true; // FullCalendar是否自動隨視窗改變大小

  private _currentDate: Date = new Date();
  visibleRange: CalendarVisibleDateRange;
  calendarPlugins = [dayGridPlugin, timeGridPlugin, interactionPlugin, rrule, listPlugin];
  calendarApi: Calendar;
  calendarToolbar = null;
  private getViewEventsSubscription: Subscription;
  private viewChangeSubscription: Subscription;
  private todayEventEmitterSubscription: Subscription;
  private nextEventEmitterSubscription: Subscription;
  private previousEventEmitterSubscription: Subscription;

  // calendarToolbar = {
  //   left: 'prev,next',
  //   center: 'today',
  //   right: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth,listWeek,listDay'
  // };

  constructor(
    private zone: NgZone,
    private translate: TranslateService,
    private render: Renderer2,
    private calendarService: DwPlanCalendarService,
    @Inject(DW_USING_TAB) private usingTab: boolean
  ) {
    this.getViewEventsSubscription = this.calendarService.getViewEvents().subscribe(
      events => {
        this.events = events;
      }
    );
  }

  ngOnInit(): void {
    if (this.usingTab) {
      // 使用頁籤時，有ngDoCheck()改行事曆尺寸，所以關閉handleWindowResize，避免重複改尺寸
      this.handleWindowResize = false;
    } else {
      this.handleWindowResize = true;
    }
  }

  ngOnDestroy(): void {
    this.getViewEventsSubscription.unsubscribe();
    this.viewChangeSubscription.unsubscribe();
    this.todayEventEmitterSubscription.unsubscribe();
    this.nextEventEmitterSubscription.unsubscribe();
    this.previousEventEmitterSubscription.unsubscribe();
  }

  ngDoCheck(): void {
    // 視窗大小有改變，在切換頁籤後要改行事曆尺寸
    if (this.usingTab) {
      if (this.windowResize) {
        this.windowResize = false;
        setTimeout(() => {
          this.calendarApi.updateSize();
        }, 100);
      }
    }
  }

  ngAfterViewInit(): void {
    this.calendarApi = this.fullCalendar.getApi();
    this.zone.runOutsideAngular(() => {
      setTimeout(() => {
        this.calendarApi.updateSize();
      }, 100);
    });

    this.calendarApi.setOption('eventLimit', true);
    this.calendarApi.setOption('locale', this.translate.currentLang.toUpperCase().replace('_', '-'));
    this.calendarApi.setOption('eventTimeFormat', {
      hour: '2-digit',
      minute: '2-digit',
      meridiem: false
    });
    if (this._currentDate) {
      this.calendarApi.gotoDate(this._currentDate);
    }
    this.viewChangeSubscription = this.calendarService.viewChange$.subscribe(
      view => {
        this.calendarApi.changeView(view);
        this.setCurrentRange();
      }
    );
    this.todayEventEmitterSubscription = this.calendarService.todayEventEmitter.subscribe(
      () => {
        this.calendarApi.today();
        this.setCurrentRange();
      }
    );
    this.nextEventEmitterSubscription = this.calendarService.nextEventEmitter.subscribe(
      () => {
        this.calendarApi.next();
        this.setCurrentRange();
      }
    );
    this.previousEventEmitterSubscription = this.calendarService.previousEventEmitter.subscribe(
      () => {
        this.calendarApi.prev();
        this.setCurrentRange();
      }
    );
    this.setCurrentRange();
  }

  debugger(): void {
    console.log(this.calendarApi);
  }

  next(): void {
    this.calendarApi.next();
    this.setCurrentRange();
  }

  prev(): void {
    this.calendarApi.prev();
    this.setCurrentRange();
  }

  today(): void {
    this.calendarApi.today();
    this.setCurrentRange();
  }

  // 'dayGridMonth,timeGridWeek,timeGridDay,listMonth,listWeek,listDay'
  changeToMonthGridView(): void {
    this.calendarApi.changeView(CalendarView.GridMonth);
    this.setCurrentRange();
  }

  changeToWeekGridView(): void {
    this.calendarApi.changeView(CalendarView.GridWeek);
    this.setCurrentRange();
  }

  changeToDayGridView(): void {
    this.calendarApi.changeView(CalendarView.GridDay);
    this.setCurrentRange();
  }

  changeToMonthListView(): void {
    this.calendarApi.changeView(CalendarView.ListMonth);
    this.setCurrentRange();
  }

  changeToWeekListView(): void {
    this.calendarApi.changeView(CalendarView.ListWeek);
    this.setCurrentRange();
  }

  changeToDayListView(): void {
    this.calendarApi.changeView(CalendarView.ListDay);
    this.setCurrentRange();
  }

  setCurrentRange(): void {
    const _visibleRange = Object.assign({}, this.visibleRange);

    const newVisibleRange: CalendarVisibleDateRange = {
      activeStart: this.calendarApi.view.activeStart,
      activeEnd: new Date(this.calendarApi.view.activeEnd.setSeconds(-1)),
      start: this.calendarApi.view.currentStart,
      end: new Date(this.calendarApi.view.currentEnd.setSeconds(-1)),
      type: this.calendarApi.view.type
    };

    // 判斷重覆，要小心多組件交互無限循環...
    if (!this.visibleRange) {
      this.visibleRange = newVisibleRange;
      this.emitCurrentRangeChange();
    } else {
      if ((_visibleRange.start.valueOf() !== newVisibleRange.start.valueOf()) ||
        (_visibleRange.end.valueOf() !== newVisibleRange.end.valueOf()) ||
        (_visibleRange.type !== newVisibleRange.type)
      ) {
        this.visibleRange = newVisibleRange;
        this.emitCurrentRangeChange();
      }
    }
  }

  private emitCurrentRangeChange(): void {
    setTimeout(() => {
      this.calendarService.setVisibleRange(this.visibleRange);
      // this.visibleRangeChange.emit(this.visibleRange);
    });
  }

  eventRender(eventItem: any): void {
    const event = eventItem.event.extendedProps;
    if (!eventItem.event.allDay) {

      eventItem.el.className = eventItem.el.className + ' notAllDayEvent';

      if (!this.calendarApi.view.type.startsWith('list')) {
        const span = this.render.createElement('span');
        const text = this.render.createText('\u25CF');
        this.render.addClass(span, 'dot');
        this.render.appendChild(span, text);
        if (event.eventStatus !== 'TENTATIVE') {
          this.render.setStyle(span, 'color', eventItem.event.extendedProps.color);
        }
        const fcEvent = eventItem.el.children[0];
        if (fcEvent) {
          const fcTitle = fcEvent.children[0];
          if (fcTitle) {
            this.render.insertBefore(fcEvent, span, fcTitle);
          }
        }
      }
    }
  }

  clickDate($event: any): void {
    this.dateClick.emit($event.date);
  }

  clickEvent($event: any): void {
    this.eventClick.emit($event.event.extendedProps);
  }
}
