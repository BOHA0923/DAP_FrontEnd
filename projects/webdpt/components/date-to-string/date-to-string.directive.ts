import { Directive, AfterViewInit, Input, Optional, Host, SkipSelf, Inject, OnInit } from '@angular/core';
import { AbstractControl, ControlContainer } from '@angular/forms';
import { distinctUntilChanged } from 'rxjs/operators';
import { DatePipe } from '@angular/common';

import { APP_DATE_FORMAT } from '@webdpt/framework/config';

@Directive({
  selector: '[dwDateToString]'
})
export class DateToStringDirective implements OnInit, AfterViewInit {

  private _dwformat: string;
  private _control: AbstractControl;

  @Input()
  set dwFormat(value: string) {
    if (value) {
      // 這裡如果有值, 可以 override constructor() 裡的值.
      this._dwformat = value;
    }
  }

  @Input() formControlName: string;

  /**
   * The @Optional property decorator tells Angular to return null when it can't find the dependency.
   * The @Host property decorator stops the upward search at the host component.
   * The @SkipSelf decorator allows you to skip the local injector and look up in the hierarchy to find a provider
   *     that satisfies this dependency
   */
  constructor(
    @Optional() @Host() @SkipSelf()
    private controlContainer: ControlContainer,
    @Inject(APP_DATE_FORMAT) private dwDateFormat: string
  ) {
    this._dwformat = dwDateFormat; // 這裡會先有值.
  }


  ngOnInit(): void {
    // [當有預設值時發動] - 無法寫在ngAfterViewInit()裡, 會報如下的錯誤.
    // logging.service.ts:33 Error: ExpressionChangedAfterItHasBeenCheckedError: Expression has changed after it was checked.
    if (this.controlContainer) {
      if (this.formControlName) {
        this._control = this.controlContainer.control.get(this.formControlName);

        // 如果預設值不是 Date 格式時, 不轉換值.
        if (this._control.value && this._control.value instanceof Date) {
          const initdate = (new DatePipe('zh_tw')).transform(this._control.value, this._dwformat);
          this._control.setValue(initdate);
        }

      }
    }

  }

  ngAfterViewInit(): void {

    if (this.controlContainer) {
      if (this.formControlName) {
        this._control = this.controlContainer.control.get(this.formControlName);

        // [值改變時發動]-如果不加 distinctUntilChanged(), 會導致在 setValue() 時, 一直觸發 valueChanges.
        this._control.valueChanges.pipe(distinctUntilChanged()).subscribe(
          (params: Date) => {
            const newdate = (new DatePipe('zh_tw')).transform(params, this._dwformat);
            this._control.setValue(newdate);
          }
        );

      }
    }
  }

}
