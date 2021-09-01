import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { DwFormModule } from 'ng-quicksilver/form';
import { DwSelectModule } from 'ng-quicksilver/select';
import { DwInputModule } from 'ng-quicksilver/input';
import { DwButtonModule } from 'ng-quicksilver/button';
import { DwIconModule } from 'ng-quicksilver/icon';
import { TranslateModule } from '@ngx-translate/core';

import { DwForgetBlockComponent } from './forget-block.component';


@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DwFormModule,
    DwSelectModule,
    DwInputModule,
    DwButtonModule,
    DwIconModule,
    TranslateModule
  ],
  declarations: [
    DwForgetBlockComponent
  ],
  exports: [
    DwForgetBlockComponent
  ],
  providers: [
  ]
})

export class DwForgetModule { }
