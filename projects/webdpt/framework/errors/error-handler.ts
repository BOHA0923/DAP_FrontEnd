import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { DwLoggingService } from './logging.service';
import { DwErrorHandlerCoreModule } from './error-handler-core.module';


@Injectable({
  providedIn: DwErrorHandlerCoreModule
})
export class DwErrorHandler extends ErrorHandler {

  constructor(private injector: Injector) {
    super();
  }

  handleError(error: any): void {
    const logging = this.injector.get(DwLoggingService);
    if (error instanceof HttpErrorResponse) {
      logging.httpError(error);
    } else {
      logging.runtimeError(error);
    }
  }
}
