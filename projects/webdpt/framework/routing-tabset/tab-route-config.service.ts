import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';

import { DW_TAB_ROUTE_CONFIG_JSON } from '@webdpt/framework/config';
import { IDwTabRouteConfigService } from './tab-route-config-service.interface';
import { IDwRouteInfo } from './route-info.interface';
import { DwAuthPermissionInfoService } from '@webdpt/framework/auth';
import { DwOperationInfoListService } from '@webdpt/framework/operation';
import { DwOperationInfoService } from '@webdpt/framework/operation';
import { IDwProgram } from '@webdpt/framework/operation';
import { DwDefaultAppRouterService } from '@webdpt/framework/program-info';
import { IDwDefaultAppInfo } from '@webdpt/framework/program-info';
import { DwLanguagePreService } from '@webdpt/framework/program-info';

@Injectable({ providedIn: 'root' })
export class DwTabRouteConfigService implements IDwTabRouteConfigService {
  constructor(
    private authPermissionInfoService: DwAuthPermissionInfoService,
    private operationInfoListService: DwOperationInfoListService,
    private operationInfoService: DwOperationInfoService,
    private defaultAppRouterService: DwDefaultAppRouterService,
    private dwLanguagePreService: DwLanguagePreService,
    @Inject(DW_TAB_ROUTE_CONFIG_JSON) private tabRouteConfigJson: any[]
  ) {
  }

  private newConfig(info: IDwProgram, option: IDwRouteInfo): IDwRouteInfo {
    let _option: IDwRouteInfo = {
      id: '',
      title: '',
      menuId: '',
      routerLink: '',
      type: ''
    };

    if (info) {
      _option = Object.assign(_option, option);
      _option.routerLink = info.routerLink;
      _option.type = info.type;
    }

    return _option;
  }

  get routeConfigInfos$(): Observable<any> {
    return Observable.create(observer => {
      let operationSubc = null;
      operationSubc = this.operationInfoListService.operationListMap$.subscribe(res => {
        if (res !== null) {
          const operationListMap = Object.assign({}, res);

          let permissionSubc = null;
          permissionSubc = this.authPermissionInfoService.authorizedList$.subscribe(auths => {
            const authorizedList = Object.assign({}, auths);
            const tabRouteConfig: IDwRouteInfo[] = [];

            let defaultAppInfoSubscription = null;
            defaultAppInfoSubscription = this.defaultAppRouterService.defaultAppInfo$.subscribe(
              (defaultAppInfo: IDwDefaultAppInfo) => {
                let configJson: IDwRouteInfo[] = JSON.parse(JSON.stringify(this.tabRouteConfigJson));

                if (!Array.isArray(configJson)) {
                  configJson = [];
                }

                let isReplace = false; // 是否替換頁籤首頁

                // 有設定首頁，要動態替換頁籤首頁
                if (defaultAppInfo.programId) {
                  const configLen = configJson.length;

                  for (let i = 0; i < configLen; i++) {
                    if (configJson[0].id === 'home') {
                      isReplace = true;
                      configJson[0].id = defaultAppInfo.programId;
                      configJson[0].title = this.dwLanguagePreService.program + 'dw-home';
                      configJson[0].type = defaultAppInfo.execType;
                      configJson[0].queryParams = JSON.parse(JSON.stringify(defaultAppInfo.queryParams));
                    }
                  }

                  if (!isReplace) {
                    isReplace = true;
                    const newDefaultTab: IDwRouteInfo = {
                      id: 'home',
                      title: '',
                      canClose: false,
                      defaultOpen: true,
                      canMultiOpen: false,
                      iconClass: 'dwType:home',
                      routerLink: ''
                    };

                    if (defaultAppInfo.programId) {
                      newDefaultTab.id = defaultAppInfo.programId;
                      configJson[0].title = this.dwLanguagePreService.program + 'dw-home';
                      newDefaultTab.type = defaultAppInfo.execType;
                      newDefaultTab.queryParams = JSON.parse(JSON.stringify(defaultAppInfo.queryParams));
                    }

                    configJson.splice(0, 0, newDefaultTab);
                  }
                }

                configJson.forEach(
                  (tabRouteConfigJsonItem: IDwRouteInfo) => {
                    const id = tabRouteConfigJsonItem.id;

                    // 檢查權限
                    let check = false;
                    if (authorizedList[id] || tabRouteConfigJsonItem.type === 'externalUrl') {
                      check = true;
                    }

                    if (check) {
                      let operation = operationListMap[id];

                      // 'fineReport','externalUrl'
                      if (operation === undefined) {
                        const programBase: IDwProgram = this.operationInfoService.operationBaseByType(tabRouteConfigJsonItem.type, id);
                        if (programBase.type) {
                          operation = Object.assign({}, programBase);
                        }
                      }

                      const newConfig: IDwRouteInfo = this.newConfig(operation, tabRouteConfigJsonItem);
                      if (newConfig.id !== '') {
                        tabRouteConfig.push(newConfig);
                      }
                    }
                  });

                observer.next({
                  'tabRouteConfig': tabRouteConfig,
                  'operationListMap': operationListMap
                });
                observer.complete();

                if (defaultAppInfoSubscription) {
                  defaultAppInfoSubscription.unsubscribe();
                }

                if (permissionSubc) {
                  permissionSubc.unsubscribe();
                }

                if (operationSubc) {
                  operationSubc.unsubscribe();
                }
              }
            );
          }, error => console.log(error));

        }
      });
    });
  }
}
