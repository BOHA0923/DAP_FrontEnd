import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { DW_PROGRAM_JSON } from '@webdpt/framework/config';
import { DwDapHttpClient } from './dap-http-client';
import { IDwDefaultAppInfo } from '@webdpt/framework/program-info';
import { IDwOperationParamData, IDwProgramData } from '@webdpt/framework/operation';
import { DwDefaultAppRepository } from '@webdpt/framework/program-info';

/**
 * 首頁路由儲存庫
 */
@Injectable()
export class DwDapDefaultAppRepository extends DwDefaultAppRepository {
  constructor(
    @Inject(DW_PROGRAM_JSON) private dwProgramJson: Array<any>, // 作業清單靜態設定檔
    private http: DwDapHttpClient
  ) {
    super();
  }

  /**
   * 取得首頁設定
   *
   * @param level 首頁層級,'common':共用, 'user':用戶自身, '':用戶使用的自定義首頁
   */
  public getMyHomeInfo(level: string): Observable<IDwDefaultAppInfo> {
    const enable = this.repositoryEnable();

    if (enable) {
      const param = {
        params: {
          level: level
        }
      };

      return this.http.post('restful/service/DWSys/IMyHomeService/get', param).pipe(
        map(
          (response: any) => {
            const defaultAppInfo: IDwDefaultAppInfo = this.createInfo();

            const myhome: Array<any> = response.data.dw_myhome;
            const myhome_parameter: Array<IDwOperationParamData> = response.data.dw_myhome_parameter || [];

            // 若是預設，回傳的資料則是空資料
            if (response.success) {
              defaultAppInfo.execType = '';
            }

            myhome.forEach(
              master => {
                defaultAppInfo.execType = master.type;
                defaultAppInfo.programId = master.path;

                if (defaultAppInfo.execType === 'externalUrl') {
                  defaultAppInfo.programId = 'dw-home';
                  defaultAppInfo.queryParams['url'] = master.path;
                }
              }
            );

            myhome_parameter.forEach(
              (paramItem: IDwOperationParamData) => {
                defaultAppInfo.queryParams[paramItem.name] = paramItem.value;
              }
            );

            return defaultAppInfo;
          }
        )
      );
    } else {
      return this.getMyHomeInfoNull();
    }
  }

  /**
   * 是否啟用首頁設定
   */
  private repositoryEnable(): boolean {
    let enable = false;

    // 應用作業
    let programData: Array<IDwProgramData> = JSON.parse(JSON.stringify(this.dwProgramJson));
    if (!Array.isArray(programData)) {
      programData = [];
    }

    const len = programData.length;
    for (let i = 0; i < len; i++) {
      if (programData[i].id === 'dw-home-setting') {
        enable = true;
        break;
      }
    }

    return enable;
  }
}
