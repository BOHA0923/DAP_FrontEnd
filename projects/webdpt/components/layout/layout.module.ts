import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DwLayoutModule } from 'ng-quicksilver/layout';
import { DwIconModule } from 'ng-quicksilver/icon';
import { DwDrawerModule } from 'ng-quicksilver/drawer';
import { DwModalModule } from 'ng-quicksilver/modal';

import { RouterModule } from '@angular/router';

import { DwLayoutAppComponent } from './layout-app/layout-app.component';
import { DwLayoutBasicSideComponent } from './basic-side/basic-side.component';
import { DwLayoutTopSideComponent } from './layout-top-side/layout-top-side.component';
import { DwLayoutTopDrawerComponent } from './layout-top-drawer/layout-top-drawer.component';
import { DwLayoutDefaultComponent } from './layout-default/layout-default.component';
import { DwMenusModule } from '@webdpt/components/menu';
import { DwLanguageModule } from '@webdpt/components/language';
import { DwLoadingModule } from '@webdpt/components/loading';
import { DwTenantModule } from '@webdpt/components/user/tenant';
import { DwUserUiModule } from '@webdpt/components/user';
import { DwRoutingTabSetModule } from '@webdpt/components/routing-tabset';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    DwLayoutModule,
    DwIconModule,
    DwDrawerModule,
    DwModalModule,

    DwMenusModule,
    DwLanguageModule,
    DwRoutingTabSetModule,
    DwLoadingModule,
    DwTenantModule,
    DwUserUiModule
  ],
  declarations: [
    DwLayoutAppComponent,
    DwLayoutBasicSideComponent,
    DwLayoutTopSideComponent,
    DwLayoutTopDrawerComponent,
    DwLayoutDefaultComponent
  ],
  exports: [
    DwLayoutAppComponent,
    DwLayoutBasicSideComponent,
    DwLayoutTopSideComponent,
    DwLayoutTopDrawerComponent,
    DwLayoutDefaultComponent
  ]
})
export class DwMainLayoutModule {}
