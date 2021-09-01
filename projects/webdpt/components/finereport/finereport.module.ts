import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DwIframeFinereportComponent } from './finereport.component';
import { DwBaseIframeModule } from '@webdpt/components/iframe';

const COMPONENTS = [
  DwIframeFinereportComponent
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
export class DwFinereportModule { }
