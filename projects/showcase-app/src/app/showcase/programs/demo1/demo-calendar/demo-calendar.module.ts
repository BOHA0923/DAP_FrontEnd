import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShowcaseSharedModule } from '../../../shared/shared.module';
import { DemoCalendarComponent } from './demo-calendar.component';
import { DemoCalendarRoutingModule } from './demo-calendar-routing.module';
import { DwPlanCalendarModule } from '@webdpt/components/plan-calendar';

@NgModule({
  imports: [
    CommonModule,
    DemoCalendarRoutingModule,
    ShowcaseSharedModule,
    DwPlanCalendarModule // 載入行事曆模組
  ],
  declarations: [
    DemoCalendarComponent
  ],
  entryComponents: [],
  providers: []
})

export class DemoCalendarModule { }
