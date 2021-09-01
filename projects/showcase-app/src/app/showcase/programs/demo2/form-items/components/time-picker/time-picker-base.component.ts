import { Component } from '@angular/core';

@Component({
  selector: 'dw-time-picker-base',
  template: `
    <dw-form-time-picker [(ngModel)]="today"
                         dwLabel="{{'時間' | translate}}"
                         dwPlaceHolder="請輸入時間"
                         dwLabelSpan="4" dwInputSpan="20"></dw-form-time-picker>
    時間：{{today}}
  `
})
export class TimePickerBaseComponent {

  today = new Date();

  constructor() { }

}
