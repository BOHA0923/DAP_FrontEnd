import { Injectable, Injector } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';

import { DwAuthService } from '@webdpt/framework/auth';
import { DwHttpMessageService } from '@webdpt/framework/http';
import { DwSystemConfigService } from '@webdpt/framework/config';
import { DwHttpModule } from '@webdpt/framework/http';


@Injectable({
  providedIn: DwHttpModule
})
export class DwDapHttpErrorHandler {
  public defaultLogin: string;
  constructor(private route: Router,
    private translate: TranslateService,
    private configService: DwSystemConfigService,
    private injector: Injector,
    private dwMessageService: DwHttpMessageService
  ) {
    this.configService.getConfig().subscribe(result => {
      this.defaultLogin = result.defaultLogin;
    });
  }

  handlerError(error: HttpErrorResponse): void {
    const msg = error.error;
    const authService = this.injector.get(DwAuthService);

    if (!msg) {
      return;
    }

    if (!msg.errorCode) {
      return;
    }


    switch (msg.errorCode) {
      case '10001':
      case '10002':
      case '10003':
      case '10901':
      case '10902':
      case '109000':
        // token 異常或失效
        // this.route.navigate(['/login']);
        if (msg.errorMessage) {
          this.dwMessageService.error(msg.errorMessage).subscribe();
        }
        authService.logout();
        break;
      case '10903':
        // IAM 驗證⾦鑰回應非 200
        this.dwMessageService.error(this.translate.instant('dw-dap-http-error-10903'));
        break;
      case '10904':
        // IAM 驗證⾦鑰回應 401 或 406
        this.dwMessageService.error(this.translate.instant('dw-dap-http-error-10904')).subscribe();
        authService.logout();
        break;
      case '10004':
        // 服務不允許匿名調用
        // this.route.navigate(['/login']);
        if (msg.errorMessage) {
          this.dwMessageService.error(msg.errorMessage).subscribe();
        }
        authService.logout();
        break;
      case '10801':
      case '10802':
      case '10803':
      case '10804':
        // CAC授權失敗


        const title = this.translate.instant('dw-http-error-cac-title');
        const detail = this.translate.instant('dw-http-error-cac-authorization-failure');
        // const logoutText =  this.translate.instant('dw-http-error-cac-title');

        this.dwMessageService.warning({
          dwTitle: title,
          dwContent: detail
        }).subscribe();
        // this.exception.showExceptionModal(title, descDetail);
        break;
      default:
        break;
    }

  }


}
