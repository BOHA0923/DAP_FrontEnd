import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DwAuthGuardService } from '@webdpt/framework/auth';
import { DwLanguageService } from '@webdpt/framework/language';
import { ShowcaseSharedModule } from '../../../shared/shared.module';
import { DwLayoutModule } from 'ng-quicksilver/layout';
import { DwGridModule } from 'ng-quicksilver/grid';
import { DwDividerModule } from 'ng-quicksilver/divider';
import { DwTabsModule } from 'ng-quicksilver/tabs';
import { DwFormModule } from 'ng-quicksilver/form';
import { DwAnchorModule } from 'ng-quicksilver/anchor';
import { DwTableModule } from 'ng-quicksilver/table';

import { DwSimpleJobScheduleInModalDocComponent } from './components/modals/simple-schedule-doc.component';
import { DwReactiveFormDocComponent } from './components/reactive-form/reactive-form-doc.component';
import { DwSimpleJobScheduleInModalComponent } from './components/modals/simple-schedule.component';
import { DwJobScheduleInReactiveFormComponent } from './components/reactive-form/reactive-form.component';
import { DwJobScheduleComponent } from './job-schedule.component';
import { HighlightModule } from 'ngx-highlightjs';

const JOB_SCHEDULE_ROUTES = [{
  path: '',
  component: DwJobScheduleComponent,
  canActivate: [DwAuthGuardService],
  data: {
    dwRouteData: {
      programId: 'dw-job-schedule',
      dwAuthId: 'dw-job-schedule'
    }
  },
  resolve: {
    transaction: DwLanguageService
  }
}];

const JOB_SCHEDULE_COMPONENTS = [
  DwJobScheduleInReactiveFormComponent,
  DwSimpleJobScheduleInModalComponent,
  DwReactiveFormDocComponent,
  DwSimpleJobScheduleInModalDocComponent
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(JOB_SCHEDULE_ROUTES),
    ShowcaseSharedModule,
    DwLayoutModule,
    DwGridModule,
    DwDividerModule,
    DwTabsModule,
    DwFormModule,
    DwAnchorModule,
    DwTableModule,
    HighlightModule.forRoot({ theme: 'agate' })
  ],
  declarations: [
    DwJobScheduleComponent,
    ...JOB_SCHEDULE_COMPONENTS
  ],
  entryComponents: [
    ...JOB_SCHEDULE_COMPONENTS
  ],
  exports: [
    RouterModule
  ]
})
export class DwJobScheduleModule {}
