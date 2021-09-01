import { Component, OnInit } from '@angular/core';

import { DwPlanCalendarCoreModule } from '@webdpt/framework/plan-calendar';

@Component({
  selector: 'app-dw-demo-calendar',
  templateUrl: './demo-calendar.component.html',
  styleUrls: ['./demo-calendar.component.less'],
  providers: [
    ...DwPlanCalendarCoreModule.forChild().providers, // 載入行事曆providers
  ]
})
export class DemoCalendarComponent implements OnInit {
  constructor(
  ) { }

  ngOnInit(): void {
  }
}
