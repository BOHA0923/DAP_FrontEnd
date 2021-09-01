import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShowcaseSharedModule } from '../shared/shared.module';
import { ShowcaseHomeRoutingModule } from './home-routing.module';
import { ShowcaseHomeComponent } from './home.component';
import { DwAnnouncementModule } from '@webdpt/components/announcement';


@NgModule({
  imports: [
    CommonModule,
    ShowcaseSharedModule,
    ShowcaseHomeRoutingModule,
    DwAnnouncementModule
  ],
  declarations: [ShowcaseHomeComponent],
  exports: [RouterModule]
})
export class ShowcaseHomeModule { }
