import { Component, EventEmitter, forwardRef, Input, Optional, Output, TemplateRef, ViewChild } from '@angular/core';
import { ControlContainer, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CascaderOption } from 'ng-quicksilver/cascader';

import { AbstractDwFormItemComponent } from '../form-field/abstract-dw-form-item-component';
import { TranslateParser } from '@ngx-translate/core';

@Component({
  selector: 'dw-form-cascader',
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
      <dw-cascader [ngModel]="dwValue" style="width: 100%"
                   [dwAllowClear]="dwAllowClear"
                   [dwAutoFocus]="dwAutoFocus"
                   [dwChangeOn]="dwChangeOn"
                   [dwChangeOnSelect]="dwChangeOnSelect"
                   [dwColumnClassName]="dwColumnClassName"
                   [dwDisabled]="dwDisabled"
                   [dwExpandTrigger]="dwExpandTrigger"
                   [dwMenuClassName]="dwMenuClassName"
                   [dwMenuStyle]="dwMenuStyle"
                   [dwLabelProperty]="dwLabelProperty"
                   [dwLabelRender]="dwLabelRender"
                   [dwLoadData]="dwLoadData"
                   [dwOptions]="dwOptions"
                   [dwPlaceHolder]="dwPlaceHolder"
                   [dwShowArrow]="dwShowArrow"
                   [dwShowInput]="dwShowInput"
                   [dwSize]="dwSize"
                   [dwValueProperty]="dwValueProperty"
                   (ngModelChange)="change($event)"
                   (dwVisibleChange)="dwVisibleChange.emit($event)"
                   (dwChange)="dwChange.emit($event)"
                   (dwSelectionChange)="dwSelectionChange.emit($event)"
                   (dwClear)="dwClear.emit($event)">
      </dw-cascader>
    </dw-form-item-panel>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DwFormCascaderComponent),
      multi: true
    }
  ]
})
export class DwFormCascaderComponent extends AbstractDwFormItemComponent {

  @Input() dwAllowClear = true;
  @Input() dwAutoFocus = false;
  @Input() dwChangeOn: (option: CascaderOption, level: number) => boolean;
  @Input() dwChangeOnSelect: false;
  @Input() dwColumnClassName: string;
  @Input() dwExpandTrigger: 'click' | 'hover' = 'click';
  @Input() dwMenuClassName: string;
  @Input() dwMenuStyle: any;
  @Input() dwLabelProperty: string = 'label';
  @Input() dwLabelRender: TemplateRef<any>;
  @Input() dwLoadData: (node: CascaderOption, index?: number) => PromiseLike<any>;
  @Input() dwOptions: CascaderOption[];
  @Input() dwPlaceHolder: string;
  @Input() dwShowArrow: boolean = true;
  @Input() dwShowInput: boolean = true;
  @Input() dwSize: 'large' | 'default' | 'small' = 'large';
  @Input() dwValueProperty: string = 'value';

  @Output() dwVisibleChange = new EventEmitter<boolean>();
  @Output() dwChange = new EventEmitter<any[]>();
  @Output() dwSelectionChange = new EventEmitter<CascaderOption[]>();
  @Output() dwClear = new EventEmitter<any>();

  constructor(@Optional() protected _fg: ControlContainer,
              @Optional() protected _ts: TranslateParser) {
    super(_fg, _ts);
  }

  afterContentInit(): void {}

  change(event: any): void {
    console.log(event);
    this.onChange(event);
  }

  onInit(): void {}

}
