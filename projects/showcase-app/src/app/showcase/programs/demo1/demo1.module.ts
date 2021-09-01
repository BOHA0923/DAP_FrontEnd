import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShowcaseSharedModule } from '../../shared/shared.module';
import { Demo1RoutingModule } from './demo1-routing.module';
import { Demo1RepositoryModule } from './repository/demo1-repository.module';

@NgModule({
  imports: [
    CommonModule,
    ShowcaseSharedModule,
    Demo1RoutingModule,
    Demo1RepositoryModule
  ],
  declarations: []
})
export class Demo1Module { }
