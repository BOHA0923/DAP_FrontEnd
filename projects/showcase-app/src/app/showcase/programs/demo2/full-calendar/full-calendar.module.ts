import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DwLanguageService } from '@webdpt/framework/language';
import { ShowcaseSharedModule } from '../../../shared/shared.module';
import { DwEventEditorComponent } from './event-editor.component';
import { DwSimpleFullCalendarComponent } from './simple.component';

const FULL_CALENDAR_ROUTES: Routes = [
  {
    path: 'simple',
    component: DwSimpleFullCalendarComponent,
    data: {
      dwRouteData: {
        programId: 'dw-calendar',
        dwAuthId: 'dw-calendar'
      }
    },
    resolve: {
      transaction: DwLanguageService
    }
  }
];

@NgModule({
  imports: [
    CommonModule,
    ShowcaseSharedModule,
    RouterModule.forChild(FULL_CALENDAR_ROUTES)
  ],
  declarations: [
    DwSimpleFullCalendarComponent,
    DwEventEditorComponent
  ],
  entryComponents: [
    DwEventEditorComponent
  ],
  exports: [
    DwEventEditorComponent
  ]
})
export class DwFullCalendarModule {}
