import { ControlContainer, ControlValueAccessor, FormControl, FormGroup, FormGroupDirective } from '@angular/forms';
import { AfterContentInit, EventEmitter, HostListener, Input, OnInit, Output, TemplateRef, Directive } from '@angular/core';
import { TranslateParser } from '@ngx-translate/core';
import { InputBoolean } from '@webdpt/framework/utils';

export abstract class AbstractDwFormItemComponent implements ControlValueAccessor, AfterContentInit, OnInit {

  /* Flex布局  */
  @Input() dwLabelFlex: string | number;
  @Input() dwInputFlex: string | number;
  @Input() dwRequired: boolean = false;
  @Input() dwFor: string;
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
  @Input() dwHasFeedback: boolean;
  @Input() dwLabel: string | TemplateRef<any>;
  @Input() dwAlign: 'top' | 'middle' | 'bottom';
  @Input() dwGutter: number|object|[number, number]|[object, object];
  @Input() dwJustify: 'start' | 'end' | 'center' | 'space-around' | 'space-between';
  @Input() @InputBoolean() dwDisabled: boolean = false;

  control: FormControl;
  _composing: boolean = false;
  _value: any;
  _form: FormGroup;

  validateStatus: string;
  controlContainer: ControlContainer;
  onChange = (value: any): void => { this.dwValue = value; };
  onTouched = (): void => {};


  @Input() formControlName: string;
  @Input() customMessages: { key: string, message: string };

  @HostListener('compositionstart', ['$event'])
  compositionStart(e: CompositionEvent): void {
    this._composing = true;
  }

  @HostListener('compositionend', ['$event'])
  compositionEnd(e: CompositionEvent): void {
    this._composing = false;
    this.onChange(this._value);
  }
  _validationMessages;

  @Input()
  set validationMessages(value: any) {
    this._validationMessages = value;
  }
  get validationMessages(): any {
    // console.log('get validationMessages!', this._validationMessages);
    return this._validationMessages;

  }
  protected constructor(
    protected _fg: ControlContainer,
    protected _translateService: TranslateParser
  ) {
    this.controlContainer = _fg;
  }

  @Output() dwValueChange: EventEmitter<any> = new EventEmitter<any>();
  @Input()
  set dwValue(value: any) {
    if ((this._value === value) || ((this._value == null) && (value == null))) {
      return;
    }
    this._value = value;
    if (!this._composing) {
      this.onChange(value);
      this.dwValueChange.emit(value);
    }
  }
  get dwValue(): any {
    return this._value;
  }



  ngOnInit(): void {
    this._form = this._getForm();
    if (this._form && this.formControlName) {
      this.control = <FormControl>this._form.get(this.formControlName);
      this.control.statusChanges.subscribe(data => this.updateValidateStatus(data));
    }
    this.onInit();
  }


  ngAfterContentInit(): void {
    this.afterContentInit();
  }

  updateValidateStatus(status: string): void {
    this.validateStatus = status;
    const errorKeys = [];
    const errors = this.control.errors;
    /* tslint:disable-next-line: forin */
    for (const key in errors) {
      const custMsgs = this.customMessages ? this.customMessages[key] : null;
      let msg = null;
      const error = errors[key];
      if (this._translateService) {
        msg = this._translateService.interpolate(custMsgs, error);
      }
      errorKeys.push({
        key: key,
        params: error,
        message: msg
      });
    }
    this.validationMessages = errorKeys;
  }

  protected _getForm(): FormGroup {
    return this.controlContainer ? this.controlContainer.formDirective ?
      (this.controlContainer.formDirective as FormGroupDirective).form : null : null;
  }

  getControl(name: string): any {
    return this._form ? this._form.get(name) : null;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.dwDisabled = isDisabled;
  }

  writeValue(value: any): void {
    this.dwValue = value;
    this.onChange(value);
  }

  abstract afterContentInit(): void;

  abstract onInit(): void;
}
