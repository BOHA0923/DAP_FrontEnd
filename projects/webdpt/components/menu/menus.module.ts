import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DwSpinModule } from 'ng-quicksilver/spin';
import { DwMenuModule } from 'ng-quicksilver/menu';

import { DwRecursiveMenuComponent } from './recursive-menu/recursive-menu.component';
import { DwMenuDrawerComponent } from './menu-drawer/menu-drawer.component';
import { DwIconElementModule } from '@webdpt/components/icon-element';
import { DwProgramTitleModule } from '@webdpt/components/title';

@NgModule({
  imports: [
    CommonModule,
    DwSpinModule,
    DwMenuModule,
    DwIconElementModule,
    DwProgramTitleModule
  ],
  declarations: [
    DwRecursiveMenuComponent,
    DwMenuDrawerComponent
  ],
  exports: [
    DwRecursiveMenuComponent,
    DwMenuDrawerComponent
  ]
})

export class DwMenusModule {}
