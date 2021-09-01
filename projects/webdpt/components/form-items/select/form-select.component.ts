import { Component, EventEmitter, forwardRef, Input, Optional, Output } from '@angular/core';
import { ControlContainer, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DwOptionComponent } from 'ng-quicksilver/select';
import { AbstractDwFormItemComponent } from '../form-field/abstract-dw-form-item-component';
import { TranslateParser } from '@ngx-translate/core';
import { toBoolean } from '@webdpt/framework/utils';


@Component({
  selector: 'dw-form-select',
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

      <dw-select [(ngModel)]="dwValue" #dwSelect style="width: 100%;"
                 [compareWith]="compareWith"
                 [dwAllowClear]="dwAllowClear"
                 [dwOpen]="dwOpen"
                 (dwOpenChange)="dwOpenChange.emit()"
                 [dwAutoFocus]="dwAutoFocus"
                 [dwDisabled]="dwDisabled"
                 [dwDropdownClassName]="dwDropdownClassName"
                 [dwDropdownMatchSelectWidth]="dwDropdownMatchSelectWidth"
                 [dwDropdownStyle]="dwDropdownStyle"
                 [dwServerSearch]="dwServerSearch"
                 [dwFilterOption]="dwFilterOption"
                 [dwMaxMultipleCount]="dwMaxMultipleCount"
                 [dwMode]="dwMode"
                 [dwNotFoundContent]="dwNotFoundContent"
                 [dwPlaceHolder]="dwPlaceHolder"
                 [dwShowSearch]="dwShowSearch"
                 [dwSize]="dwSize"
                 (dwScrollToBottom)="dwScrollToBottom.emit()"
                 (dwOnSearch)="dwOnSearch.emit()">
        <ng-container *ngFor="let o of dwOptionList">
          <dw-option *ngIf="!dwIsLoading" [dwValue]="o.value" [dwLabel]="o.label" [dwDisabled]="o.disabled"></dw-option>
        </ng-container>
        <dw-option *ngIf="dwIsLoading" dwDisabled dwCustomContent>
          <i dw-icon dwType="loading" dwTheme="outline" class="anticon-spin loading-icon"></i>{{'dw-loadingData' | translate}}...
        </dw-option>
      </dw-select>
    </dw-form-item-panel>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DwFormSelectComponent),
      multi: true
    }
  ]
})
export class DwFormSelectComponent extends AbstractDwFormItemComponent {

  private _showSearch: boolean = false;
  @Input() compareWith: (o1: any, o2: any) => boolean = (o1: any, o2: any) => o1 === o2;
  @Input() dwAllowClear: boolean = false;
  @Input() dwOpen: boolean = false;
  @Output() dwOpenChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() dwAutoFocus: boolean = false;
  @Input() dwDisabled: boolean = false;
  @Input() dwDropdownClassName: string;
  @Input() dwDropdownMatchSelectWidth: boolean = true;
  @Input() dwDropdownStyle: any;
  @Input() dwServerSearch: boolean = false;
  @Input() dwFilterOption: (input?: string, option?: DwOptionComponent) => boolean = defaultFilterOption;
  @Input() dwMaxMultipleCount: number = Infinity;
  @Input() dwMode: 'multiple' | 'tags' | 'default' = 'default';
  @Input() dwNotFoundContent: string;
  @Input() dwPlaceHolder: string;

  @Input()
  set dwShowSearch(value: boolean | string) {
    this._showSearch = toBoolean(value);
  }

  get dwShowSearch(): boolean | string {
    return this._showSearch;
  }

  @Input() dwSize: 'large' | 'small' | 'default' = 'default';
  @Output() dwScrollToBottom: EventEmitter<void> = new EventEmitter<void>();
  @Output() dwOnSearch: EventEmitter<string> = new EventEmitter<string>();
  @Input() dwOptionList: { value: any, label: any, disabled?: boolean }[];
  @Input() dwIsLoading: boolean = false;

  constructor(@Optional() protected _fg: ControlContainer,
              @Optional() protected _ts: TranslateParser) {
    super(_fg, _ts);
  }

  afterContentInit(): void {}

  change(event: any): void {
    this.onChange(event);
  }

  onInit(): void {}

}


export function defaultFilterOption(input: string, option: DwOptionComponent): boolean {
  if (option && option.dwLabel) {
    return option.dwLabel.toLowerCase().indexOf(input.toLowerCase()) > -1;
  } else {
    return false;
  }
}
