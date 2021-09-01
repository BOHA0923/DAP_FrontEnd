import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Demo2RoutingModule } from './demo2-routing.module';
import { ShowcaseSharedModule } from '../../shared/shared.module';


@NgModule({
  imports: [
    CommonModule,
    ShowcaseSharedModule,
    Demo2RoutingModule
  ],
  declarations: []
})
export class Demo2Module { }
