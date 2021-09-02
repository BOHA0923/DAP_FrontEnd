import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PracticeRoutingModule } from './practice-routing.module';
// 引入repository
import { PracticeRepositoryModule } from './repository/practice-repository.module';
// 引入function
import { PracticeFunctionModule } from './function/practice-function.module';
import { DwDocument, DwDocumentModule } from '@webdpt/framework';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    PracticeRoutingModule,
    PracticeRepositoryModule,
    PracticeFunctionModule,
    DwDocumentModule
  ],
  providers: [
    DwDocument
  ]
})

export class PracticeModule { }
