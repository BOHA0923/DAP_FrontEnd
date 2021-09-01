import { Component } from '@angular/core';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'dw-time-picker-open',
  template: `
    <dw-form-time-picker
      [(ngModel)]="today"
      dwFormat="HH:mm:ss"
      dwLabel="{{'時間' | translate}}"
      dwPlaceHolder="請輸入時間"
      [dwDisabledHours]="disabledHours"
      [dwDisabledMinutes]="disabledMinutes"
      [dwDisabledSeconds]="disabledSeconds"
      (ngModelChange)="onTimeChange($event)"
      (dwOpenChange)="handleChange($event)"
      dwLabelSpan="4" dwInputSpan="20">
    </dw-form-time-picker>
    時間：{{today}}
  `
})
export class TimePickerDisabledTimeComponent {

  today: string = (new DatePipe('zh_tw')).transform(new Date(), 'yyyy-MM-dd HH:mm:ss');

  constructor() { }

  disabledHours(): number[] {
    return [ 1, 2, 3 ];
  }

  disabledMinutes(hour: number): number[] {
    if (hour === 4) {
      return [ 20, 21, 22, 23, 24, 25 ];
    } else {
      return [];
    }
  }

  disabledSeconds(hour: number, minute: number): number[] {
    if ((hour === 5) && (minute === 1)) {
      return [ 20, 21, 22, 23, 24, 25 ];
    } else {
      return [];
    }
  }

  onTimeChange($event: string): void {
    console.log('onTimeChange>>>', $event);
  }


  handleChange(open: boolean): void {
    console.log('handleChange>>>>', open);
  }

}
