import { NgModule, Provider, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { DwTabsModule } from 'ng-quicksilver/tabs';
import { DwIconModule } from 'ng-quicksilver/icon';
import { DwInputModule } from 'ng-quicksilver/input';
import { DwCardModule } from 'ng-quicksilver/card';
import { DwButtonModule } from 'ng-quicksilver/button';
import { DwRadioModule } from 'ng-quicksilver/radio';
import { DwFormModule } from 'ng-quicksilver/form';
import { DwGridModule } from 'ng-quicksilver/grid';
import { DwLayoutModule } from 'ng-quicksilver/layout';

import { DwHomeSettingRoutingModule } from './dw-home-setting-routing.module';
import { DwHomeSettingComponent } from './dw-home-setting.component';
import { DwHomeSettingListComponent } from './dw-home-setting-list/dw-home-setting-list.component';

// 排程任務記錄
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    ReactiveFormsModule,
    DwTabsModule,
    DwIconModule,
    DwInputModule,
    DwCardModule,
    DwButtonModule,
    DwFormModule,
    DwGridModule,
    DwRadioModule,
    DwLayoutModule,
    DwHomeSettingRoutingModule
  ],
  declarations: [
    DwHomeSettingComponent,
    DwHomeSettingListComponent
  ],
  exports: [
    DwHomeSettingRoutingModule,
    DwHomeSettingComponent,
    DwHomeSettingListComponent
  ]
})
export class DwHomeSettingModule {
  static forRoot(providers: Provider[]): ModuleWithProviders<DwHomeSettingModule> {
    return {
      ngModule: DwHomeSettingModule,
      providers: [
        ...providers
      ]
    };
  }
}
