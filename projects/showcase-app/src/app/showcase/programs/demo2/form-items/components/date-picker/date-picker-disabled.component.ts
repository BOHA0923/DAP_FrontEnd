import { Component } from '@angular/core';

@Component({
  selector: 'dw-date-picker-disabled',
  template: `
    <dw-form-date-picker [(ngModel)]="today" [dwDisabled]="isDisabled"
                         dwLabel="{{'日期' | translate}}"
                         dwPlaceHolder="請輸入日期"
                         dwLabelSpan="4" dwInputSpan="20"></dw-form-date-picker>
    <label dw-checkbox [(ngModel)]="isDisabled">禁用？</label><br/>
    日期：{{today}}
  `
})
export class DatePickerDisabledComponent {

  isDisabled = false;
  today = new Date();

  constructor() { }

}
