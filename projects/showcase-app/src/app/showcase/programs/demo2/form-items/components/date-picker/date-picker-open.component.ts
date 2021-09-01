import { Component } from '@angular/core';

@Component({
  selector: 'dw-date-picker-open',
  template: `
    <dw-form-date-picker
      [dwDisabledDate]="disabledStartDate"
      dwShowTime
      dwFormat="yyyy-MM-dd HH:mm:ss"
      [(ngModel)]="startValue"
      dwPlaceHolder="Start"
      (ngModelChange)="onStartChange($event)"
      (dwOnOpenChange)="handleStartOpenChange($event)">
    </dw-form-date-picker>
    <dw-form-date-picker
      [dwDisabledDate]="disabledEndDate"
      dwShowTime
      dwFormat="yyyy-MM-dd HH:mm:ss"
      [(ngModel)]="endValue"
      dwPlaceHolder="End"
      [dwOpen]="endOpen"
      (ngModelChange)="onEndChange($event)"
      (dwOnOpenChange)="handleEndOpenChange($event)">
    </dw-form-date-picker>
  `
})
export class DatePickerOpenComponent {

  startValue: Date = null;
  endValue: Date = null;
  endOpen: boolean = false;


  constructor() { }

  disabledStartDate = (startValue: Date): boolean => {
    if (!startValue || !this.endValue) {
      return false;
    }
    return startValue.getTime() > this.endValue.getTime();
  }

  disabledEndDate = (endValue: Date): boolean => {
    if (!endValue || !this.startValue) {
      return false;
    }
    return endValue.getTime() <= this.startValue.getTime();
  }

  onStartChange(date: Date): void {
    this.startValue = date;
  }

  onEndChange(date: Date): void {
    this.endValue = date;
  }

  handleStartOpenChange(open: boolean): void {
    if (!open) {
      this.endOpen = true;
    }
  }

  handleEndOpenChange(open: boolean): void {
    this.endOpen = open;
  }
}
