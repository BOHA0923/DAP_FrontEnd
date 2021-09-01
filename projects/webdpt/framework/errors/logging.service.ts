import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { DwErrorHandlerCoreModule } from './error-handler-core.module';


@Injectable({
  providedIn: DwErrorHandlerCoreModule
})
export class DwLoggingService {
  constructor(
  ) {
  }


  /**
   * 一般
   *
   */
  log(msg: string): void {
    console.log(msg);
  }


  /**
   * 警告
   *
   */
  warn(msg: string): void {
    console.warn(msg);
  }


  /**
   * 錯誤
   *
   */
  error(msg: string): void {
    console.error(msg);
  }


  /**
   * 後端異常
   *
   */
  httpError(errorResponse: HttpErrorResponse): void {
    console.error(errorResponse);
  }


  /**
   * 前端執行期間異常
   *
   */
  runtimeError(error: any): void {
    console.error(error);
  }

}
