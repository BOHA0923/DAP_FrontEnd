import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { DwDapDefaultAppRepository } from './dap-default-app-repository';
import { DwDefaultAppRepository } from '@webdpt/framework/program-info';


@NgModule({
  imports: [
    CommonModule,
    TranslateModule
  ],
  // declarations: [
  //   DwMenuItemNameComponent,
  //   DwRecursiveMenuItemComponent,
  //   DwRecursiveMenuComponent
  // ],
  // exports: [
  //   DwMenuItemNameComponent,
  //   DwRecursiveMenuItemComponent,
  //   DwRecursiveMenuComponent
  // ],
  providers: [
    DwDapDefaultAppRepository,
    {
      provide: DwDefaultAppRepository,
      useExisting: DwDapDefaultAppRepository
    }
  ]
})
export class DwDapDefaultAppModule { }
