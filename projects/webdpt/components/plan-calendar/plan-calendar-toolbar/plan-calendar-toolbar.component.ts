import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CalendarView, CalendarVisibleDateRange } from '@webdpt/framework/plan-calendar';
import { DwPlanCalendarService } from '@webdpt/framework/plan-calendar';
import fnsFormat from 'date-fns/format';

/**
 * 行事曆工具列組件
 */
@Component({
  selector: 'dw-plan-calendar-toolbar',
  templateUrl: './plan-calendar-toolbar.component.html',
  styleUrls: ['./plan-calendar-toolbar.component.less']
})
export class DwPlanCalendarToolbarComponent implements OnInit, OnDestroy {

  /**
   * 各種檢視方式
   */
  @Input() views: CalendarView[] = [
    CalendarView.GridMonth,
    CalendarView.GridWeek,
    CalendarView.GridDay,
    CalendarView.ListMonth
  ];
  /**
   * 預設的檢視模式
   */
  @Input() defaultViewType = CalendarView.GridMonth;
  /**
   * 前往今天的事件
   */
  @Output() gotoToday: EventEmitter<any> = new EventEmitter<any>();
  /**
   * 前一個的事件
   */
  @Output() gotoPrevious: EventEmitter<any> = new EventEmitter<any>();
  /**
   * 下一個的事件
   */
  @Output() gotoNext: EventEmitter<any> = new EventEmitter<any>();
  /**
   * 月檢視的事件
   */
  @Output() viewMonth: EventEmitter<any> = new EventEmitter<any>();
  /**
   * 週檢視的事件
   */
  @Output() viewWeek: EventEmitter<any> = new EventEmitter<any>();
  /**
   * 日檢視的事件
   */
  @Output() viewDay: EventEmitter<any> = new EventEmitter<any>();
  /**
   * 月清單檢視的事件
   */
  @Output() viewMonthList: EventEmitter<any> = new EventEmitter<any>();
  /**
   * 週清單檢視的事件
   */
  @Output() viewWeekList: EventEmitter<any> = new EventEmitter<any>();
  /**
   * 日清單檢視的事件
   */
  @Output() viewDayList: EventEmitter<any> = new EventEmitter<any>();

  private _viewEmitter: { [key: string]: EventEmitter<any> } = {};
  private _range: CalendarVisibleDateRange;

  get CalendarView(): any {
    return CalendarView;
  }

  title: string = '';
  viewType: CalendarView = CalendarView.GridMonth;

  /**
   * 顯示的時間區間
   */
  // @Input()
  set visibleRange(range: CalendarVisibleDateRange) {
    this._range = range;
    if (range) {
      this.title = this.renderTitle(range);
    }
  }

  get visibleRange(): CalendarVisibleDateRange {
    return this._range;
  }

  constructor(
    private calendarService: DwPlanCalendarService,
    private translate: TranslateService
  ) {
    this._viewEmitter[CalendarView.GridMonth] = this.viewMonth;
    this._viewEmitter[CalendarView.GridWeek] = this.viewWeek;
    this._viewEmitter[CalendarView.GridDay] = this.viewDay;
    this._viewEmitter[CalendarView.ListMonth] = this.viewMonthList;
    this._viewEmitter[CalendarView.ListWeek] = this.viewWeekList;
    this._viewEmitter[CalendarView.ListDay] = this.viewDayList;
    this.calendarService.getVisibleRange().subscribe(
      (visibleRange: CalendarVisibleDateRange) => {
        this.visibleRange = visibleRange;
      }
    );
  }

  ngOnInit(): void {
    this.viewType = this.defaultViewType;
  }

  ngOnDestroy(): void {
  }

  onGotoTodayClick(): void {
    this.gotoToday.emit();
  }

  onGotoPreviousClick(): void {
    this.gotoPrevious.emit();
  }

  onGotoNextClick(): void {
    this.gotoNext.emit();
  }

  changeViewType(view: CalendarView): void {
    this.viewType = view;
    const eventEmitter = this._viewEmitter[view];
    if (eventEmitter) {
      eventEmitter.emit();
    }
  }

  private renderTitle(range: CalendarVisibleDateRange): string {
    const rangeUnit = this.getRangeUnit(range);
    const lang = this.translate.currentLang.toLowerCase().replace('_', '-');
    // console.log(rangeUnit);
    // console.log(moment.locale('zh-cn'));
    // console.log(moment(range.start).format('LL'));
    if (lang.startsWith('zh-')) {
      return this.formatZHRange(range, rangeUnit);
    }
    switch (rangeUnit) {
      case 'Year':
        return `${range.start.getFullYear()}`;
        break;
      case 'Month':
        return fnsFormat(range.start, 'MMMM, yyyy');
        break;
      case 'Week':
        if (range.start.getFullYear() === range.end.getFullYear() && range.start.getMonth() === range.end.getMonth()) {
         return fnsFormat(range.start, 'MMM Do') + ' - ' + fnsFormat(range.end, 'Do, yyyy');
        }
        return fnsFormat(range.start, 'MMM Do, yyyy') + ' - ' + fnsFormat(range.end, 'MMM Do, yyyy');
        break;
      case 'Day':
        return fnsFormat(range.start, 'dddd, MMMM Do yyyy');
        break;
    }
  }

  private getRangeUnit(range: CalendarVisibleDateRange): string {
    const type = range.type;
    const regex = new RegExp(/(Week|Month|Year|Day).*/);
    return regex.test(type) && regex.exec(type)[1];
  }

  private formatZHRange(range: CalendarVisibleDateRange, rangeUnit: string): string {
    const startYear = range.start.getFullYear();
    const startMonth = range.start.getMonth() + 1;
    const startDay = range.start.getDate();
    const endYear = range.end.getFullYear();
    const endMonth = range.end.getMonth() + 1;
    const endDay = range.end.getDate();
    switch (rangeUnit) {
      case 'Year':
        return startYear + this.translate.instant('year');
        break;
      case 'Month':
        return startYear + this.translate.instant('year') +
          startMonth + this.translate.instant('month');
        break;
      case 'Week':
        if (startYear === endYear && startMonth === endMonth) {
          return startYear + this.translate.instant('year') +
            startMonth + this.translate.instant('month') +
            startDay + this.translate.instant('day') +
            '~' +
            endYear + this.translate.instant('year') +
            endMonth + this.translate.instant('month') +
            endDay + this.translate.instant('day');
        }
        return startYear + this.translate.instant('year') +
          startMonth + this.translate.instant('month') +
          startDay + this.translate.instant('day') +
          '~' +
          endMonth + this.translate.instant('month') +
          endDay + this.translate.instant('day');
        break;
      case 'Day':
        return startYear + this.translate.instant('year') +
          startMonth + this.translate.instant('month') +
          startDay + this.translate.instant('day');
        break;
    }
  }
}
