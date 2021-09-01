import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Demo1OrderRepository } from './demo1-order-repository';
import { Demo1GroupRepository } from './demo1-group-repository';
import { Demo1AsisRepository } from './demo1-asis-repository';
import { Demo1EmployeeRepository } from './demo1-employee';
import { Demo1CustomerRepository } from './demo1-customer';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [],
  providers: [
    Demo1OrderRepository,
    Demo1GroupRepository,
    Demo1AsisRepository,
    Demo1EmployeeRepository,
    Demo1CustomerRepository
  ]
})
export class Demo1RepositoryModule { }
