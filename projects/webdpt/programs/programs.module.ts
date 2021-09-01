import { NgModule, Provider, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FrameworkUIModule } from '@webdpt/components';

import { DwCmsModule } from './cms/cms.module';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [],
  exports: [
    DwCmsModule
  ]
})
export class DwProgramsModule {}
