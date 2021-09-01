import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShowcaseSharedModule } from '../../../shared/shared.module';
import { DemoCalendarDesignComponent } from './demo-calendar-design.component';
import { DemoCalendarDesignRoutingModule } from './demo-calendar-design-routing.module';
import { DwPlanCalendarModule } from '@webdpt/components/plan-calendar';
import { DemoCalendarDesignEventDetailComponent } from './demo-calendar-design-event-detail/demo-calendar-design-event-detail.component';
import { DemoCalendarDesignEventModifyComponent } from './demo-calendar-design-event-modify/demo-calendar-design-event-modify.component';

@NgModule({
  imports: [
    CommonModule,
    DemoCalendarDesignRoutingModule,
    ShowcaseSharedModule,
    DwPlanCalendarModule // 載入行事曆模組
  ],
  declarations: [
    DemoCalendarDesignComponent,
    DemoCalendarDesignEventDetailComponent,
    DemoCalendarDesignEventModifyComponent
  ],
  providers: [
  ]
})

export class DemoCalendarDesignModule { }
