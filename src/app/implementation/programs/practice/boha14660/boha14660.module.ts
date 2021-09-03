import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FrameworkUIModule } from '@webdpt/components';
import { SharedModule } from 'app/implementation/shared/shared.module';
import { PracticeFunctionModule } from '../function';
import { Boha14660RoutingModule } from './boha14660-routing.module';
import { Boha14660Component } from './boha14660.component';
import { BohaListComponent } from './boha-list/boha-list.component';
import { BohaEditComponent } from './boha-edit/boha-edit.component';
import { Boha14660Service } from './service/boha14660.service';
import { PracticeBoha14660Repository} from '../repository/practice-boha14660-repository';
const COMPONENTS = [
  Boha14660Component,
  BohaListComponent,
  BohaEditComponent
];

const PROVIDERS = [
  Boha14660Service,
  PracticeBoha14660Repository];

@NgModule({
  declarations: [...COMPONENTS],
  imports: [
    CommonModule,
    SharedModule,
    PracticeFunctionModule,
    Boha14660RoutingModule,
    FrameworkUIModule
  ],
  providers: [
    ...PROVIDERS
  ]
})
export class Boha14660Module { }
