import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { TranslateModule } from '@ngx-translate/core';
import { DwUploadModule } from 'ng-quicksilver/upload';
import { DwFormModule } from 'ng-quicksilver/form';
import { DwLayoutModule } from 'ng-quicksilver/layout';
import { DwInputModule } from 'ng-quicksilver/input';
import { DwSelectModule } from 'ng-quicksilver/select';
import { DwRadioModule } from 'ng-quicksilver/radio';
import { DwButtonModule } from 'ng-quicksilver/button';
import { DwGridModule } from 'ng-quicksilver/grid';
import { DwCheckboxModule } from 'ng-quicksilver/checkbox';

import { DwAccountInfoComponent } from './account-info.component';
import { DwFormItemsModule } from '@webdpt/components/form-items';


@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DwUploadModule,
    DwFormModule,
    DwLayoutModule,
    DwInputModule,
    DwSelectModule,
    DwRadioModule,
    DwButtonModule,
    DwGridModule,
    DwCheckboxModule,
    DwFormItemsModule,
    TranslateModule
  ],
  declarations: [
    DwAccountInfoComponent
  ],
  exports: [
    DwAccountInfoComponent
  ]
})

export class DwAccountInfoModule { }
