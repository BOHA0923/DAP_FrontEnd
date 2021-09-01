import { NgModule, Provider, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DwLanguageModule } from '@webdpt/components/language';
import { DwFormItemsModule } from '@webdpt/components/form-items';
import { DwFormModule } from 'ng-quicksilver/form';
import { DwGridModule } from 'ng-quicksilver/grid';
import { DwRadioModule } from 'ng-quicksilver/radio';
import { DwSelectModule } from 'ng-quicksilver/select';
import { DwInputModule } from 'ng-quicksilver/input';
import { DwIconModule } from 'ng-quicksilver/icon';
import { DwCheckboxModule } from 'ng-quicksilver/checkbox';
import { DwCardModule } from 'ng-quicksilver/card';
import { DwTreeModule, DwTreeService } from 'ng-quicksilver/tree';
import { DwLayoutModule } from 'ng-quicksilver/layout';
import { DwDividerModule } from 'ng-quicksilver/divider';
import { DwButtonModule } from 'ng-quicksilver/button';

import { DwMenuService } from '@webdpt/components/menu';
import { DwIconElementModule } from '@webdpt/components/icon-element';
import { DwSysMenuRoutingModule } from './dw-sys-menu-routing.module';
import { DwSysMenuComponent } from './dw-sys-menu.component';
import { DwSysMenuListComponent } from './dw-sys-menu-list/dw-sys-menu-list.component';
import { DwSysMenuIconComponent } from './modals/dw-sys-menu-icon/dw-sys-menu-icon.component';
import { DwSysMenuIconService } from './service/menu-icon.service';
import { DwSysMenuTreeUiService } from './service/tree-ui.service';
import { DwSysMenuCreateService } from './service/create.service';
import { DwSysMenuRepository } from './service/menu-repository';
import { DwSysMenuEditComponent } from './modals/dw-sys-menu-edit/dw-sys-menu-edit.component';
import { DwSysMenuEditNameComponent } from './modals/dw-sys-menu-edit-name/dw-sys-menu-edit-name.component';
import { DwCmsMenuService } from './service/cms-menu.service';
import { DwCmsMenuLangLoaderService } from './service/cms-menu-lang-loader.service';
import { DwCmsMenuConfigService } from './service/cms-menu-config.service';
import { DwLanguageCoreModule } from '@webdpt/components/core';

// 系統選單設定
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DwLanguageModule,
    DwIconElementModule,
    DwGridModule,
    DwRadioModule,
    DwSelectModule,
    DwFormItemsModule,
    DwFormModule,
    DwInputModule,
    DwIconModule,
    DwCheckboxModule,
    DwCardModule,
    DwTreeModule,
    DwLayoutModule,
    DwDividerModule,
    DwButtonModule,
    DwSysMenuRoutingModule,
    DwLanguageCoreModule
  ],
  declarations: [
    DwSysMenuComponent,
    DwSysMenuListComponent,
    DwSysMenuIconComponent,
    DwSysMenuEditComponent,
    DwSysMenuEditNameComponent
  ],
  entryComponents: [ // 對話框使用component模式，需要加入自定義component
    DwSysMenuIconComponent,
    DwSysMenuEditComponent,
    DwSysMenuEditNameComponent
  ],
  exports: [
    DwSysMenuRoutingModule,
    DwSysMenuComponent,
    DwSysMenuListComponent,
    DwSysMenuIconComponent,
    DwSysMenuEditComponent,
    DwSysMenuEditNameComponent
  ],
  providers: [
    DwTreeService,
    DwSysMenuTreeUiService,
    DwSysMenuRepository,
    DwSysMenuCreateService,
    DwSysMenuIconService,
    DwCmsMenuConfigService,
    DwCmsMenuService,
    {
      provide: DwMenuService,
      useExisting: DwCmsMenuService
    },
    DwCmsMenuLangLoaderService,
  ]
})
export class DwSysMenuModule {}
