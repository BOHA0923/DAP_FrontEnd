import { Component } from '@angular/core';

@Component({
  selector: 'dw-input-base',
  template: `
    <dw-form-input [(ngModel)]="username" dwLabel="{{'姓名' | translate}}"
                   dwPlaceHolder="請輸入姓名"
                   dwLabelSpan="4" dwInputSpan="20"></dw-form-input>
    姓名：{{username}}
  `
})
export class InputBaseComponent {

  username = 'hello';

  constructor() { }

}
