import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DwMenuConfigService } from './service/menu-config.service';
import { DwMenuService } from './service/menu.service';
import { DwRecursiveMenuService } from './service/recursive-menu.service';
import { DwMenuLoadingMaskService } from './service/menu-loading-mask.service';
import { DwMenuAttributeService } from './service/menu-attribute.service';
import { DwMenuExecuteService } from './service/menu-execute.service';

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
    DwMenuConfigService,
    DwMenuService,
    DwRecursiveMenuService,
    DwMenuLoadingMaskService,
    DwMenuAttributeService,
    DwMenuExecuteService
  ]
})

export class DwMenusCoreModule {}
