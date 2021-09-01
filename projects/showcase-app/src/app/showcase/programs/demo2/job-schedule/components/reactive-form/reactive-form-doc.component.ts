import { Component } from '@angular/core';

@Component({
  selector: 'dw-simple-job-schedule-in-modal-doc',
  templateUrl: './reactive-form-doc.component.html',
  styles: [`
    code.key {
      margin: 0 1px;
      background: #f2f4f5;
      padding: .2em .4em;
      border-radius: 3px;
      font-size: .9em;
      border: 1px solid #eee;
      color: #c41d7f;
    }

    ::ng-deep .ant-table-placeholder {
      display: none;
    }
  `]
})
export class DwReactiveFormDocComponent {
  requireJsonText = `
  {
    schedule_type: string, // '2': 每日  '4': recurrence rule
    time_radio:    string,    // '0': 指定每日执行时间  '1': 指定每日周期时段
    time:  string,  // 每日执行时间
    time1: string, // 每日周期时段1
    time2: string, // 每日周期时段2
    time3: string, // 每日周期时段3
    rrule: string  // Recurrence Rule
  }`;

}
