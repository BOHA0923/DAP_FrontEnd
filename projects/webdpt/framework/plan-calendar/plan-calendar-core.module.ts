import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FullCalendarModule } from '@fullcalendar/angular';
import { TranslateModule } from '@ngx-translate/core';

import { DwPlanCalendarColorService } from './service/plan-calendar-color.service';
import { DwPlanCalendarService } from './service/plan-calendar.service';
import { DwPlanCalendarModalService } from './service/plan-calendar-modal.service';
import { DwPlanCalendarRepository } from './repository/plan-calendar-repository';
import { DwPlanCalendarEventRepository } from './repository/plan-calendar-event-repository';
import { DwPlanCalendarPermissionService } from './service/plan-calendar-permission.service';
import { DwPlanCalendarManageService } from './service/plan-calendar-manage.service';
import { DwPlanCalendarEventManageService } from './service/plan-calendar-event-manage.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule
  ],
  providers: [
  ]
})

export class DwPlanCalendarCoreModule {
  static forChild(): ModuleWithProviders<DwPlanCalendarCoreModule> {
    return {
      ngModule: DwPlanCalendarCoreModule,
      providers: [
        DwPlanCalendarColorService,
        DwPlanCalendarService,
        DwPlanCalendarModalService,
        // 行事曆和API相關的服務
        DwPlanCalendarRepository,
        DwPlanCalendarEventRepository,
        DwPlanCalendarPermissionService,
        DwPlanCalendarManageService,
        DwPlanCalendarEventManageService,
      ]
    };
  }
}
