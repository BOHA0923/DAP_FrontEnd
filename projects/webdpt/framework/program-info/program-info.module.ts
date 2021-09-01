import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DwDefaultAppModule } from './default-app/default-app.module';


@NgModule({
  imports: [
    CommonModule
  ],
  exports: [
    DwDefaultAppModule
  ]
})
export class DwProgramInfoModule { }
