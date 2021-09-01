import { Component } from '@angular/core';

@Component({
  selector: 'dw-select-search',
  template: `
    <dw-form-select [dwOptionList]="dwOptionList" dwShowSearch
                    [(ngModel)]="username" dwLabel="{{'姓名' | translate}}"
                    dwPlaceHolder="請輸入姓名"
                    dwLabelSpan="4" dwInputSpan="20"></dw-form-select>
    姓名：{{username}}
  `
})
export class SelectSearchComponent {

  username = 'jack';
  dwOptionList = [
    {label: 'Jack', value: 'jack'},
    {label: 'Lucy', value: 'lucy'},
    {label: 'Disabled', value: 'disabled'}
  ];

  constructor() { }

}
