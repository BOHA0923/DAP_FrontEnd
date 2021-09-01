import { Component, OnInit, OnDestroy, EventEmitter, Output, Input } from '@angular/core';

/**
 * 行事曆卡片小日曆組件
 */
@Component({
  selector: 'dw-plan-calendar-card',
  templateUrl: './plan-calendar-card.component.html',
  styleUrls: ['./plan-calendar-card.component.less']
})
export class DwPlanCalendarCardComponent implements OnInit, OnDestroy {
  @Input() selectedDate: Date = new Date(); // 選擇的日期
  @Output() currentDateChange: EventEmitter<Date> = new EventEmitter<Date>(); // 當前日期變更的事件

  constructor(
  ) {
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }

  selectedDateChange(date: Date): void {
    this.currentDateChange.emit(date);
  }
}
