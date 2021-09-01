import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { TranslateService } from '@ngx-translate/core';

import { DwExceptionService } from './exception.service';
import { DwLoggingService } from '@webdpt/framework/errors';
import { DwExceptionModule } from './exception.module';


@Injectable({
  providedIn: DwExceptionModule
})
export class DwLoggingModalService extends DwLoggingService {
  constructor(
    private translateService: TranslateService,
    private dwExceptionService: DwExceptionService
  ) {
    super();
  }


  /**
   * 後端異常(攔截[狀態為0], 無法與主機連線)
   * 如果沒有實作 subscribe().error(), 會進入httpError()
   * 如果有實作 subscribe().error(), 必須在 subscribe().error() 裡 throw error, 才會進入httpError()
   *
   */
  httpError(errorResponse: HttpErrorResponse): void {
    console.error(errorResponse);
    // Bug #6748 調整連線處理異常的訊息.
    if (errorResponse.status === 0) {
      // 連線異常(無法與主機連線)
      const descDetail = [];
      // 請求網址
      let lable = this.translateService.instant('dw-request-url');
      descDetail.push(lable + '：' + errorResponse.url);
      // 請求內容
      lable = this.translateService.instant('dw-request-body');
      descDetail.push(lable + '：' + JSON.stringify(errorResponse.error));
      // 回應狀態
      lable = this.translateService.instant('dw-response-status');
      descDetail.push(lable + '：' + errorResponse.status + ' ' + errorResponse.statusText || 'Unknown Error');
      // 回應訊息
      lable = this.translateService.instant('dw-response-message');
      descDetail.push(lable + '：' + errorResponse.message);

      this.dwExceptionService.showMessage(errorResponse.status, descDetail);
    }
  }

}
