import { Component } from '@angular/core';

@Component({
  selector: 'dw-input-size',
  template: `
    <dw-form-input dwSize="small"
                   [(ngModel)]="username" dwLabel="姓名" dwLabelSpan="4" dwInputSpan="20"></dw-form-input>
    <dw-form-input dwSize="default"
                   [(ngModel)]="username" dwLabel="姓名" dwLabelSpan="4" dwInputSpan="20"></dw-form-input>
    <dw-form-input dwSize="large"
                   [(ngModel)]="username" dwLabel="姓名" dwLabelSpan="4" dwInputSpan="20"></dw-form-input>
  `
})
export class InputSizeComponent {

  username = 'hello';

  constructor() { }

}
