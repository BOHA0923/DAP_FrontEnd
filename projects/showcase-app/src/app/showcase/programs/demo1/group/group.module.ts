import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShowcaseSharedModule } from '../../../shared/shared.module';
import { GroupComponent } from './group.component';
import { GroupListComponent } from './group-list/group-list.component';
import { GroupViewComponent } from './group-view/group-view.component';
import { GroupAddComponent } from './group-add/group-add.component';
import { GroupDetailEditComponent } from './group-detail-edit/group-detail-edit.component';
import { CustomerListComponent } from './modals/customer.list/customer-list.component';
import { EmployeeListComponent } from './modals/employee.list/employee-list.component';
import { SearchConditionModel } from './model';
import { GroupService } from './service/group.service';
import { SaveService } from './service/save.service';
import { GroupRoutingModule } from './group-routing.module';


const COMPONENTS = [
  GroupComponent,
  GroupViewComponent,
  GroupAddComponent,
  GroupListComponent,
  GroupDetailEditComponent,
  CustomerListComponent,
  EmployeeListComponent
];

const PROVIDERS = [
  SearchConditionModel,
  GroupService,
  SaveService

];

@NgModule({
  imports: [
  CommonModule,
    GroupRoutingModule,
    ShowcaseSharedModule
  ],
  declarations: [
    ...COMPONENTS
  ],
  entryComponents: [
    GroupDetailEditComponent,
    CustomerListComponent,
    EmployeeListComponent], // 對話框使用component模式，需要加入自定義component
  providers: [
    ...PROVIDERS
  ],
  exports: [
    ...COMPONENTS
  ]
})

export class GroupModule {}
