import { Component } from '@angular/core';

@Component({
  selector: 'dw-simple-job-schedule-in-modal-doc',
  templateUrl: './simple-schedule-doc.component.html',
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
export class DwSimpleJobScheduleInModalDocComponent {
}
