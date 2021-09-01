import { NgModule } from '@angular/core';
import { DwJobTimeSettingComponent } from './job-time-setting.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DwRadioModule } from 'ng-quicksilver/radio';
import { DwFormModule } from 'ng-quicksilver/form';
import { DwTimePickerModule } from 'ng-quicksilver/time-picker';
import { DwSelectModule } from 'ng-quicksilver/select';
import { DwInputModule } from 'ng-quicksilver/input';
import { DwInputNumberModule } from 'ng-quicksilver/input-number';
import { DwCheckboxModule } from 'ng-quicksilver/checkbox';
import { DwDividerModule } from 'ng-quicksilver/divider';
import { DwGridModule } from 'ng-quicksilver/grid';
import { DwTableModule } from 'ng-quicksilver/table';
import { DwDatePickerModule } from 'ng-quicksilver/date-picker';

import { DwFormItemsModule } from '@webdpt/components/form-items';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DwFormItemsModule,
    TranslateModule,
    DwRadioModule,
    DwFormModule,
    DwTimePickerModule,
    DwSelectModule,
    DwInputModule,
    DwInputNumberModule,
    DwCheckboxModule,
    DwDividerModule,
    DwGridModule,
    DwTableModule,
    DwDatePickerModule,
  ],
  declarations: [
    DwJobTimeSettingComponent
  ],
  exports: [
    DwJobTimeSettingComponent
  ]
})
export class DwCronJobsModule {

}
