import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, Inject } from '@angular/core';
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
  selector: 'dw-menu-drawer',
  templateUrl: './menu-drawer.component.html',
  styleUrls: ['./menu-drawer.component.less']
})
export class DwMenuDrawerComponent implements OnInit, OnDestroy {
  isInit: boolean;
  menuList: IDwMenu[] = [];
  menuListTemp: IDwMenu[] = []; // menuList暫存
  menuInitSubscription: Subscription;
  menuListSubscription: Subscription;
  menuLoadingSubscription: Subscription;
  mode: string;
  selectable: boolean = true;
  private _routeSelectMenu: boolean = false; // 路由影響選單選中節點(TabMenu是否和Menu連動),預設false
  inlineCollapsed: boolean;
  style: string;
  theme: string; // Menu樣式：'dark', light'
  language: string = ''; // 語言別
  loadingMask: IDwLoadMaskCfg;

  menuPre = this.dwLanguagePreService.menu;

  @Input() template: any;

  @Input()
  set dwInlineCollapsed(dwInlineCollapsed: boolean) {
    // this.updateInlineCollapse(dwInlineCollapsed);
    this.inlineCollapsed = dwInlineCollapsed || false;
    // TODO：NG-ZORRO 升級8.5.2版，當Menu收合時，切換頁籤調DwRecursiveMenuService.onSelect會導致Menu彈出子選單
    // 暫解：Menu收合時，頁籤不連動Menu，等展開時再更新Menu
    if (this._routeSelectMenu && this._usingTab && this.inlineCollapsed === false) {
      this.menuList = JSON.parse(JSON.stringify(this.menuListTemp));
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

  @Output() afterClickMenu: EventEmitter<any> = new EventEmitter<any>(); // 點選Menu的回調

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
    @Inject(DW_USING_TAB) private _usingTab: boolean,
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
        // TODO：NG-ZORRO 升級8.5.2版，當Menu收合時，切換頁籤調DwRecursiveMenuService.onSelect會導致Menu彈出子選單
        // 暫解：Menu收合時，頁籤不連動Menu，等展開時再更新Menu
        if (this._routeSelectMenu && this._usingTab) {
          this.menuListTemp = JSON.parse(JSON.stringify(menuList));
        }

        // Menu沒有收合
        if ((this._routeSelectMenu && this._usingTab && this.inlineCollapsed === false)
          || !(this._routeSelectMenu && this._usingTab)) {

          this.menuList = menuList;

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

  // 點選Menu
  onClickItem(menuItem: IDwMenu): void {
    this.recursiveMenuService.onClickItem(menuItem);
    this.afterClickMenu.emit(menuItem); // 點選Menu的回調
  }
}
