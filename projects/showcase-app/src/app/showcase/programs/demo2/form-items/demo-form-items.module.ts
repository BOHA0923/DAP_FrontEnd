import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShowcaseSharedModule } from '../../../shared/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { DemoFormItemsComponent } from './demo-form-items.component';
import { ColorSketchModule } from 'ngx-color/sketch';
import {
  CascaderBaseComponent,
  CascaderDocComponent,
  CascaderLoadingComponent,
  DatePickerBaseComponent,
  DatePickerDisabledComponent,
  DatePickerDocComponent,
  DatePickerFooterComponent,
  DatePickerOpenComponent,
  FormItemsCommonDocComponent,
  InputBaseComponent,
  InputDocumentComponent,
  InputFormComponent,
  InputGroupBaseComponent,
  InputGroupDocComponent,
  InputSizeComponent,
  RangePickerBaseComponent,
  RangePickerDocComponent,
  RangePickerRangeComponent,
  SelectBaseComponent,
  SelectDocComponent,
  SelectSearchComponent,
  SelectTagsComponent,
  TextareaAutosizeComponentComponent,
  TextareaBaseComponent,
  TextareaDocComponent,
  TimePickerDocComponent,
  TimePickerBaseComponent,
  TimePickerFormComponent,
  TimePickerDisabledComponent,
  TimePickerDisabledTimeComponent
} from './components';
import { HighlightModule } from 'ngx-highlightjs';
import { DwAuthGuardService } from '@webdpt/framework/auth';
import { DwLanguageService } from '@webdpt/framework/language';

const ROUTES: Routes = [
  {
    path: '',
    component: DemoFormItemsComponent,
    canActivate: [DwAuthGuardService],
    data: {
      dwRouteData: {
        programId: 'dw-form-items',
        dwAuthId: 'dw-form-items'
      }
    },
    resolve: {
      transaction: DwLanguageService
    }
  }

];

const DEMO_COMPONENTS = [
  DemoFormItemsComponent,
  InputBaseComponent,
  InputFormComponent,
  InputSizeComponent,
  TextareaBaseComponent,
  TextareaAutosizeComponentComponent,
  InputGroupBaseComponent,
  SelectBaseComponent,
  SelectSearchComponent,
  SelectTagsComponent,
  DatePickerBaseComponent,
  DatePickerDisabledComponent,
  DatePickerOpenComponent,
  DatePickerFooterComponent,
  RangePickerBaseComponent,
  RangePickerRangeComponent,
  CascaderBaseComponent,
  CascaderLoadingComponent,
  FormItemsCommonDocComponent,
  InputDocumentComponent,
  CascaderDocComponent,
  DatePickerDocComponent,
  RangePickerDocComponent,
  SelectDocComponent,
  TextareaDocComponent,
  InputGroupDocComponent,
  TimePickerDocComponent,
  TimePickerBaseComponent,
  TimePickerFormComponent,
  TimePickerDisabledComponent,
  TimePickerDisabledTimeComponent
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(ROUTES),
    ShowcaseSharedModule,
    ColorSketchModule,
    HighlightModule.forRoot({ theme: 'agate' })
  ],
  declarations: [
    ...DEMO_COMPONENTS

  ],
  entryComponents: [
    ...DEMO_COMPONENTS
  ]
})
export class DemoFormItemsModule {}
