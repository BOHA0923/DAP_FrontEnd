import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShowcaseSharedModule } from '../../../shared/shared.module';
import { AsisComponent } from './asis.component';
import { AsisListComponent } from './asis-list/asis-list.component';
import { AsisViewComponent } from './asis-view/asis-view.component';
import { AsisAddComponent } from './asis-add/asis-add.component';
import { AsisDetailEditComponent } from './asis-detail-edit/asis-detail-edit.component';
import { AsisDetailChildEditComponent } from './asis-detail-child-edit/asis-detail-child-edit.component';
import { SearchConditionModel } from './model';
import { AsisService } from './service/asis.service';
import { SaveService } from './service/save.service';
import { AsisRoutingModule } from './asis-routing.module';


const COMPONENTS = [
  AsisComponent,
  AsisViewComponent,
  AsisAddComponent,
  AsisListComponent,
  AsisDetailEditComponent,
  AsisDetailChildEditComponent
];

const PROVIDERS = [
  SearchConditionModel,
  AsisService,
  SaveService
];

@NgModule({
  imports: [
    CommonModule,
    AsisRoutingModule,
    ShowcaseSharedModule
  ],
  declarations: [
    ...COMPONENTS
  ],
  entryComponents: [
    AsisDetailEditComponent, AsisDetailChildEditComponent], // 對話框使用component模式，需要加入自定義component
  providers: [
    ...PROVIDERS
  ],
  exports: [
    ...COMPONENTS
  ]
})

export class AsisModule {}
