import { Component } from '@angular/core';

@Component({
  selector: 'dw-range-picker-base',
  template: `
    <dw-form-range-picker [(ngModel)]="ranges"
                          dwLabel="{{'日期' | translate}}"
                          [dwPlaceHolder]="['開始日期','結束日期']"
                          dwLabelSpan="4" dwInputSpan="20"></dw-form-range-picker>
    日期：{{ranges | json}}
  `
})
export class RangePickerBaseComponent {

  ranges: Date[];

  constructor() { }

}
