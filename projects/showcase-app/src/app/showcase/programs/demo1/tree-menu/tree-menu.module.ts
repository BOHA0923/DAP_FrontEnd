import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TreeMenuRoutingModule } from './tree-menu-routing.module';
import { TreeMenuComponent } from './tree-menu.component';
import { ListComponent } from './list/list.component';
import { DetailEditComponent } from './detail-edit/detail-edit.component';
import { TreeMenuService } from './service/tree-menu.service';
import { ShowcaseSharedModule } from '../../../shared/shared.module';

const ENTRYCOMPONENTS = [
  DetailEditComponent
];

const COMPONENTS = [
  TreeMenuComponent,
  ListComponent,
  DetailEditComponent
];

const PROVIDERS = [
  TreeMenuService
];

@NgModule({
  imports: [
    CommonModule,
    TreeMenuRoutingModule,
    ShowcaseSharedModule
  ],
  entryComponents: [ // 對話框使用component模式，需要加入自定義component,
    ...ENTRYCOMPONENTS
  ],
  declarations: [
    ...COMPONENTS
  ],
  providers: [
    ...PROVIDERS
  ]
})
export class TreeMenuModule { }
