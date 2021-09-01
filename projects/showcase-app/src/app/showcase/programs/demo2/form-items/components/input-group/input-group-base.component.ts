import { Component } from '@angular/core';

@Component({
  selector: 'dw-input-group-base',
  template: `
    <dw-form-input-group [dwSuffix]="suffixTemplate" dwPrefixIcon="user"
                         [(ngModel)]="searchText" dwLabel="前置圖示"
                         dwPlaceHolder="請輸入搜尋文字"
                         dwLabelSpan="8" dwInputSpan="16"></dw-form-input-group>
    <ng-template #suffixTemplate>
      <i dw-icon dwType="close-circle" dwTheme="outline"
         (click)="searchText=null" *ngIf="searchText"></i>
    </ng-template>


    <dw-form-input-group dwSuffixIcon="search"
                         [(ngModel)]="searchText" dwLabel="后置圖示"
                         dwPlaceHolder="請輸入搜尋文字"
                         dwLabelSpan="8" dwInputSpan="16"></dw-form-input-group>


    <dw-form-input-group dwSearch [dwAddOnAfter]="suffixIconButton"
                         [(ngModel)]="searchText" dwLabel="自帶按鈕"
                         dwPlaceHolder="請輸入搜尋文字"
                         dwLabelSpan="8" dwInputSpan="16"></dw-form-input-group>
    <ng-template #suffixIconButton>
      <button dw-button dwType="primary" dwSearch><i dw-icon dwType="search" dwTheme="outline"></i></button>
    </ng-template>

    <dw-form-input-group dwSearch dwSize="large" [dwAddOnAfter]="suffixButton"
                         [(ngModel)]="searchText" dwLabel="自帶按鈕"
                         dwPlaceHolder="請輸入搜尋文字"
                         dwLabelSpan="8" dwInputSpan="16"></dw-form-input-group>
    <ng-template #suffixButton>
      <button dw-button dwType="primary" dwSize="large" dwSearch>Search</button>
    </ng-template>
    搜尋：{{searchText}}
  `,
  styles: []
})
export class InputGroupBaseComponent {

  searchText = '';

  constructor() { }

}
