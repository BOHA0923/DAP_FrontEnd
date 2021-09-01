import { Component, OnInit, OnDestroy, EventEmitter, Output, Input } from '@angular/core';

/**
 * 行事曆列表組件
 */
@Component({
  selector: 'dw-plan-calendar-list',
  templateUrl: './plan-calendar-list.component.html',
  styleUrls: ['./plan-calendar-list.component.less']
})
export class DwPlanCalendarListComponent implements OnInit, OnDestroy {
  @Input() calendarList: Array<any> = []; // 行事曆列表資料
  @Output() dwOnCalendarModify: EventEmitter<any> = new EventEmitter<any>(); // 修改行事曆的事件
  @Output() dwOnCalendarDelete: EventEmitter<any> = new EventEmitter<any>(); // 刪除行事曆的事件
  @Output() dwOnCalendarUnsubscribe: EventEmitter<any> = new EventEmitter<any>(); // 取消訂閱行事曆的事件
  @Output() dwOnCalendarSelect: EventEmitter<any> = new EventEmitter<any>(); // 行事曆顯示或隱藏的事件

  constructor(
  ) {
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }

  /**
   * 修改行事曆
   *
   * @param data 行事曆列表要修改的行事曆
   */
  public calendarModify(data: any): void {
    this.dwOnCalendarModify.emit(data);
  }

  /**
   * 刪除行事曆
   *
   * @param data 行事曆列表要刪除的行事曆
   */
  public calendarDelete(data: any): void {
    this.dwOnCalendarDelete.emit(data);
  }

  /**
   * 取消訂閱行事曆
   *
   * @param data 行事曆列表要取消訂閱的行事曆
   */
  public calendarUnsubscribe(data: any): void {
    this.dwOnCalendarUnsubscribe.emit(data);
  }

  /**
   * 選中行事曆
   * 可用於顯示或隱藏
   *
   * @param data 行事曆列表選中的行事曆
   */
  public calendarSelect(data: any): void {
    this.dwOnCalendarSelect.emit(data);
  }
}
