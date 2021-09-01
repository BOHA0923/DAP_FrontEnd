import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { DwTabsModule } from 'ng-quicksilver/tabs';
import { DwIconModule } from 'ng-quicksilver/icon';
import { DwBaseIframeModule } from '@webdpt/components/iframe';

import { DwIconElementModule } from '@webdpt/components/icon-element';
import { DwProgramTitleModule } from '@webdpt/components/title';
import { DwRoutingTabSetComponent } from './tabset.component';


@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    DwTabsModule,
    DwIconModule,
    FormsModule,
    DwIconElementModule,
    DwProgramTitleModule,
    ReactiveFormsModule,
    // DwAddOnModule,
    DwBaseIframeModule,
    TranslateModule
  ],
  declarations: [
    DwRoutingTabSetComponent
  ],
  exports: [
    DwRoutingTabSetComponent
  ]
})
export class DwRoutingTabSetModule {}
