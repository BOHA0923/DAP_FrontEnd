import { Injectable, ErrorHandler, Injector } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';

import { DwAuthService } from '@webdpt/framework/auth';
import { DwHttpMessageService } from '@webdpt/framework/http';
import { DwCmcModule } from './cmc.module';


@Injectable({
  providedIn: DwCmcModule
})
export class DwCmcHttpErrorHandler {

  constructor(
    private route: Router,
    private injector: Injector,
    private dwMessageService: DwHttpMessageService,
    private translateService: TranslateService
  ) {

  }

  handlerError(error: HttpErrorResponse): void {
    const authService = this.injector.get(DwAuthService);

    this.dwMessageService.error(error.error.message).subscribe();
    if (error.status === 401) {
      // 缺少必要的token，無法繼續操作
      // UserToken逾時，建議更新UserToken或重新登入
      // this.route.navigate(['/login']);
      authService.logout();

    } else if (error.status === 406) {
      // UserToken異常，建議重新登入
      // this.route.navigate(['/login']);
      authService.logout();

    } else if (error.status === 500) {
      // 服務端系統錯誤，更多資訊請查詢系統記錄
      error.error['dwHttpErrorResponse'] = {
        // 'dw-http-server-ACM': '應用中間件'
        errorStatusMessage: this.translateService.instant('dw-http-server-ACM') + '：' + this.translateService.instant('dw-http-error-500')
      };
    } else if (error.status === 503) {
      // 外部連接服務異常，可能是無法連線到後端資料庫
      error.error['dwHttpErrorResponse'] = {
        // 'dw-http-server-ACM': '應用中間件'
        errorStatusMessage: this.translateService.instant('dw-http-server-ACM') + '：' + this.translateService.instant('dw-http-error-500')
      };
    }
  }
}
