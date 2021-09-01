import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DwHttpModule } from '@webdpt/framework/http';


@NgModule({
  imports: [
    CommonModule
  ],
  exports: [
    DwHttpModule
  ]
})
export class DwOmModule { }
