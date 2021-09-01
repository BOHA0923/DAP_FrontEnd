import { Observable } from 'rxjs/internal/Observable';
import { Injectable } from '@angular/core';
import { Params } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

import { DwOperationInfoService, IDwOperationParamData } from '@webdpt/framework/operation';
import { IDwMenu } from '../interface/menu.interface';
import { DwMenuExecuteService } from './menu-execute.service';
import { filter } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class DwRecursiveMenuService {
  public inlineCollapsed: boolean = false; // TODO：暫解Menu收合時，不要自動設定open屬性，避免彈出子選單
  private _menuList: IDwMenu[];
  private _selectable: boolean;
  private _routeSelectMenu: boolean = false; // 路由影響選單選中節點(TabMenu是否和Menu連動),預設false
  private _$menuList: BehaviorSubject<IDwMenu[]>;

  constructor(
    private menuExecuteService: DwMenuExecuteService,
    private operationInfoService: DwOperationInfoService,
    // @Inject(DW_USING_TAB) private _usingTab: boolean
    // private recursiveMenuStorageService: DwRecursiveMenuStorageService
  ) {
    this._menuList = [];
    this._$menuList = new BehaviorSubject(null);
  }

  set selectable(selectable: boolean) {
    this._selectable = selectable || false;
  }

  get selectable(): boolean {
    return this._selectable;
  }

  set routeSelectMenu(routeSelectMenu: boolean) { // 路由影響Menu選中節點(TabMenu是否和Menu連動)，預設false
    this._routeSelectMenu = routeSelectMenu || false;
  }

  get routeSelectMenu(): boolean {
    return this._routeSelectMenu;
  }

  set menuList(menuList: IDwMenu[]) {
    this._menuList = menuList;
    this._$menuList.next(this._menuList);
  }

  get menuList(): IDwMenu[] {
    return this._menuList;
  }

  get $menuList(): Observable<IDwMenu[]> {
    return this._$menuList.asObservable().pipe(
      filter(menuList => menuList !== null) // 不廣播初始值
    );
  }

  // 點選Menu
  public onClickItem(menuItem: IDwMenu): void {
    if (!menuItem.disabled) {
      if (this.selectable) { // 畫面[dwSelected]屬性無法雙向綁定，需要自行改變數中的屬性
        this.onSelect(menuItem.id);
      }

      this.menuExecuteService.menuClick(menuItem);
    }
  }

  public onClickSubmenu(menuItem: IDwMenu): void {
    const ret = this.openSubmenu(this._menuList, menuItem.id, menuItem.open);
    if (ret.isChange) {
      this.menuList = ret.menuList;
    }
  }

  /**
   * 選中節點
   * 畫面[dwSelected]屬性無法雙向綁定，需要自行改變數中的屬性
   */
  public onSelect(menuId: string, programId?: string): void {
    if (this.selectable) {
      const ret = this.onSelectChange(this._menuList, menuId, programId);
      if (ret.isChange) {
        this.menuList = ret.menuList;
      }
    }
  }

  /**
   * 依運行中的作業編號取得Menu節點，但報表和外部連結要再比對參數
   */
  public getMenuItemByProgramId(menuDataSource: IDwMenu[], programId: string, param: Params): IDwMenu {
    let matchMenu: IDwMenu;
    let isEqual = false; // 是否相同
    const len = menuDataSource.length;

    for (let i = 0; i < len; i++) {
      const menuItem: IDwMenu = JSON.parse(JSON.stringify(menuDataSource[i]));

      if (menuItem.programId === programId) {
        // 比對queryParams
        if (menuItem.type === 'fineReport' || menuItem.type === 'externalUrl') {
          const diffParam = {};

          menuItem.parameter.forEach(
            (menuParam: IDwOperationParamData) => {
              const key = menuParam.name;
              const value = menuParam.value;

              if (key !== 'dwMenuId') {
                diffParam[key] = value;
              }
            }
          );

          isEqual = this.operationInfoService.isParamEqual(param, diffParam);
        } else {
          isEqual = true;
        }

        if (isEqual) {
          matchMenu = menuItem;
          break;
        }
      }

      if (menuItem.child.length > 0) {
        matchMenu = this.getMenuItemByProgramId(menuItem.child, programId, param);
        if (matchMenu) {
          break;
        }
      }
    }

    return matchMenu;
  }

  private onSelectChange(menuDataSource: IDwMenu[], menuId: string, programId: string): any {
    const menuList: IDwMenu[] = [];
    const len = menuDataSource.length;
    const ret = {
      menuList: menuList,
      isFind: false, // 是否找到
      isChange: false // 是否改變Menu的屬性，避免沒改值也觸發廣播事件
    };

    for (let i = 0; i < len; i++) {
      const menuItem: IDwMenu = JSON.parse(JSON.stringify(menuDataSource[i]));

      // Menu用menuId找，Tab Menu用programId找
      let selected = false;
      if (menuId) {
        if (menuItem.id === menuId) {
          selected = true;
        }
      } else {
        if (menuItem.programId === programId) {
          selected = true;
        }
      }

      if (menuItem.selected !== selected) {
        menuItem.selected = selected;
        ret.isChange = true;
      }

      if (menuItem.selected) {
        ret.isFind = true;
      }

      if (menuItem.child.length > 0) {
        const childRet = this.onSelectChange(menuItem.child, menuId, programId);
        menuItem.child = childRet.menuList;

        // 子階層如果有找到，父以上的目錄都要打開
        if (childRet.isFind) {
          if (this.inlineCollapsed === false) { // TODO：暫解Menu收合時，不要自動設定open屬性，避免彈出子選單
            menuItem.open = true;
          }

          ret.isFind = true;
        }

        if (childRet.isChange) {
          ret.isChange = childRet.isChange;
        }
      }

      menuList.push(menuItem);
    }

    ret.menuList = menuList;
    return ret;
  }

  private openSubmenu(menuDataSource: IDwMenu[], menuId: string, open: boolean): any {
    const menuList: IDwMenu[] = [];
    const len = menuDataSource.length;
    const ret = {
      menuList: menuList,
      isChange: false // 是否改變Menu的屬性，避免沒改值也觸發廣播事件
    };

    for (let i = 0; i < len; i++) {
      const menuItem: IDwMenu = JSON.parse(JSON.stringify(menuDataSource[i]));

      // Menu用menuId找，Tab Menu用programId找
      if (menuId) {
        if (menuItem.id === menuId) {
          if (this.inlineCollapsed === false) { // TODO：暫解Menu收合時，不要自動設定open屬性，避免彈出子選單
            menuItem.open = open;
            ret.isChange = true;
          }
        }
      }

      if (menuItem.child.length > 0) {
        const childRet = this.openSubmenu(menuItem.child, menuId, open);
        menuItem.child = childRet.menuList;

        if (childRet.isChange) {
          ret.isChange = childRet.isChange;
        }
      }

      menuList.push(menuItem);
    }

    ret.menuList = menuList;
    return ret;
  }
}
