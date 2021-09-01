import { Component, EventEmitter, forwardRef, Input, Optional, Output, TemplateRef, ViewChild } from '@angular/core';
import { ControlContainer, NG_VALUE_ACCESSOR } from '@angular/forms';
import { TranslateParser } from '@ngx-translate/core';
import { AbstractDwFormPickerComponent } from './abstract-dw-form-picker-component';
import { FunctionProp } from 'ng-quicksilver/core/types/common-wrap';
import { DwDatePickerComponent } from 'ng-quicksilver/date-picker';

import { toBoolean } from '@webdpt/framework/utils';


@Component({
  selector: 'dw-form-date-picker',
  template: `
    <dw-form-item-panel [dwLabelFlex]="dwLabelFlex"
                        [dwInputFlex]="dwInputFlex"
                        [dwAlign]="dwAlign"
                        [dwGutter]="dwGutter"
                        [dwJustify]="dwJustify"
                        [dwRequired]="dwRequired"
                        [dwFor]="dwFor"
                        [dwLabelOffset]="dwLabelOffset"
                        [dwLabelOrder]="dwLabelOrder"
                        [dwLabelPull]="dwLabelPull"
                        [dwLabelPush]="dwLabelPush"
                        [dwLabelSpan]="dwLabelSpan"
                        [dwLabelXs]="dwLabelXs"
                        [dwLabelSm]="dwLabelSm"
                        [dwLabelMd]="dwLabelMd"
                        [dwLabelLg]="dwLabelLg"
                        [dwLabelXl]="dwLabelXl"
                        [dwLabelXXl]="dwLabelXXl"
                        [dwHasFeedback]="dwHasFeedback"
                        [dwInputOffset]="dwInputOffset"
                        [dwInputOrder]="dwInputOrder"
                        [dwInputPull]="dwInputPull"
                        [dwInputPush]="dwInputPush"
                        [dwInputSpan]="dwInputSpan"
                        [dwInputXs]="dwInputXs"
                        [dwInputSm]="dwInputSm"
                        [dwInputMd]="dwInputMd"
                        [dwInputLg]="dwInputLg"
                        [dwInputXl]="dwInputXl"
                        [dwInputXXl]="dwInputXXl"
                        [validationMessages]="validationMessages"
                        [dwValidateStatus]="control"
                        [dwLabel]="dwLabel">
      <dw-date-picker #dwDatePicker style="width: 100%;"
        [(ngModel)]="dwValue"
        (ngModelChange)="change($event)"
        [dwAllowClear]="dwAllowClear"
        [dwAutoFocus]="dwAutoFocus"
        [ngClass]="dwClassName"
        [dwDisabled]="dwDisabled"
        [dwDisabledDate]="dwDisabledDate"
        [dwLocale]="dwLocale"
        [dwPlaceHolder]="dwPlaceHolder"
        [dwPopupStyle]="dwPopupStyle"
        [dwDropdownClassName]="dwDropdownClassName"
        [dwSize]="dwSize"
        [ngStyle]="dwStyle"
        (dwOnOpenChange)="dwOnOpenChange.emit()"
        [dwDisabledTime]="dwDisabledTime"
        [dwFormat]="dwFormat"
        [dwRenderExtraFooter]="dwRenderExtraFooter"
        [dwShowTime]="dwShowTime"
        [dwShowToday]="dwShowToday"
        (dwOnOk)="dwOnOk.emit()"
      >
      </dw-date-picker>
    </dw-form-item-panel>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DwFormDatePickerComponent),
      multi: true
    }
  ]
})
export class DwFormDatePickerComponent extends AbstractDwFormPickerComponent {

  @Input() dwDisabledTime: (current: Date, partial?: 'start' | 'end') => { nzDisabledHours, nzDisabledMinutes, nzDisabledSeconds };
  @Input() dwFormat: string;
  @Input() dwRenderExtraFooter: FunctionProp<TemplateRef<void> | string>;
  private _showTime: object | boolean;

  @Input()
  get dwShowTime(): object | boolean { return this._showTime; }
  set dwShowTime(value: object | boolean) {
    this._showTime = typeof value === 'object' ? value : toBoolean(value);
  }

  @Input() dwShowToday = true;
  @Output() dwOnOk: EventEmitter<Date> = new EventEmitter<Date>();

  @ViewChild('dwDatePicker') dwDatePicker: DwDatePickerComponent;

  private _open;
  @Input()
  set dwOpen(value: boolean) {
    if (this.dwDatePicker) {
      this.dwDatePicker.dwOpen = value;
    }
  }
  get dwOpen(): boolean {
    return this.dwDatePicker ? this.dwDatePicker.dwOpen : false;
  }

  constructor(@Optional() protected _fg: ControlContainer,
              @Optional() protected _ts: TranslateParser) {
    super(_fg, _ts);
  }

  afterContentInit(): void {
    if (this._open !== undefined) {
      this.dwDatePicker.dwOpen = this._open;
    }
  }

  change(event: any): void {
    this.onChange(event);
  }

  onInit(): void {

  }

}
