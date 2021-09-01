import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FullCalendarModule } from '@fullcalendar/angular';
import { TranslateModule } from '@ngx-translate/core';
import { DwButtonModule } from 'ng-quicksilver/button';
import { DwCalendarModule } from 'ng-quicksilver/calendar';
import { DwListModule } from 'ng-quicksilver/list';
import { DwToolTipModule } from 'ng-quicksilver/tooltip';
import { DwDropDownModule } from 'ng-quicksilver/dropdown';
import { DwModalModule } from 'ng-quicksilver/modal';
import { DwSwitchModule } from 'ng-quicksilver/switch';
import { DwSelectModule } from 'ng-quicksilver/select';
import { DwGridModule } from 'ng-quicksilver/grid';
import { DwFormModule } from 'ng-quicksilver/form';
import { DwDatePickerModule } from 'ng-quicksilver/date-picker';
import { DwCheckboxModule } from 'ng-quicksilver/checkbox';
import { DwIconModule } from 'ng-quicksilver/icon';
import { DwInputModule } from 'ng-quicksilver/input';
import { DwLayoutModule } from 'ng-quicksilver/layout';

import { DwContainerModule } from '@webdpt/components/redevelop';
import { DwPlanCalendarAddComponent } from './plan-calendar-add/plan-calendar-add.component';
import { DwPlanCalendarCardComponent } from './plan-calendar-card/plan-calendar-card.component';
import { DwPlanCalendarListComponent } from './plan-calendar-list/plan-calendar-list.component';
import { DwPlanCalendarDefaultComponent } from './plan-calendar-default/plan-calendar-default.component';
import { DwPlanCalendarToolbarComponent } from './plan-calendar-toolbar/plan-calendar-toolbar.component';
import { DwPlanCalendarViewComponent } from './plan-calendar-view/plan-calendar-view.component';
import { DwPlanCalendarModifyComponent } from './plan-calendar-modify/plan-calendar-modify.component';
import { DwPlanCalendarSubscribeComponent } from './plan-calendar-subscribe/plan-calendar-subscribe.component';
import { DwPlanCalendarEventAddComponent } from './plan-calendar-event-add/plan-calendar-event-add.component';
import { DwPlanCalendarEventDetailComponent } from './plan-calendar-event-detail/plan-calendar-event-detail.component';
import { DwPlanCalendarEventModifyComponent } from './plan-calendar-event-modify/plan-calendar-event-modify.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    FullCalendarModule,
    DwButtonModule,
    DwIconModule,
    DwCalendarModule,
    DwListModule,
    DwGridModule,
    DwToolTipModule,
    DwDropDownModule,
    DwModalModule,
    DwSwitchModule,
    DwSelectModule,
    DwFormModule,
    DwDatePickerModule,
    DwCheckboxModule,
    DwContainerModule,
    DwInputModule,
    DwLayoutModule
  ],
  declarations: [
    DwPlanCalendarViewComponent,
    DwPlanCalendarToolbarComponent,
    DwPlanCalendarCardComponent,
    DwPlanCalendarListComponent,
    DwPlanCalendarAddComponent,
    DwPlanCalendarModifyComponent,
    DwPlanCalendarSubscribeComponent,
    DwPlanCalendarEventAddComponent,
    DwPlanCalendarEventDetailComponent,
    DwPlanCalendarEventModifyComponent,
    DwPlanCalendarDefaultComponent,
  ],
  exports: [
    DwPlanCalendarViewComponent,
    DwPlanCalendarToolbarComponent,
    DwPlanCalendarCardComponent,
    DwPlanCalendarListComponent,
    DwPlanCalendarAddComponent,
    DwPlanCalendarModifyComponent,
    DwPlanCalendarSubscribeComponent,
    DwPlanCalendarEventAddComponent,
    DwPlanCalendarEventDetailComponent,
    DwPlanCalendarEventModifyComponent,
    DwPlanCalendarDefaultComponent,
  ],
  providers: [
  ]
})

export class DwPlanCalendarModule { }
