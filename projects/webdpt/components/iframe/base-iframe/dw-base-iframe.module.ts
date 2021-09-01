import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DwBaseIframeComponent } from './dw-base-iframe.component';


@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    DwBaseIframeComponent,
  ],
  exports: [
    DwBaseIframeComponent
  ]
})
export class DwBaseIframeModule {}
