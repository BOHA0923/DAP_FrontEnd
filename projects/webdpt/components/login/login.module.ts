import { NgModule } from '@angular/core';
import { DwLoginBlockComponent } from './login-block/login-block.component';
import { CommonModule } from '@angular/common';
import { DwSelectModule } from 'ng-quicksilver/select';
import { DwFormModule } from 'ng-quicksilver/form';
import { DwInputModule } from 'ng-quicksilver/input';
import { DwCheckboxModule } from 'ng-quicksilver/checkbox';
import { DwListModule } from 'ng-quicksilver/list';
import { DwButtonModule } from 'ng-quicksilver/button';
import { DwGridModule } from 'ng-quicksilver/grid';
import { DwIconModule } from 'ng-quicksilver/icon';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DwLanguageModule } from '@webdpt/components/language';
import { DwLoginBlockModalModule } from './login-block-modal/login-block-modal.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DwSelectModule,
    DwFormModule,
    DwInputModule,
    DwListModule,
    DwButtonModule,
    DwGridModule,
    DwCheckboxModule,
    DwIconModule,
    DwLanguageModule,
    DwLoginBlockModalModule
  ],
  declarations: [DwLoginBlockComponent],
  exports: [DwLoginBlockComponent],
  providers: []
})
export class DwLoginModule {}
