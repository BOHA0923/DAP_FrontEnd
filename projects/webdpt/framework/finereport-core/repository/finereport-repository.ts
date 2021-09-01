import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { DwDapHttpClient } from '@webdpt/framework/dap';
import { DwFinereportConfigService } from '../service/finereport-config.service';
import { DwFinereportCoreModule } from '../finereport-core.module';

@Injectable({
  providedIn: DwFinereportCoreModule
})
export class DwFinereportRepository {
  constructor(
    private http: DwDapHttpClient,
    private dwFinereportConfigService: DwFinereportConfigService
  ) {
  }

  public getReport(code: string): Observable<any> {
    if (this.dwFinereportConfigService.frEnable()) { // 帆軟報表是否啟用
      // queryStringParam為object, 傳遞時 http.get 會自動編碼1次, 所以 code 的值不需要再編碼.
      const queryStringParam: object = {
        params: {
          // product: encodeURIComponent(this.dwProduct),
          // code: encodeURIComponent(code)
          code: code
        }
      };

      return this.http.get('restful/service/DWSys/report', queryStringParam);

      // return Observable.create(
      //   observer => {
      //     const response = {
      //       'message': null,
      //       'success': true,
      //       'data': {
      //         'code': 's-Demo-equipment-frm',
      //         'languages': [
      //           {
      //             'name': '設備面版',
      //             'language': 'zh_TW'
      //           },
      //           {
      //             'name': '',
      //             'language': 'en_US'
      //           },
      //           {
      //             'name': '设备面版',
      //             'language': 'zh_CN'
      //           }
      //         ],
      //         'parameter': [
      //           {
      //             'name': 'actrulData',
      //             'value': 86.5
      //           },
      //           {
      //             'name': 'lastMachineKeep',
      //             'value': 5
      //           },
      //           {
      //             'name': 'machineOutKeep',
      //             'value': 2
      //           }
      //         ],
      //         'name': 'equipment.frm',
      //         'from': 'Standard',
      //         'fixparam': [
      //           {
      //             'name': 'goal',
      //             'value': 85
      //           },
      //           {
      //             'name': 'actrulData',
      //             'value': 18
      //           }
      //         ],
      //         'type': 'formlet'
      //       }
      //     };

      //     observer.next(response);
      //   }
      // );
    } else {
      const response = {
        success: true,
        data: null
      };

      return of(response);
    }
  }

  /**
   * 按語言別獲取報表名稱
   */
  public language(language: string): Observable<any> {
    if (this.dwFinereportConfigService.frEnable()) { // 帆軟報表是否啟用
      const queryStringParam: object = {
        params: {
          // product: this.dwProduct,
          language: language
        }
      };

      return this.http.get('restful/service/DWSys/report/list/language', queryStringParam).pipe(
        map(
          (response: any) => {
            const sourceList: Array<any> = response.data;
            const langList = {};
            // 轉換成翻譯檔格式key,value
            sourceList.forEach(
              (item: any) => {
                if (item.name !== '') {
                  langList[item.code] = item.name;
                }
              }
            );

            return langList;
          }
        )
      );

      // return Observable.create(
      //   observer => {
      //     const response = {
      //       'data': [
      //         {
      //           'code': 's-Demo-Main-frm',
      //           'name': '机加工行业车间战情室'
      //         },
      //         {
      //           'code': 's-Demo-EFF-demoeffk01-frm',
      //           'name': '状态占有率分布'
      //         },
      //         {
      //           'code': 's-Demo-EFF-demoeffk02-frm',
      //           'name': '能耗'
      //         },
      //         {
      //           'code': 's-Demo-EFF-demoeffk03-frm',
      //           'name': '设备即时状态与稼动率'
      //         },
      //         {
      //           'code': 's-Demo-EFF-demoeffk04-frm',
      //           'name': '设备运行参数'
      //         },
      //         {
      //           'code': 's-Demo-PRS-demoprsk01-frm',
      //           'name': '本月实际产量'
      //         },
      //         {
      //           'code': 's-Demo-PRS-demoprsk02-frm',
      //           'name': '生产进度'
      //         },
      //         {
      //           'code': 's-Demo-PRS-demoprsk03-frm',
      //           'name': '交期达成率'
      //         },
      //         {
      //           'code': 's-Demo-PRS-demoprsk04-frm',
      //           'name': '每日產量與達成率'
      //         },
      //         {
      //           'code': 's-Demo-QTY-demoqtyk01-frm',
      //           'name': '不良原因分析'
      //         },
      //         {
      //           'code': 's-Demo-QTY-demoqtyk02-frm',
      //           'name': '生产直通率'
      //         },
      //         {
      //           'code': 's-Demo-QTY-demoqtyk03-frm',
      //           'name': '报警信息'
      //         },
      //         {
      //           'code': 's-Demo-QTY-demoqtyk04-frm',
      //           'name': '制程不良率'
      //         },
      //         {
      //           'code': 's-Demo-QTY-demoqtyk05-frm',
      //           'name': '历史报警分析'
      //         },
      //         {
      //           'code': 's-Demo-equipment-frm',
      //           'name': '设备面版'
      //         }
      //       ]
      //     };

      //     const arr = response.data;
      //     const langData = {};
      //     arr.forEach(
      //       item => {
      //         langData[item.code] = item.name;
      //       }
      //     );
      //     observer.next(langData);
      //   }
      // );
    } else {
      const langList = {};
      return of(langList);
    }
  }
}
