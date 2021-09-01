import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DwTenantModule } from '@webdpt/components/user/tenant';
import { TranslateModule } from '@ngx-translate/core';
import { DwForgetModule } from '@webdpt/components/user/forget-block';
import { DwAccountInfoModule } from '@webdpt/components/user/account';
import { DwPopoverModule } from 'ng-quicksilver/popover';
import { DwListModule } from 'ng-quicksilver/list';

import { DwUserPersonalizeComponent } from './user-personalize/user-personalize.component';

const COMPONENTS = [
  DwUserPersonalizeComponent
];

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    DwPopoverModule,
    DwListModule
  ],
  declarations: [
    ...COMPONENTS
  ],
  exports: [
    ...COMPONENTS,
    DwForgetModule,
    DwAccountInfoModule,
    DwTenantModule
  ]
})
export class DwUserUiModule {}
