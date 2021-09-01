import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DwIconModule } from 'ng-quicksilver/icon';

import { DwIconElementComponent } from './icon-element.component';

const DW_COMPONENTS = [
  DwIconElementComponent
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    DwIconModule
  ],
  declarations: [
    ...DW_COMPONENTS
  ],
  exports: [
    ...DW_COMPONENTS
  ]
})
export class DwIconElementModule { }
