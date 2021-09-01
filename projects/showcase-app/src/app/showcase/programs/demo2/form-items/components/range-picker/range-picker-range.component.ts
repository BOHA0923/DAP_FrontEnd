import { Component } from '@angular/core';

@Component({
  selector: 'dw-range-picker-range',
  template: `
    <dw-form-range-picker [(ngModel)]="ranges" [dwRanges]="ranges1"
                          dwLabel="{{'日期' | translate}}"
                          [dwPlaceHolder]="['開始日期','結束日期']"
                          dwLabelSpan="4" dwInputSpan="20"></dw-form-range-picker>
    日期：{{ranges | json}}
  `
})
export class RangePickerRangeComponent {

  ranges: Date[];
  ranges1;

  constructor() {
    const today = new Date();
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    this.ranges1 = {'今日': [new Date(), new Date()], '本月': [new Date(), endOfMonth]};
  }

}
