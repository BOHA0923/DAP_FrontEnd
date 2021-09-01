import { Component, Input, TemplateRef } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'dw-form-item-panel',
  template: `
    <dw-form-item [dwAlign]="dwAlign"
                  [dwGutter]="dwGutter"
                  [dwJustify]="dwJustify">
      <dw-form-label [dwRequired]="dwRequired"
                     [dwOffset]="dwLabelOffset"
                     [dwOrder]="dwLabelOrder"
                     [dwPull]="dwLabelPull"
                     [dwPush]="dwLabelPush"
                     [dwSpan]="dwLabelSpan"
                     [dwXs]="dwLabelXs"
                     [dwSm]="dwLabelSm"
                     [dwMd]="dwLabelMd"
                     [dwLg]="dwLabelLg"
                     [dwXl]="dwLabelXl"
                     [dwXXl]="dwLabelXXl"
                     [dwFlex]="dwLabelFlex"
                     *ngIf="titleStr ; else titleTpl">{{titleStr}}
      </dw-form-label>
      <dw-form-control #dwFormControl [dwHasFeedback]="dwHasFeedback"
                       [dwOffset]="dwInputOffset"
                       [dwOrder]="dwInputOrder"
                       [dwPull]="dwInputPull"
                       [dwPush]="dwInputPush"
                       [dwSpan]="dwInputSpan"
                       [dwXs]="dwInputXs"
                       [dwSm]="dwInputSm"
                       [dwMd]="dwInputMd"
                       [dwLg]="dwInputLg"
                       [dwXl]="dwInputXl"
                       [dwXXl]="dwInputXXl"
                       [dwValidateStatus]="dwValidateStatus"
                       [dwFlex]="dwInputFlex"
                       [dwErrorTip]="dwInputErrorTip"
      >
        <ng-content></ng-content>
        <ng-template #dwInputErrorTip>
          <ng-container *ngFor="let msg of validationMessages">
            {{ msg.message || (msg.key | translate:msg.params) }}
          </ng-container>
        </ng-template>
      </dw-form-control>
    </dw-form-item>
  `
})
export class DwFormItemPanelComponent {
  titleStr: string;
  titleTpl: TemplateRef<void>;
  /* 是否Flex布局  */
  @Input() dwLabelFlex: string | number;
  @Input() dwInputFlex: string | number;
  @Input() dwRequired: boolean = false;
  @Input() dwFor: string;
  @Input() dwHasFeedback: boolean = false;
  /* dw-col for label */
  @Input() dwLabelOffset: number;
  @Input() dwLabelOrder: number;
  @Input() dwLabelPull: number;
  @Input() dwLabelPush: number;
  @Input() dwLabelSpan: number;
  @Input() dwLabelXs: number;
  @Input() dwLabelSm: number;
  @Input() dwLabelMd: number;
  @Input() dwLabelLg: number;
  @Input() dwLabelXl: number;
  @Input() dwLabelXXl: number;
  /* dw-col for input */
  @Input() dwInputOffset: number;
  @Input() dwInputOrder: number;
  @Input() dwInputPull: number;
  @Input() dwInputPush: number;
  @Input() dwInputSpan: number;
  @Input() dwInputXs: number;
  @Input() dwInputSm: number;
  @Input() dwInputMd: number;
  @Input() dwInputLg: number;
  @Input() dwInputXl: number;
  @Input() dwInputXXl: number;
  @Input() validationMessages: any = [];
  @Input() dwValidateStatus: FormControl;
  @Input() dwAlign: 'top' | 'middle' | 'bottom';
  @Input() dwGutter: number|object|[number, number]|[object, object];
  @Input() dwJustify: 'start' | 'end' | 'center' | 'space-around' | 'space-between';
  @Input()
  set dwLabel(title: string | TemplateRef<void>) {
    if (title instanceof TemplateRef) {
      this.titleTpl = title;
    } else {
      this.titleStr = title;
    }
  }
}
