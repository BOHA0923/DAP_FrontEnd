import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged, filter } from 'rxjs/operators';
import { DwTenantService } from '@webdpt/framework/user';
import { DwAuthPermissionInfoService, IDwAuthorizedList } from '@webdpt/framework/auth';
import { DW_MENU_JSON } from '@webdpt/framework/config';
import { IDwMenu, IDwMenuConfigMap } from '../interface/menu.interface';
import { IDwMenuService } from '../interface/menu-service.interface';
import { DwMenuAttributeService } from './menu-attribute.service';
import { DwMenuLoadingMaskService } from './menu-loading-mask.service';

/**
 * 取使用者選單，用於呈現
 */
@Injectable({ providedIn: 'root' })
export class DwMenuConfigService {
  private menu$: BehaviorSubject<IDwMenu[]>; // 選單資料
  private menuConfigMap$: BehaviorSubject<any>; // 選單設定對應表
  private menuList: IDwMenu[];
  private menuConfigMapList: IDwMenuConfigMap;

  constructor(
    @Inject(DW_MENU_JSON) private dwMenuJson: IDwMenu[], // Menu靜態設定檔
    private dwAuthPermissionInfoService: DwAuthPermissionInfoService,
    private dwMenuAttributeService: DwMenuAttributeService,
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

          this.menuAuthority().subscribe(
            (response: any) => {
              let respData = null;

              if (response) {
                respData = response;
              }

              if (!Array.isArray(respData)) {
                respData = [];
              }

              // if (isDevMode()) {
              //   respData = this._dwMenuDataDev.concat(respData);
              // }

              this.menuList = this.menuInit(respData, this.menuConfigMapList, 1);

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

  public menuAuthority(): Observable<any> {
    return Observable.create(
      (observe: any) => {
        let menuList = [];
        let menuJson = JSON.parse(JSON.stringify(this.dwMenuJson));

        if (!Array.isArray(menuJson)) {
          menuJson = [];
        }

        this.dwAuthPermissionInfoService.authorizedList$.subscribe(
          (authorizedList: IDwAuthorizedList) => {
            menuList = this.menuAuthorityFilter(menuJson, authorizedList);
            observe.next(menuList);
            observe.complete();
          }
        );
      }
    );
  }

  private menuAuthorityFilter(menuDataSource: IDwMenu[], authorizedList: IDwAuthorizedList): IDwMenu[] {
    const menuList: IDwMenu[] = [];
    const len = menuDataSource.length;

    for (let i = 0; i < len; i++) {
      const menuItem: IDwMenu = JSON.parse(JSON.stringify(menuDataSource[i]));

      // 過濾權限
      let authCheck = true; // 是否有權限
      if (menuItem.type !== 'category') {
        if (!authorizedList[menuItem.programId]) {
          authCheck = false;

          // ㄧ般外部連結
          if (menuItem.type === 'externalUrl' && !menuItem.programId) {
            authCheck = true;
          }
        }
      }

      if (authCheck) {
        if (menuItem.hasOwnProperty('child')) {
          if (menuItem.child.length > 0) {
            menuItem.child = this.menuAuthorityFilter(menuItem.child, authorizedList);
          }
        }

        let isNewItem = true;

        // 目錄下沒有子節點則不顯示目錄.例如模組下的作業都沒有權限時
        if (menuItem.type === 'category' && menuItem.child.length === 0) {
          isNewItem = false;
        }

        if (isNewItem) {
          menuList.push(menuItem);
        }
      }
    }

    return menuList;
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

  private menuInit(menuDataSource: IDwMenu[], menuConfigMapList: IDwMenuConfigMap, level: number): IDwMenu[] {
    const menuList: IDwMenu[] = [];
    const len = menuDataSource.length;

    for (let i = 0; i < len; i++) {
      const menuItem: IDwMenu = JSON.parse(JSON.stringify(menuDataSource[i]));
      this.dwMenuAttributeService.default(menuItem, level);

      menuConfigMapList[menuItem.id] = {
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

      // this.propertyRegulate(menuItem);

      if (menuItem.child.length > 0) {
        menuItem.child = this.menuInit(menuItem.child, menuConfigMapList, level + 1);
      }

      menuList.push(menuItem);
    }

    return menuList;
  }
}
