import { NgModule, ErrorHandler } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DwErrorHandler } from './error-handler';
import { DwErrorHandlerCoreModule } from './error-handler-core.module';


@NgModule({
  imports: [
    CommonModule
  ],
  exports: [
    DwErrorHandlerCoreModule
  ],
  providers: [
    {
      provide: ErrorHandler,
      useExisting: DwErrorHandler
    }
  ]
})
export class DwErrorHandlerModule { }
