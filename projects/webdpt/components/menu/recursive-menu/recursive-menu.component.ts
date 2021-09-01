import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, OnDestroy, Input, Inject } from '@angular/core';
import { Subscription } from 'rxjs';

import { IDwMenu } from '../interface/menu.interface';
import { DwMenuService } from '../service/menu.service';
import { DwRecursiveMenuService } from '../service/recursive-menu.service';
import { DwRouterInfoService } from '@webdpt/framework/operation';
import { DwLanguageService } from '@webdpt/framework/language';
import { IDwLoadMaskCfg, IDwLoadMaskItem } from '@webdpt/framework/http';
import { DwMenuLoadingMaskService } from '../service/menu-loading-mask.service';
import { DwTabInfoService2 } from '@webdpt/framework/routing-tabset';
import { DwLanguagePreService } from '@webdpt/framework/program-info';
import { DW_USING_TAB } from '@webdpt/framework/config';

@Component({
  selector: 'dw-recursive-menu',
  templateUrl: './recursive-menu.component.html',
  styleUrls: ['./recursive-menu.component.css']
})
export class DwRecursiveMenuComponent implements OnInit, OnDestroy {
  isInit: boolean;
  menuList: IDwMenu[] = [];
  private menuListTemp: IDwMenu[] = null; // menuList暫存
  menuInitSubscription: Subscription;
  menuListSubscription: Subscription;
  menuLoadingSubscription: Subscription;
  mode: string;
  selectable: boolean = true;
  private _routeSelectMenu: boolean = false; // 路由影響選單選中節點(TabMenu是否和Menu連動),預設false
  inlineCollapsed: boolean = this.recursiveMenuService.inlineCollapsed;  // TODO：暫解Menu收合時，不要自動設定open屬性，避免彈出子選單
  style: string;
  theme: string; // Menu樣式：'dark', light'
  language: string = ''; // 語言別
  loadingMask: IDwLoadMaskCfg;

  menuPre = this.dwLanguagePreService.menu;

  @Input() template: any;

  // TODO：Bug #9124
  // 問題：NG-ZORRO Menu初始化isCollapsed = true，會出現ExpressionChangedAfterItHasBeenCheckedError
  // 暫解：初始化先暫存inlineCollapsed，取得Menu值再設回原本的inlineCollapsed
  // 測試案例：<dw-layout-basic-side [dwCollapsed]="true">
  // 測試案例：<dw-layout-basic-side [collapsedWidth]="0" [breakpoint]="'lg'"> 小螢幕預設收起，但Menu內含展開子節點，初始化不可Menu彈出子選單
  // 測試案例：<dw-layout-basic-side [routeSelectMenu]="true"> 搭配使用頁籤
  private isCollapsedInit = {
    isInit: false,
    isCollapsedTemp: null
  };

  @Input()
  set dwInlineCollapsed(dwInlineCollapsed: boolean) {
    if (!this.isCollapsedInit.isInit) { // TODO：Bug #9124
      this.isCollapsedInit.isCollapsedTemp = dwInlineCollapsed || false; // TODO：Bug #9124
    } else { // TODO：Bug #9124
      this.isCollapsedInit.isInit = true; // TODO：Bug #9124
      this.inlineCollapsed = dwInlineCollapsed || false;
      this.recursiveMenuService.inlineCollapsed = this.inlineCollapsed;  // TODO：暫解Menu收合時，不要自動設定open屬性，避免彈出子選單
    }

    // Menu收合時
    // 1. 頁籤不連動Menu，等展開時再更新Menu。因為收合時，節點open會導致彈出子選單。
    // 2. 把UI最後操作結果menuList設定回去給service
    if (this.inlineCollapsed === false && this.menuListTemp !== null) {
      this.menuList = JSON.parse(JSON.stringify(this.menuListTemp));
      this.menuListTemp = null;
    } else {
      this.menuListTemp = JSON.parse(JSON.stringify(this.menuList));
    }
  }

  @Input()
  set dwMode(dwMode: string) {
    this.mode = dwMode || 'inline';
  }

  @Input()
  set dwSelectable(dwSelectable: boolean) {
    this.selectable = dwSelectable || true;
  }

  @Input()
  set routeSelectMenu(routeSelectMenu: boolean) { // 路由影響Menu選中節點(TabMenu是否和Menu連動)，預設false
    this._routeSelectMenu = routeSelectMenu || false;
  }

  @Input()
  set dwStyle(dwStyle: string) {
    this.style = dwStyle || '';
  }

  @Input()
  set dwTheme(dwTheme: string) {
    this.theme = dwTheme || 'dark';
  }

  constructor(
    private menuService: DwMenuService,
    private languageService: DwLanguageService,
    private recursiveMenuService: DwRecursiveMenuService,
    // private recursiveMenuStorageService: DwRecursiveMenuStorageService
    private dwTabInfoService: DwTabInfoService2,
    private activatedRoute: ActivatedRoute,
    private dwRouterInfoService: DwRouterInfoService,
    private dwMenuLoadingMaskService: DwMenuLoadingMaskService,
    private dwLanguagePreService: DwLanguagePreService,
  ) {
    this.isInit = false;
  }

  ngOnInit(): void {
    this.recursiveMenuService.selectable = this.selectable;
    this.recursiveMenuService.routeSelectMenu = this._routeSelectMenu;

    this.menuLoadingSubscription = this.dwMenuLoadingMaskService.getLoadingMask().subscribe(
      (loadingMaskItem: IDwLoadMaskItem) => {
        const config = Object.assign({}, loadingMaskItem.config);
        this.loadingMask = config;
      }
    );

    this.menuInitSubscription = this.menuService.getMenu().subscribe(
      (data: IDwMenu[]) => {
        this.recursiveMenuService.menuList = data;
      },
      error => {
        console.log(error);
      }
    );

    this.menuListSubscription = this.recursiveMenuService.$menuList.subscribe(
      menuList => {
        // Menu收合時，頁籤不連動Menu，等展開時再更新Menu。因為收合時，節點open會導致彈出子選單。
        if (this.inlineCollapsed === true) {
          this.menuListTemp = JSON.parse(JSON.stringify(menuList));
          const collapsedList = this.unOpen(menuList);
          this.menuList = JSON.parse(JSON.stringify(collapsedList));
        } else {
          if (!this.isCollapsedInit.isInit && this.isCollapsedInit.isCollapsedTemp !== null) {
            this.menuListTemp = JSON.parse(JSON.stringify(menuList));
          }

          this.menuList = JSON.parse(JSON.stringify(menuList));

          // 路由影響選單選中節點(TabMenu是否和Menu連動)
          if (this.selectable && this._routeSelectMenu) {
            // 初始化時自動選擇節點
            if (!this.isInit && this.menuList.length > 0) {
              this.isInit = true;
              let selectMenuId = '';
              // 從TabMenu上次點選記錄查節點
              const selectedRoute = this.dwTabInfoService.currentTabInfo;

              if (selectedRoute) {
                if (selectedRoute.hasOwnProperty('menuId')) {
                  selectMenuId = selectedRoute.menuId;
                }
              }

              if (selectMenuId) {
                this.recursiveMenuService.onSelect(selectMenuId);
              } else {
                // 從路由資訊中的作業編號查節點
                const programId = this.dwRouterInfoService.routerProgramId(this.activatedRoute); // 非頁籤時snapshot取不到params

                if (programId) {
                  const queryParams = this.activatedRoute.snapshot.queryParams;
                  const matchMenu = this.recursiveMenuService.getMenuItemByProgramId(this.menuList, programId, queryParams);
                  if (matchMenu) {
                    this.recursiveMenuService.onSelect(matchMenu.id);
                  }
                }
              }
            }
          }

          if (!this.isCollapsedInit.isInit && this.isCollapsedInit.isCollapsedTemp !== null) { // TODO：Bug #9124
            setTimeout(() => { // 避免重複設定出現ExpressionChangedAfterItHasBeenCheckedError // TODO：Bug #9124
              this.isCollapsedInit.isInit = true; // TODO：Bug #9124
              this.inlineCollapsed = this.isCollapsedInit.isCollapsedTemp; // TODO：Bug #9124
              this.recursiveMenuService.inlineCollapsed = this.inlineCollapsed;
            }, 0); // TODO：Bug #9124
          } // TODO：Bug #9124
        }
      },
      error => {
        this.menuList = [];
        console.log(error);
      }
    );

    // 取得最新語言別
    this.languageService.language$.subscribe(
      lang => {
        this.language = lang;
      }
    );
  }

  ngOnDestroy(): void {
    this.isInit = false;
    this.recursiveMenuService.inlineCollapsed = false; // Bug #9414
    // this.recursiveMenuStorageService.remove();

    if (this.menuInitSubscription) {
      this.menuInitSubscription.unsubscribe();
    }

    if (this.menuListSubscription) {
      this.menuListSubscription.unsubscribe();
    }

    if (this.menuLoadingSubscription) {
      this.menuLoadingSubscription.unsubscribe();
    }
  }

  private unOpen(menuDataSource: IDwMenu[]): any {
    const menuList: IDwMenu[] = [];
    const len = menuDataSource.length;

    for (let i = 0; i < len; i++) {
      const menuItem: IDwMenu = JSON.parse(JSON.stringify(menuDataSource[i]));
      menuItem.open = false;

      if (menuItem.child.length > 0) {
        menuItem.child = this.unOpen(menuItem.child);
      }

      menuList.push(menuItem);
    }

    return menuList;
  }

  // 點選Menu
  onClickItem($event: any, menuItem: IDwMenu): void {
    $event.preventDefault(); // 取消該事件
    $event.stopPropagation(); // 阻止事件物件繼續捕捉或冒泡傳遞
    this.recursiveMenuService.onClickItem(menuItem);
  }

  // 點選SubMenu，把UI操作的Menu狀態同步至service，例如open狀態，避免service資料不一致
  onClickSubmenu($event: any, menuItem: IDwMenu): void {
    $event.preventDefault(); // 取消該事件
    $event.stopPropagation(); // 阻止事件物件繼續捕捉或冒泡傳遞

    setTimeout(() => {
      this.recursiveMenuService.onClickSubmenu(menuItem);
    }, 0);
  }
}

