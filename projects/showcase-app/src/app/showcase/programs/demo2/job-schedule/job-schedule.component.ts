const ReactiveFormCode = require('!raw-loader!./components/reactive-form/reactive-form.component.ts');
const SimpleInModalCode = require('!raw-loader!./components/modals/simple-schedule.component.ts');
import { Component } from '@angular/core';
import { DwSimpleJobScheduleInModalDocComponent } from './components/modals/simple-schedule-doc.component';
import { DwSimpleJobScheduleInModalComponent } from './components/modals/simple-schedule.component';
import { DwReactiveFormDocComponent } from './components/reactive-form/reactive-form-doc.component';
import { DwJobScheduleInReactiveFormComponent } from './components/reactive-form/reactive-form.component';

@Component({
  selector: 'dw-job-schedule',
  templateUrl: './job-schedule.component.html'
})
export class DwJobScheduleComponent {
  demoComponents = [
    {
      selector: 'dw-job-schedule-in-form',
      title: '表單',
      doc: DwReactiveFormDocComponent,
      examples: [
        {
          title: '表單中使用排程組件',
          type: DwJobScheduleInReactiveFormComponent,
          id: 'dw-job-schedule-in-form',
          code: ReactiveFormCode
        }
      ]
    },
    {
      selector: 'dw-simple-job-schedule-in-modal',
      title: '開窗',
      doc: DwSimpleJobScheduleInModalDocComponent,
      examples: [
        {
          title: '簡單的每日任務',
          type: DwSimpleJobScheduleInModalComponent,
          id: 'dw-simple-job-schedule-in-modal',
          code: SimpleInModalCode
        }
      ]
    }
    // {
    //   selector: 'dw-form-items-common-doc',
    //   title: '共用屬性',
    //   doc: FormItemsCommonDocComponent
    // }
  ];
}
