import { Component } from '@angular/core';

@Component({
  selector: 'dw-time-picker-disabled',
  template: `
    <dw-form-time-picker [(ngModel)]="today" [dwDisabled]="isDisabled"
                         dwLabel="{{'時間' | translate}}"
                         dwPlaceHolder="請輸入時間"
                         dwLabelSpan="4" dwInputSpan="20"></dw-form-time-picker>
    <label dw-checkbox [(ngModel)]="isDisabled">禁用？</label><br/>
    時間：{{today}}
  `
})
export class TimePickerDisabledComponent {

  isDisabled = false;
  today = new Date();

  constructor() { }

}
