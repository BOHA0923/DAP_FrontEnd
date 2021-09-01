import { Component } from '@angular/core';

@Component({
  selector: 'dw-select-tags',
  template: `
    <dw-form-select [dwOptionList]="dwOptionList" dwMode="tags"
                    [(ngModel)]="users" dwLabel="{{'姓名' | translate}}"
                    dwPlaceHolder="請選擇姓名"
                    dwLabelSpan="4" dwInputSpan="20"></dw-form-select>
    姓名：{{users | json}}
  `
})
export class SelectTagsComponent {

  users = ['jack'];
  dwOptionList = [
    {label: 'Jack', value: 'jack'},
    {label: 'Lucy', value: 'lucy'},
    {label: 'Disabled', value: 'disabled'}
  ];

  constructor() { }

}
