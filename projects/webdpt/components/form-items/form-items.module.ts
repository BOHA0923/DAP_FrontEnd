import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { DwTranslatePipe } from './form-field/translation/dwTranslatePipe';

import { DwIconModule } from 'ng-quicksilver/icon';
import { DwFormModule } from 'ng-quicksilver/form';
import { DwInputModule } from 'ng-quicksilver/input';
import { DwSelectModule } from 'ng-quicksilver/select';
import { DwCascaderModule } from 'ng-quicksilver/cascader';
import { DwDatePickerModule } from 'ng-quicksilver/date-picker';
import { DwButtonModule } from 'ng-quicksilver/button';
import { DwTimePickerModule } from 'ng-quicksilver/time-picker';

import { DwFormInputComponent } from './input/form-input.component';
import { DwFormItemPanelComponent } from './form-item-panel';
import { DwFormTextareaComponent } from './input/form-textarea.component';
import { DwFormInputGroupComponent } from './input/form-input-group.component';
import { DwFormSelectComponent } from './select/form-select.component';
import { DwFormCascaderComponent } from './cascader/form-cascader.component';
import { DwFormDatePickerComponent } from './date-picker/form-date-picker.component';
import { DwFormRangePickerComponent } from './date-picker/form-range-picker.component';
import { DwFormTimePickerComponent } from './time-picker/form-time-picker.component';

const DW_COMPONENTS = [
  DwFormItemPanelComponent,
  DwFormInputComponent,
  DwFormTextareaComponent,
  DwFormInputGroupComponent,
  DwFormSelectComponent,
  DwFormCascaderComponent,
  DwFormDatePickerComponent,
  DwFormRangePickerComponent,
  DwFormTimePickerComponent,
  DwTranslatePipe
];

@NgModule({
  imports: [
    CommonModule,
    DwIconModule,
    DwFormModule,
    DwInputModule,
    DwSelectModule,
    DwCascaderModule,
    DwDatePickerModule,
    DwButtonModule,
    DwTimePickerModule,
    TranslateModule,
    FormsModule
  ],
  declarations: [
    ...DW_COMPONENTS
  ],
  exports: [
    ...DW_COMPONENTS
  ]
})
export class DwFormItemsModule { }
