import { Injectable, Inject } from '@angular/core';
import { Params } from '@angular/router';

import { Observable, combineLatest } from 'rxjs';
import { first, switchMap } from 'rxjs/operators';

import { DwUserService } from '@webdpt/framework/user';
import { SsoUtility } from '@webdpt/framework/iam';
import { IDwIframeGeneralInfoService } from './interface/dw-iframe-service.interface';
import { IDwIframe } from './interface/dw-iframe.interface';
import { DwIframeGeneralService } from './iframe-general.service';
import { DwOperationInfoService } from '@webdpt/framework/operation';
import { IDwProgram } from '@webdpt/framework/operation';
import { DwSystemConfigService } from '@webdpt/framework/config';
import { DW_APP_ID, DW_APP_AUTH_TOKEN } from '@webdpt/framework/config';
import { DwLanguageService } from '@webdpt/framework/language';
import { DwIframeCoreModule } from './iframe-core.module';


@Injectable({
  providedIn: DwIframeCoreModule
})
export class DwIframeGeneralInfoService implements IDwIframeGeneralInfoService {
  constructor(
    private dwIframeGeneralService: DwIframeGeneralService,
    private dwOperationInfoService: DwOperationInfoService,
    private configService: DwSystemConfigService,
    private userService: DwUserService,
    private dwLanguageService: DwLanguageService,
    @Inject(DW_APP_ID) private dwAppId: string,
    @Inject(DW_APP_AUTH_TOKEN) private dwAppAuthToken: string
  ) {
  }
  public generalInfo(programId: string, queryParams: Params): Observable<IDwIframe> {
    const item: IDwIframe = {
      url: '',
      type: 'externalUrl'
    };

    const url = queryParams['url'];

    // 一般內嵌網頁
    if (url) {
      item.url = url;

      // 最後交給dwIframeGeneralService主導最終報表網址資訊
      return this.dwIframeGeneralService.getIframeGeneralData(programId, queryParams, item).pipe(
        first()
      );
    } else {
      // 內嵌業務中台應用作業
      return combineLatest(
        this.dwOperationInfoService.operationInfo$(programId),
        this.configService.getConfig(),
        (operationInfo: IDwProgram, systemConfig: any) => {
          let ssoUrl = '';

          if (operationInfo.hasOwnProperty('urlConfig')) {
            ssoUrl = systemConfig[operationInfo.urlConfig];
          }

          return ssoUrl;
        }
      ).pipe(
        switchMap(
          (ssoUrl: string) => {
            if (ssoUrl) {
              const otherParams = {
                dwAppId: this.dwAppId,
                dwAppToken: this.dwAppAuthToken,
                dwProgramId: programId,
                dwLang: this.dwLanguageService.currentLanguage
              };

              item.url = SsoUtility.getSsoUrl(ssoUrl, this.userService.getUser('token'), otherParams);
            }

            // 最後交給dwIframeGeneralService主導最終報表網址資訊
            return this.dwIframeGeneralService.getIframeGeneralData(programId, queryParams, item).pipe(
              first()
            );
          }
        )
      );
    }
  }
}
