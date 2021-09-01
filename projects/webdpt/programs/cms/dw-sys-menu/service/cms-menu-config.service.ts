import { Injectable, isDevMode } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged, filter } from 'rxjs/operators';

import { DwTenantService } from '@webdpt/framework/user';
import { DwDapHttpClient } from '@webdpt/framework/dap';
import { DwFinereportLangLoaderService } from '@webdpt/framework/finereport-core';
import { IDwOperationParamData } from '@webdpt/framework/operation';
import { DwHttpClientOptionsService } from '@webdpt/framework/http';
import { DwMenuAttributeService, DwMenuLoadingMaskService } from '@webdpt/components/menu';
import { IDwMenu, IDwMenuConfigMap, IDwMenuService } from '@webdpt/components/menu';
import { dwMenuDataDev } from '@webdpt/framework/config';
import { DwCmsMenuLangLoaderService } from './cms-menu-lang-loader.service';

/**
 * 取使用者選單，用於呈現
 */
@Injectable()
export class DwCmsMenuConfigService implements IDwMenuService {
  private menu$: BehaviorSubject<IDwMenu[]>; // 選單資料
  private menuConfigMap$: BehaviorSubject<any>; // 選單設定對應表
  private menuList: IDwMenu[];
  private menuConfigMapList: IDwMenuConfigMap;
  private _dwMenuDataDev = JSON.parse(JSON.stringify(dwMenuDataDev));

  constructor(
    private dwReportLangLoaderService: DwFinereportLangLoaderService, // 初始化報表名稱翻譯檔載入器
    private dwMenuLangLoaderService: DwCmsMenuLangLoaderService, // 初始化選單翻譯檔載入器
    private dwMenuAttributeService: DwMenuAttributeService,
    private http: DwDapHttpClient,
    private dwHttpClientOptionsService: DwHttpClientOptionsService,
    private dwMenuLoadingMaskService: DwMenuLoadingMaskService,
    private dwTenantService: DwTenantService,
  ) {
  }

  public init(): void {
    this.menuList = null;
    this.menuConfigMapList = null;
    this.menu$ = new BehaviorSubject<IDwMenu[]>(this.menuList);
    this.menuConfigMap$ = new BehaviorSubject<any>(this.menuConfigMapList);
    let isInit = false;

    this.dwTenantService.isTokenValid$.subscribe(
      value => {
        if (!value) {
          isInit = false;
          this.menuList = [];
          this.menuConfigMapList = <IDwMenuConfigMap>null;
          this.menu$.next(this.menuList);
          this.menuConfigMap$.next(this.menuConfigMapList);
        } else if (!isInit) {
          isInit = true;
          this.menuList = [];
          this.menuConfigMapList = <IDwMenuConfigMap>{};
          const loadingMaskId = this.dwMenuLoadingMaskService.auto(null);

          let options = {};
          options = this.dwHttpClientOptionsService.setLoadMaskCfg(options, false);

          this.menuAuthority(options).subscribe(
            (response: any) => {
              let respData = null;

              if (response.data) {
                respData = response.data.dw_menu;
              }

              if (!Array.isArray(respData)) {
                respData = [];
              }

              if (isDevMode()) {
                respData = this._dwMenuDataDev.concat(respData);
              }

              this.menuList = this.menuInit(respData, 1);

              this.menu$.next(this.menuList);
              this.menuConfigMap$.next(Object.assign({}, this.menuConfigMapList));
              this.dwMenuLoadingMaskService.hide(loadingMaskId);
            },
            error => {
              console.log(error);
              this.menu$.next(this.menuList);
              this.menuConfigMap$.next(Object.assign({}, this.menuConfigMapList));
              this.dwMenuLoadingMaskService.hide(loadingMaskId);
            }
          );
        }
      }
    );
  }

  public menuAuthority(requestOptions: any): Observable<any> {
    return this.http.get('restful/service/DWSys/menu/authority', requestOptions);

    // return Observable.create(
    //   (observer: any) => {
    //     const testMock = {
    //       "message": "success",
    //       "success": true,
    //       "data": {
    //         "dw_menu_parameter": [],
    //         "dw_menu": [
    //           {
    //             "open_mode": "",
    //             "sequence": 41,
    //             "code": "",
    //             "icon_class": "dwType:cloud",
    //             "id": "ff17b6d2-e37e-4252-afe2-8e459ad7c31c",
    //             "type": "category",
    //             "default_expand": true,
    //             "url": "",
    //             "child": {
    //               "dw_menu_parameter": [],
    //               "dw_menu": [
    //                 {
    //                   "open_mode": "",
    //                   "sequence": 4,
    //                   "code": "dw-sys-menu",
    //                   "icon_class": "",
    //                   "id": "a0ee42e2-ca9e-4d54-9613-7844ac78ce63",
    //                   "type": "program",
    //                   "default_expand": false,
    //                   "url": "",
    //                   "child": {
    //                     "dw_menu_parameter": [],
    //                     "dw_menu": []
    //                   }
    //                 }
    //               ]
    //             }
    //           },
    //           {
    //             "open_mode": "",
    //             "sequence": 50,
    //             "code": "",
    //             "icon_class": "dwType:appstore dwTheme:fill",
    //             "id": "f81337d4-22c2-4d32-b900-ac6630938534",
    //             "type": "category",
    //             "default_expand": false,
    //             "url": "",
    //             "child": {
    //               "dw_menu_parameter": [],
    //               "dw_menu": [
    //                 {
    //                   "open_mode": "",
    //                   "sequence": 10,
    //                   "code": "dw-order",
    //                   "icon_class": "",
    //                   "id": "8f31ed46-0ead-457b-b7ee-6af083d04cf4",
    //                   "type": "program",
    //                   "default_expand": false,
    //                   "url": "",
    //                   "child": {
    //                     "dw_menu_parameter": [],
    //                     "dw_menu": []
    //                   }
    //                 },
    //                 {
    //                   "open_mode": "",
    //                   "sequence": 11,
    //                   "code": "dw-document-order",
    //                   "icon_class": "",
    //                   "id": "aae5da16-20a7-4ee1-a774-6526bb57db55",
    //                   "type": "program",
    //                   "default_expand": false,
    //                   "url": "",
    //                   "child": {
    //                     "dw_menu_parameter": [],
    //                     "dw_menu": []
    //                   }
    //                 },
    //                 {
    //                   "open_mode": "",
    //                   "sequence": 12,
    //                   "code": "dw-group",
    //                   "icon_class": "",
    //                   "id": "159ff7cd-6f50-4e7d-852c-15e3500f504a",
    //                   "type": "program",
    //                   "default_expand": false,
    //                   "url": "",
    //                   "child": {
    //                     "dw_menu_parameter": [],
    //                     "dw_menu": []
    //                   }
    //                 }
    //               ]
    //             }
    //           },
    //           {
    //             "open_mode": "",
    //             "sequence": 55,
    //             "code": "",
    //             "icon_class": "dwType:pie-chart",
    //             "id": "b545c6f5-4de6-467b-8ff7-a2919a608743",
    //             "type": "category",
    //             "default_expand": false,
    //             "url": "",
    //             "child": {
    //               "dw_menu_parameter": [],
    //               "dw_menu": [
    //                 {
    //                   "open_mode": "",
    //                   "sequence": 8,
    //                   "code": "s-sampleApp1-Main-frm",
    //                   "icon_class": "",
    //                   "id": "9dee6440-6f6b-483a-9524-bb7c1368d5d0",
    //                   "type": "fineReport",
    //                   "default_expand": false,
    //                   "url": "",
    //                   "child": {
    //                     "dw_menu_parameter": [],
    //                     "dw_menu": []
    //                   }
    //                 }
    //               ]
    //             }
    //           },
    //           {
    //             "open_mode": "",
    //             "sequence": 58,
    //             "code": "",
    //             "icon_class": "dwType:link",
    //             "id": "e4089c37-47c2-4fd9-931c-4562a036bc20",
    //             "type": "category",
    //             "default_expand": false,
    //             "url": "",
    //             "child": {
    //               "dw_menu_parameter": [],
    //               "dw_menu": [
    //                 {
    //                   "open_mode": "window",
    //                   "sequence": 4,
    //                   "code": "",
    //                   "icon_class": "",
    //                   "id": "ff0261d9-6145-4183-bc7f-6102250691ae",
    //                   "type": "externalUrl",
    //                   "default_expand": false,
    //                   "url": "http://dap.digiwin.com",
    //                   "child": {
    //                     "dw_menu_parameter": [],
    //                     "dw_menu": []
    //                   }
    //                 },
    //                 {
    //                   "open_mode": "iframe",
    //                   "sequence": 8,
    //                   "code": "",
    //                   "icon_class": "",
    //                   "id": "c77ebd14-7594-4581-aac2-60080ed54521",
    //                   "type": "externalUrl",
    //                   "default_expand": false,
    //                   "url": "http://www.digiwin.com",
    //                   "child": {
    //                     "dw_menu_parameter": [],
    //                     "dw_menu": []
    //                   }
    //                 }
    //               ]
    //             }
    //           }
    //         ]
    //       }
    //     };

    //     observer.next(testMock);
    //     observer.complete();
    //   }
    // );
  }

  public getMenu(): Observable<IDwMenu[]> {
    return this.menu$.asObservable().pipe(
      filter(obsData => obsData !== null), // 不廣播初始值
      distinctUntilChanged() // 有改變時才廣播
    );
  }

  public getMenuConfigMap(): Observable<IDwMenuConfigMap> {
    return this.menuConfigMap$.asObservable().pipe(
      distinctUntilChanged() // 有改變時才廣播
    );
  }

  private menuInit(menuDataSource: Array<any>, level: number): IDwMenu[] {
    const menuList: IDwMenu[] = [];
    const len = menuDataSource.length;

    for (let i = 0; i < len; i++) {
      const source: any = JSON.parse(JSON.stringify(menuDataSource[i]));
      const menuItem: IDwMenu = {
        id: source.id, // 菜單編號
        type: source.type, // 類型. 目錄='category', 作業='program', 'fineReport':報表, 外部網頁(另開)='externalUrl'
        iconClass: source.icon_class, // 圖示樣式
        open: source.default_expand, // 是否展開。預設false
        programId: source.code, // 作業編號。type='program'時設定。
        url: source.url ? source.url : '', // 連結網址。type='externalUrl'時，設定外部網頁網址
        openMode: source.open_mode ? source.open_mode : '',
        parameter: [],
        child: [] // 子節點
      };

      if (source.child.hasOwnProperty('dw_menu_parameter')) {
        source.child.dw_menu_parameter.forEach(
          element => {
            const eltParam: IDwOperationParamData = {
              name: element.name, // 參數編號
              value: element.value // 值
            };

            menuItem.parameter.push(eltParam);
          }
        );
      }

      this.dwMenuAttributeService.default(menuItem, level);

      // this.propertyRegulate(menuItem);

      if (source.child.dw_menu.length > 0) {
        menuItem.child = this.menuInit(source.child.dw_menu, level + 1);
      }

      let isNewItem = true;

      // 目錄下沒有子節點則不顯示目錄.例如模組下的作業都沒有權限時
      if (menuItem.type === 'category' && menuItem.child.length === 0) {
        isNewItem = false;
      }

      if (isNewItem) {
        menuList.push(menuItem);

        if (this.menuConfigMapList) {
          this.menuConfigMapList[menuItem.id] = {
            type: menuItem.type, // 類型. 目錄='category', 作業='program', 'fineReport':報表, 外部網頁(另開)='externalUrl'
            iconClass: menuItem.iconClass, // 圖示樣式
            open: menuItem.open, // 是否展開。預設false
            disabled: menuItem.disabled, // 是否禁用。預設false
            selected: menuItem.selected, // 是否被選中。預設false
            programId: menuItem.programId, // 作業編號。type='program'時設定。
            url: menuItem.url ? menuItem.url : '', // 連結網址。type='externalUrl'時，設定外部網頁網址
            openMode: menuItem.openMode ? menuItem.openMode : '',
            parameter: menuItem.parameter,
            level: menuItem.level
          };
        }
      }
    }

    return menuList;
  }
}

// 'restful/service/DWSys/menu/authority' 返回參數
// interface RootObject {
//   data: RespData;
//   message: string;
//   success: boolean;
// }

// interface RespData {
//   dw_menu: Dwmenu2[];
// }

// interface Dwmenu2 {
//   child: RespData[];
//   code: string;
//   default_expand: boolean;
//   icon_class: string;
//   id: string;
//   sequence: number;
//   type: string;
// }
