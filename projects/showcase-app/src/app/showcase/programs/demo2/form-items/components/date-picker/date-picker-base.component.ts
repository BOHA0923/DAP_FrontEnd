import { Component } from '@angular/core';

@Component({
  selector: 'dw-date-picker-base',
  template: `
    <dw-form-date-picker [(ngModel)]="today" dwShowTime
                         dwLabel="{{'日期' | translate}}"
                         dwPlaceHolder="請輸入日期"
                         dwLabelSpan="4" dwInputSpan="20"></dw-form-date-picker>
    日期：{{today}}
  `
})
export class DatePickerBaseComponent {

  today = new Date();

  constructor() { }

}
