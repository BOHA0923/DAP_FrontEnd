import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DwIframeGeneralComponent } from './general.component';
import { DwBaseIframeModule } from '../base-iframe/dw-base-iframe.module';


const COMPONENTS = [
  DwIframeGeneralComponent
];

@NgModule({
  imports: [
    CommonModule,
    DwBaseIframeModule
  ],
  declarations: [
    ...COMPONENTS
  ],
  exports: [
    ...COMPONENTS
  ]
})
export class DwIframeGeneralModule { }
