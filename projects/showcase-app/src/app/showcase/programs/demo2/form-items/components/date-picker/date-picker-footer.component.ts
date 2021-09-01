import { Component } from '@angular/core';

@Component({
  selector: 'dw-date-picker-footer',
  template: `
    <dw-form-date-picker [(ngModel)]="today"
                         [dwRenderExtraFooter]="footerRender"
                         dwLabel="{{'日期' | translate}}"
                         dwPlaceHolder="請輸入日期"
                         dwLabelSpan="4" dwInputSpan="20"></dw-form-date-picker>
    日期：{{today}}
  `
})
export class DatePickerFooterComponent {

  today = new Date();
  footerRender = (): any => 'extra footer';

  constructor() { }

}
