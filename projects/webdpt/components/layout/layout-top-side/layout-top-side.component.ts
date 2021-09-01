import { Component, Inject, OnInit, Input, ViewEncapsulation, TemplateRef, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { DwBreakpointEnum } from 'ng-quicksilver/core/services';
import { DwModalService } from 'ng-quicksilver/modal';

import { DwLanguageService } from '@webdpt/framework/language';
import { DwAuthService } from '@webdpt/framework/auth';
import { Logo_Path, APP_DEFAULT, DW_USING_TAB } from '@webdpt/framework/config';

/**
 * 頂部固定側邊欄佈局
 * 使用範例：
 * <dw-layout-top-side></dw-layout-top-side>
 * <dw-layout-top-side [collapsedWidth]="0" [breakpoint]="'lg'"></dw-layout-top-side>
 *
 * 參數：
 * [width]: number // 側邊欄寬度，預設200
 * [dwCollapsed]: boolean // 當前收起狀態，預設false
 * [collapsedWidth]: number // 收縮寬度，預設72設置為 0 會出現特殊 trigger
 * [breakpoint]: DwBreakpointEnum // 觸發響應式佈局的斷點：'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'
 * [dwTheme]: string // 主題顏色：'light' | 'dark'
 * [dwSelectable]: boolean // Menu是否允許選中，預設true
 * [routeSelectMenu]: boolean // 路由影響Menu選中節點(TabMenu是否和Menu連動)，預設false
 *
 * [siderTemplate]: TemplateRef<any> // 側邊欄樣板
 * [headerTemplate]: TemplateRef<any> // 頂部樣板
 * [headerLeftTemplate]: TemplateRef<any> // 頂部左邊樣板
 * [headerRightTemplate]: TemplateRef<any> // 頂部右邊樣板
 * [headerRightActionTemplate]: TemplateRef<any> // 頂部右邊功能樣板
 * [headerRightUserTemplate]: TemplateRef<any> // 頂部右邊用戶功能樣板
 */

@Component({
  selector: 'dw-layout-top-side',
  templateUrl: './layout-top-side.component.html',
  styleUrls: ['./layout-top-side.component.less'],
  // tslint:disable-next-line:use-view-encapsulation
  encapsulation: ViewEncapsulation.None // 樣式不封裝
})
export class DwLayoutTopSideComponent implements OnInit, OnDestroy {
  dwLayoutType: string;
  layoutClass = [];
  headerClass = [];
  dwWidth = 200;
  dwCollapsedWidth = 72;
  dwBreakpoint: DwBreakpointEnum;
  language: string = ''; // 語言別

  isCollapsed = false; // 當前收起狀態
  theme: string; // Menu Theme
  // dwIsHeaderFixed = true;
  // dwHasFooter = false;

  private _dwSelectable: boolean = true;
  private _routeSelectMenu: boolean = false;

  private langSubscription: Subscription;

  @Input() siderTemplate: TemplateRef<any>; // 側邊欄樣板

  @Input() siderAfterMenuTemplate: TemplateRef<any>;

  @Input() headerTemplate: TemplateRef<any>; // 頂部樣板

  @Input() headerLeftTemplate: TemplateRef<any>; // 頂部左邊樣板

  @Input() headerRightTemplate: TemplateRef<any>; // 頂部右邊樣板

  @Input() headerRightActionTemplate: TemplateRef<any>; // 頂部右邊功能樣板

  @Input() headerRightUserTemplate: TemplateRef<any>; // 頂部右邊用戶功能樣板

  // @Input() footerTemplate: TemplateRef<any>;

  // @Input()
  // set isHeaderFixed(isHeaderFixed: boolean) { // 是否固定頂部
  //   this.dwIsHeaderFixed = isHeaderFixed;
  // }

  // @Input()
  // set hasFooter(hasFooter: boolean) { // 是否有底部布局
  //   this.dwHasFooter = hasFooter;
  // }

  @Input()
  set width(width: number) { // 側邊欄寬度
    this.dwWidth = width;
  }

  @Input()
  set dwCollapsed(dwCollapsed: boolean) { // 當前收起狀態，預設false
    this.isCollapsed = dwCollapsed;
  }

  @Input()
  set collapsedWidth(collapsedWidth: number) { // 收縮寬度，預設72設置為 0 會出現特殊 trigger
    this.dwCollapsedWidth = collapsedWidth;
  }

  @Input()
  set breakpoint(breakpoint: DwBreakpointEnum) { // 觸發響應式佈局的斷點：'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'
    this.dwBreakpoint = breakpoint;
  }

  @Input()
  set dwTheme(dwTheme: string) { // 主題顏色：'dark', light'
    this.theme = dwTheme || 'dark';
  }

  @Input()
  set dwSelectable(dwSelectable: boolean) { // Menu是否允許選中,預設true
    this._dwSelectable = dwSelectable;
  }

  get dwSelectable(): boolean {
    return this._dwSelectable;
  }

  @Input()
  set routeSelectMenu(routeSelectMenu: boolean) { // 路由影響Menu選中節點(TabMenu是否和Menu連動)，預設false
    this._routeSelectMenu = routeSelectMenu;
  }

  get routeSelectMenu(): boolean {
    return this._routeSelectMenu;
  }

  constructor(
    private authService: DwAuthService,
    private languageService: DwLanguageService,
    private dwModalService: DwModalService,
    private translateService: TranslateService,
    @Inject(APP_DEFAULT) public logoUrl: string,
    @Inject(Logo_Path) public dwLogoPath: string,
    @Inject(DW_USING_TAB) public usingTab: boolean
  ) {
  }

  ngOnDestroy(): void {
    // 對服務 subscribe() 的要解除, 如果是 httpClient 或是 router 則不用.
    this.langSubscription.unsubscribe();
  }

  ngOnInit(): void {
    // this.setLayoutType();

    // 避免Logo連結干擾Tab Menu 路由
    if (this.usingTab) {
      this.logoUrl = null;
    }

    // 取得最新語言別
    this.langSubscription = this.languageService.language$.subscribe(
      lang => {
        this.language = lang;
      }
    );
  }

  // 登出
  onLoggedout(): void {
    this.dwModalService.confirm({
      dwIconType: 'exclamation-circle',
      dwTitle: this.translateService.instant('dw-tenant-logout-title'),
      dwContent: this.translateService.instant('dw-tenant-logout-content'),
      dwOnOk: (): void => {
        this.authService.logout();
      }
    });
  }
}
