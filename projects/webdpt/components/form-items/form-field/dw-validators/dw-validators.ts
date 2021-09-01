import {
  Validators,
  ValidatorFn
} from '@angular/forms';
import { AbstractControl } from '@angular/forms';
export function emailOrEmpty(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } => {
    return !control.value ? null : Validators.email(control);
  };
}

export function numberFormat(options: { decimal: number, hasNegative?: boolean }): ValidatorFn {
  let reg = new RegExp('^(\\d|[0-9]+)(\\.\\d{1,' + options.decimal + '})?$');
  if (options.hasNegative) {
    reg = new RegExp('^(-|\\+)?(\\d|[0-9]+)(\\.\\d{1,' + options.decimal + '})?$');
  }
  // console.log(reg);
  return (control: AbstractControl): { [key: string]: any } => {
    return !control.value ? null :
      (reg.test(control.value) ? null : { 'numberFormat': { decimal: options.decimal, hasNegative: options.hasNegative } });
  };
}
