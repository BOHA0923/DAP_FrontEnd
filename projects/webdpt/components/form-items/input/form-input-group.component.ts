import {Component, forwardRef, Input, Optional, TemplateRef} from '@angular/core';
import {ControlContainer, NG_VALUE_ACCESSOR} from '@angular/forms';
import {TranslateParser} from '@ngx-translate/core';
import { DwSizeLDSType } from 'ng-quicksilver/core/types';

import {AbstractDwFormItemComponent} from '../form-field/abstract-dw-form-item-component';

@Component({
  selector: 'dw-form-input-group',
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
      <dw-input-group [dwAddOnAfter]="dwAddOnAfter"
                      [dwAddOnAfterIcon]="dwAddOnAfterIcon"
                      [dwAddOnBefore]="dwAddOnBefore"
                      [dwAddOnBeforeIcon]="dwAddOnBeforeIcon"
                      [dwPrefix]="dwPrefix"
                      [dwPrefixIcon]="dwPrefixIcon"
                      [dwSuffix]="dwSuffix"
                      [dwSuffixIcon]="dwSuffixIcon"
                      [dwCompact]="dwCompact"
                      [dwSearch]="dwSearch"
                      [dwSize]="dwSize"
      >
        <input dw-input
               dwSize="large"
               [(ngModel)]="dwValue"
               [disabled]="dwDisabled"
               [attr.placeholder]="dwPlaceHolder">
      </dw-input-group>
    </dw-form-item-panel>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DwFormInputGroupComponent),
      multi: true
    }
  ]
})
export class DwFormInputGroupComponent extends AbstractDwFormItemComponent {

  @Input() dwPlaceHolder: string;

  @Input() dwAddOnAfter: string | TemplateRef<void>;
  @Input() dwAddOnAfterIcon: string | string[] | Set<string> | { [klass: string]: any; };
  @Input() dwAddOnBefore: string | TemplateRef<void>;
  @Input() dwAddOnBeforeIcon: string | string[] | Set<string> | { [klass: string]: any; };
  @Input() dwPrefix: string | TemplateRef<void>;
  @Input() dwPrefixIcon: string | string[] | Set<string> | { [klass: string]: any; };
  @Input() dwSuffix: string | TemplateRef<void>;
  @Input() dwSuffixIcon: string | string[] | Set<string> | { [klass: string]: any; };
  @Input() dwCompact: boolean = false;
  @Input() dwSearch: boolean = false;
  @Input() dwSize: DwSizeLDSType = 'default';

  constructor(@Optional() protected _fg: ControlContainer,
              @Optional() protected _ts: TranslateParser) {
    super(_fg, _ts);
  }

  afterContentInit(): void {}

  change(event: any): void {
    this.onChange(event.target.value);
  }

  onInit(): void {}

}
