import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'dw-time-picker-form',
  template: `
    <form dw-form [formGroup]="form">
    <dw-form-time-picker formControlName="today"
                  [dwValue]="today" dwLabel="{{'required' | translate}}"
                  dwLabel="{{'時間' | translate}}"
                  dwPlaceHolder="請輸入時間"
                  dwLabelSpan="6" dwInputSpan="18" [dwRequired]="true"></dw-form-time-picker>
    </form>
    Form value: {{form.value | json}}
    `
})
export class TimePickerFormComponent {

  today = null;
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group(
      {
        'today': [this.today, [Validators.required]]
      }
    );

  }

}
