import { Component, forwardRef, Input, Optional, TemplateRef, ViewChild, EventEmitter, Output, Inject } from '@angular/core';
import { ControlContainer, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DwTimePickerComponent } from 'ng-quicksilver/time-picker';
import { AbstractDwFormItemComponent } from '../form-field/abstract-dw-form-item-component';
import { TranslateParser } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';
import { InputBoolean } from '@webdpt/framework/utils';
import { APP_DATE_FORMAT, APP_TIME_FORMAT } from '@webdpt/framework/config';

@Component({
  selector: 'dw-form-time-picker',
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
      <dw-time-picker #dwTimePicker
        [(ngModel)]="dwTimeValue"
        (ngModelChange)="ngModelChange()"
        [dwAddOn]="dwAddOn"
        [dwAllowEmpty]="dwAllowEmpty"
        [dwClearText]="dwClearText"
        [dwDisabled]="dwDisabled"
        [dwPopupClassName]="dwPopupClassName"
        [dwHourStep]="dwHourStep"
        [dwMinuteStep]="dwMinuteStep"
        [dwSecondStep]="dwSecondStep"
        [dwDisabledHours]="dwDisabledHours"
        [dwDisabledMinutes]="dwDisabledMinutes"
        [dwDisabledSeconds]="dwDisabledSeconds"
        (dwOpenChange)="dwOpenChange.emit($event)"
        [dwSize]="dwSize"
        >
      </dw-time-picker>
    </dw-form-item-panel>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DwFormTimePickerComponent),
      multi: true
    }
  ]
})

export class DwFormTimePickerComponent extends AbstractDwFormItemComponent {
  @ViewChild('dwTimePicker', {static: true}) dwTimePicker: DwTimePickerComponent;

  // @Input() dwPlaceHolder: string; // 沒有值的時候顯示的內容.
  @Input() dwAddOn: TemplateRef<void>; // 選擇框底部顯示自定義的內容.
  @Input() @InputBoolean() dwAllowEmpty: boolean = true; // 是否展示清除按鈕.
  @Input() dwClearText: string; // 清除按鈕的提示文字.
  // @Input() @InputBoolean() dwAutoFocus: boolean; // 自動獲取焦點(有時會沒有反應).
  @Input() @InputBoolean() dwDisabled: boolean = false; // 禁用.
  // @Input() @InputBoolean() dwOpen: boolean = false; // 面板是否打開，可雙向繫結, 初始打開位置會跑掉.
  @Input() dwPopupClassName: string; // 彈出層類名.
  @Output() dwOpenChange: EventEmitter<boolean> = new EventEmitter<boolean>(); // 面板打開/關閉時的回調.
  @Input() dwHourStep: number;	// 小時選項間隔.
  @Input() dwMinuteStep: number;	// 分鐘選項間隔.
  @Input() dwSecondStep: number;	// 秒選項間隔.
  @Input() dwFormat: string; // 展示的時間格式.
  @Input() @InputBoolean() dwHideDisabledOptions: boolean = false;  // 是否要隱藏[禁止選擇的選項].
  @Input() dwDisabledHours: () => number[]; // 禁止選擇部分小時選項.
  @Input() dwDisabledMinutes: (hour: number) => number[]; // 禁止選擇部分分鐘選項.
  @Input() dwDisabledSeconds: (hour: number, minute: number) => number[]; // 禁止選擇部分秒選項.
  // @Input() dwDefaultOpenValue: Date; //設定面板打開時預設選中的值
  @Input() dwSize: string; // 輸入框的大小.


  @Input()
  set dwDefaultOpenValue(value: string | Date) {
    this.dwTimePicker.dwDefaultOpenValue = new Date(<any>value);
  }

  // 當沒有設定時, 可以顯示預設值[dwFormat].
  private strPlaceHolder: string;
  @Input()
  set dwPlaceHolder(value: string) {
    this.strPlaceHolder = value;
  }


  // 依設定直接打開時, timePicker 的下拉窗會跑掉, 顯示與設定有時間差, 使用 timeout 控制.
  private isOpen: boolean;
  @Input()
  set dwOpen(value: boolean) {
    this.isOpen = value;
  }

  // 顯示與設定有時間差, 使用 timeout 控制.
  private isFocus: boolean;
  @Input()
  set dwAutoFocus(value: boolean) {
    this.isFocus = value;
  }

  dwTimeValue: Date | null = null;

  constructor(@Optional() protected _fg: ControlContainer,
              @Optional() protected _ts: TranslateParser,
              @Inject(APP_DATE_FORMAT) private dwDateFormat: string,
              @Inject(APP_TIME_FORMAT) private dwTimeFormat: string) {
    super(_fg, _ts);
  }


  afterContentInit(): void {
    if (this.dwFormat === undefined) {
      this.dwFormat = this.dwTimeFormat;
    }
    this.dwTimePicker.dwFormat = this.dwFormat;

    if (this.strPlaceHolder === undefined) {
      this.strPlaceHolder = this.dwFormat;
    }
    this.dwTimePicker.dwPlaceHolder = this.strPlaceHolder;

    // 當收到 Date 格式時, 可以將Date 格式轉成 string 並通知formControlName.
    // 會偶發 ExpressionChangedAfterItHasBeenCheckedError 錯誤, 所以需使用 setTimeout.
    setTimeout(() => {
      this.notifyValueChange();

      if (this.isFocus !== undefined) {
          this.dwTimePicker.dwAutoFocus = this.isFocus;
      }

      // 如果預設有要直接開啟時間選單時, 要先取得 Focus, 不然位置會跑掉.
      if (this.isOpen !== undefined) {
        if (this.isOpen) {
          this.dwTimePicker.dwAutoFocus = true;
        }
        this.dwTimePicker.dwOpen = this.isOpen;
      }
    });
  }

  onInit(): void {}


  ngModelChange(): void {
    this.notifyValueChange();
  }

  /**
   * 值改變時, 用 onChange 把值寫回.
   *
   */
  notifyValueChange(): void {
    const strFormat = this.dwDateFormat.concat(' ', this.dwTimeFormat);
    const newTime = (new DatePipe('zh_tw')).transform(this.dwTimeValue, strFormat);

    this.onChange(newTime);
  }

  // 初始化時, 從元件設定的 ngModel 帶進入的值, 每一次作業的formControl的值改變, 這裡都會執行.
  // 利用 method 的入參做控卡, 使用時再轉<any>.
  writeValue(obj: string | Date): void {
    if (!obj) {
      obj = null;
    }

    if (obj) {
      this.dwTimeValue = new Date(<any>obj);
    }
  }

}
