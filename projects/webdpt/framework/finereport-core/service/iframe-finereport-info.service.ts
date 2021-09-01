import { Injectable, Inject } from '@angular/core';
import { Params } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap, first, map } from 'rxjs/operators';

import { IDwIframeFinereportInfoService } from '../interface/finereport-service.interface';
import { DW_USING_TAB, DW_APP_ID } from '@webdpt/framework/config';
import { IDwIframe } from '@webdpt/framework/iframe-core';
import { DwFinereportRepository } from '../repository/finereport-repository';
import { DwIframeFinereportService } from './iframe-finereport.service';
import { DwSystemConfigService } from '@webdpt/framework/config';
import { DwLanguageService } from '@webdpt/framework/language';
import { DwUserService } from '@webdpt/framework/user';
import { DwFinereportCoreModule } from '../finereport-core.module';

@Injectable({
  providedIn: DwFinereportCoreModule
})
export class DwIframeFinereportInfoService implements IDwIframeFinereportInfoService {
  private frUrl: string;

  constructor(
    private sysReportRepository: DwFinereportRepository,
    private dwLanguageService: DwLanguageService,
    private dwIframeFinereportService: DwIframeFinereportService,
    @Inject(DW_APP_ID) private dwAppId: string,
    @Inject(DW_USING_TAB) public usingTab: boolean,
    private configService: DwSystemConfigService,
    private userService: DwUserService,
  ) {
    this.configService.get('frUrl').subscribe(
      url => this.frUrl = url
    );
  }

  /**
   * 啟動報表資訊
   *
   * @param programId 報表編號
   * @param [queryParams] 報表變動參數
   */
  public finereportInfo(programId: string, queryParams: Params): Observable<IDwIframe> {
    const rpParams = {};

    Object.keys(queryParams).forEach(
      (key: string) => {
        if (key !== 'dwMenuId') {
          rpParams[key] = queryParams[key];
        }
      }
    );

    const item: IDwIframe = {
      url: '',
      type: 'fineReport'
    };

    let code = programId; // 原始作業或報表編號
    const langCode: string = this.dwLanguageService.currentLanguage;

    // 報表參數 = 報表固定參數 + 報表變動參數 + 帆軟報表數位簽章
    // 最後交給dwIframeFinereportService主導最終報表網址資訊
    return this.sysReportRepository.getReport(programId).pipe(
      map(
        (reportData: any) => {
          const paramQry: Object = {}; // 帆軟報表的 url 的參數.
          const reportInfo = reportData.data;

          // 報表變動參數(避免覆蓋固定參數，所以要在固定參數之前設值)
          Object.keys(rpParams).forEach(
            paramKey => {
              paramQry[paramKey] = rpParams[paramKey];
            }
          );

          if (reportInfo) {
            const from = reportInfo.from ? reportInfo.from : '';
            const dwAppId = this.dwAppId;
            const name = reportInfo.name ? reportInfo.name : '';
            const fixparam = reportInfo.fixparam ? reportInfo.fixparam : [];

            // http://IP:Port/站台名稱(digiwin)/子站名稱(kanban)?viewlet=標準(客製)/appId產品代號/語系/主頁名稱
            paramQry['viewlet'] = from + '/' + dwAppId + '/' + langCode + '/' + name;

            // 帆軟報表數位簽章需代入[原始作業或報表編號].
            code = reportInfo.code;

            // 固定參數
            fixparam.forEach(
              paramItem => {
                paramQry[paramItem.name] = paramItem.value;
              }
            );
          }

          paramQry['token'] = this.userService.getUser('token');

          return paramQry;
        }
      ),
      switchMap(
        (paramQry: any) => {
          item.url = this.frUrl + '/digiwin/kanban/view/form'; // 帆軟報表網址
          let i = 0;
          Object.keys(paramQry).forEach(
            paramKey => {
              let symbol = '&';
              if (i === 0) {
                symbol = '?';
              }

              let newValue = paramQry[paramKey].toString();
              newValue = newValue.replace('{{lang_code}}', langCode); // 替換使用語系.
              // newValue = newValue.replace('{{user_Name}}', ''); // 替換使用者帳號(保留).
              // newValue = newValue.replace('{{user_token}}', ''); // 替換 token(保留).

              item.url = item.url + symbol + paramKey + '=' + newValue;
              i = i + 1;
            }
          );

          return this.dwIframeFinereportService.getIframeFinereportData(programId, queryParams, item);
        }
      ),
      first()
    );
  }
}
