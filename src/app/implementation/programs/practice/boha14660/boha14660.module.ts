import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Boha14660RoutingModule } from './boha14660-routing.module';
import { Boha14660Component } from './boha14660.component';
import { BohaListComponent } from './boha-list/boha-list.component';


@NgModule({
  declarations: [Boha14660Component, BohaListComponent],
  imports: [
    CommonModule,
    Boha14660RoutingModule
  ]
})
export class Boha14660Module { }
