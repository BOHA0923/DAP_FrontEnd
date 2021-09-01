import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { DwToolTipModule } from 'ng-quicksilver/tooltip';

import { DwProgramTitleComponent } from './program-title.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    DwToolTipModule
  ],
  declarations: [
    DwProgramTitleComponent
  ],
  exports: [
    DwProgramTitleComponent
  ]
})
export class DwProgramTitleModule { }
