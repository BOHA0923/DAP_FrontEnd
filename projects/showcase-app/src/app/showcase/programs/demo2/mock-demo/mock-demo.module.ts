import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShowcaseMockDemoRoutingModule } from './mock-demo-routing.module';
import { ShowcaseHeroListComponent } from './hero-list/hero-list.component';
import { ShowcaseSharedModule } from '../../../shared/shared.module';


@NgModule({
  imports: [
    CommonModule,
    ShowcaseSharedModule,
    ShowcaseMockDemoRoutingModule
  ],
  declarations: [ShowcaseHeroListComponent]
})
export class ShowcaseMockDemoModule {
}
