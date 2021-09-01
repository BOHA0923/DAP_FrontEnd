import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { DwHttpModule } from './http.module';


@Injectable({
  providedIn: DwHttpModule
})
export class DwSystemHttpErrorHandler {

  handlerError(error: HttpErrorResponse): void {}
}
