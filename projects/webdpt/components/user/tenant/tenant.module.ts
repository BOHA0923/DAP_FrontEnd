import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DwListModule } from 'ng-quicksilver/list';
import { DwPopoverModule } from 'ng-quicksilver/popover';

import { TranslateModule } from '@ngx-translate/core';

import { DwTenantBlockComponent } from './tenant-block/tenant-block.component';

const COMPONENTS = [
  DwTenantBlockComponent
];

@NgModule({
  imports: [
    CommonModule,
    DwListModule,
    DwPopoverModule,
    TranslateModule
  ],
  declarations: [
    ...COMPONENTS
  ],
  exports: [
    ...COMPONENTS
  ]
})
export class DwTenantModule {}
