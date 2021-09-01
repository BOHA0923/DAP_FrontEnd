import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShowcaseSharedModule } from '../../../shared/shared.module';
import { OrderComponent } from './order.component';
import { OrderListComponent } from './order-list/order-list.component';
import { OrderModifyComponent } from './order-modify/order-modify.component';
import { OrderDetailEditComponent } from './order-detail-edit/order-detail-edit.component';
import { CustomerListComponent } from './modals/customer.list/customer-list.component';
import { EmployeeListComponent } from './modals/employee.list/employee-list.component';
import { OrderSearchConditionModel } from './model';
import { OrderService } from './service/order.service';
import { OrderRoutingModule } from './order-routing.module';


const COMPONENTS = [
  OrderComponent,
  OrderModifyComponent,
  OrderListComponent,
  OrderDetailEditComponent,
  CustomerListComponent,
  EmployeeListComponent,
];

const PROVIDERS = [
  OrderSearchConditionModel,
  OrderService
];

@NgModule({
  imports: [
  CommonModule,
    OrderRoutingModule,
    ShowcaseSharedModule
  ],
  declarations: [
    ...COMPONENTS
  ],
  entryComponents: [
    OrderDetailEditComponent,
    CustomerListComponent,
    EmployeeListComponent], // 對話框使用component模式，需要加入自定義component
  providers: [
    ...PROVIDERS
  ],
  exports: [
    ...COMPONENTS
  ]
})
export class OrderModule {}
