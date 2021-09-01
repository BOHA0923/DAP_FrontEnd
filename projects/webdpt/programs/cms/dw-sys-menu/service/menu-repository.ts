import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { DwDapHttpClient } from '@webdpt/framework/dap';
import { DwHttpClientOptionsService } from '@webdpt/framework/http';

@Injectable()
export class DwSysMenuRepository {

  constructor(
    private http: DwDapHttpClient,
    private dwHttpClientOptionsService: DwHttpClientOptionsService
  ) { }

  /**
   * 讀取選單詳情
   */
  menuRead(ids: Array<string>): Observable<any> {
    const queryStringParam: object = {
      params: {
        ids: JSON.stringify(ids)
      }
    };

    return this.http.get('restful/service/DWSys/menu', queryStringParam);
  }

  /**
   * 讀取選單結構
   */
  tree(ids: Array<string>): Observable<any> {
    const queryStringParam: object = {
      params: {
        ids: JSON.stringify(ids)
      }
    };

    return this.http.get('restful/service/DWSys/menu/tree', queryStringParam);
  }

  /**
   * 按語言別獲取選單名稱
   *
   * [spinning=true] 是否顯示HTTP加載遮罩
   */
  language(language: string, spinning: boolean = true): Observable<any> {
    let queryStringParam: object = {
      params: {
        language: language
      }
    };

    if (!spinning) {
      queryStringParam = this.dwHttpClientOptionsService.setLoadMaskCfg(queryStringParam, false);
    }

    return this.http.get('restful/service/DWSys/menu/language', queryStringParam).pipe(
      map(
        (response: any) => {
          const sourceList: Array<any> = response.data.dw_menu_language;
          const langList = {};
          // 轉換成翻譯檔格式key,value
          sourceList.forEach(
            (item: any) => {
              if (item.name !== '') {
                langList[item.menu_id] = item.name;
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
    //       'data': {
    //         'dw_menu_language': [
    //           {
    //             'menu_id': 'dw-demo-cms',
    //             'name': '平台系統管理'
    //           },
    //           {
    //             'menu_id': 'showcase',
    //             'name': '範本'
    //           },
    //           {
    //             'menu_id': 'dw-demo1',
    //             'name': '作業範本'
    //           },
    //           {
    //             'menu_id': 'dw-demo2',
    //             'name': '功能範本'
    //           },
    //           {
    //             'menu_id': 'dw-doc',
    //             'name': '參考文件'
    //           },
    //           {
    //             'menu_id': 'dw-doc-typescript',
    //             'name': 'TypeScript官網'
    //           },
    //           {
    //             'menu_id': 'dw-doc-angular',
    //             'name': 'Angular官網'
    //           },
    //           {
    //             'menu_id': 'dw-doc-ng-quicksilver',
    //             'name': 'UI套件'
    //           }
    //         ]
    //       }
    //     };
    //     const arr = response.data.dw_menu_language;
    //     const langData = {};
    //     arr.forEach(
    //       item => {
    //         langData[item.menu_id] = item.name;
    //       }
    //     );
    //     observer.next(langData);
    //   }
    // );
  }
}
