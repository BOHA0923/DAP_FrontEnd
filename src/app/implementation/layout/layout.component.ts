import { Component, OnInit, OnDestroy, Inject, Input, TemplateRef } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { DwUserService, DwProgramExecuteService, DwAuthPermissionInfoService,
  DwLanguagePreService, IDwAuthorizedList, DwAuthService, DW_USING_TAB, APP_DEFAULT,
  DwLanguageService, Logo_Path, DwTabRoutingService, IDwRouteInfo } from '@webdpt/framework';
import { DwMenuService, DwRecursiveMenuService, DwUpdatePasswordModalService, IDwMenu } from '@webdpt/components';
import { DwModalService, DwBreakpointEnum } from 'ng-quicksilver';
import { TranslateService } from '@ngx-translate/core';
import { DwResizeEvent } from 'ng-quicksilver/resizable';
import { ActivatedRoute, NavigationExtras } from '@angular/router';


@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.less']
})
export class LayoutComponent implements OnInit, OnDestroy {

  public data = [];
  public userDetail: any = {}; // 登入者詳細資料
  public visibleFromTitle: boolean;
  private permissionSubscription: Subscription;
  private updatePasswordSubscription: Subscription;

  dwLayoutType: string;
  layoutClass = [];
  headerClass = [];
  dwWidth = 200;
  id = -1; // Jadon add
  dwCollapsedWidth = 72;
  dwBreakpoint: DwBreakpointEnum;
  language: string = ''; // 語言別

  isCollapsed = false; // 當前收起狀態
  theme: string; // Menu Theme
  // dwIsHeaderFixed = true;
  // dwHasFooter = false;
  // Jadon add-S
  public searchVal: string = ''; // 搜查框输入的条件值
  public program_names: string[] = []; // 作业名称
  public names = []; // 作业资讯：作业id 作业name 模组id
  public program_name = [];
  public programData: any;
  public isActive: boolean = true; // 是否显示搜查框
  public menuInitSubscription: Subscription;
  // Jadon add-E

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
    private userService: DwUserService,
    private programExecuteService: DwProgramExecuteService,
    private dwModalService: DwModalService,
    private translateService: TranslateService,
    private authService: DwAuthService,
    private tabRoutingService: DwTabRoutingService,
    private languageService: DwLanguageService,
    private dwAuthPermissionInfoService: DwAuthPermissionInfoService,
    private dwUpdatePasswordModalService: DwUpdatePasswordModalService,
    private dwLanguagePreService: DwLanguagePreService,
    private menuService: DwMenuService,
    private recursiveMenuService: DwRecursiveMenuService,
    protected _route: ActivatedRoute,
    @Inject(DW_USING_TAB) public usingTab: boolean,
    @Inject(APP_DEFAULT) public logoUrl: string,
    @Inject(Logo_Path) public dwLogoPath: string,
  ) {
    this.userDetail = this.userService.getUserInfo();
   }

  ngOnInit(): void {
    const dataConfig = [
      {
        id: 'update-password',
        title: 'dw-update-password-title' // 修改密碼
      }
    ];

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

    this.permissionSubscription = this.dwAuthPermissionInfoService.authorizedList$.subscribe(
      response => {
        if (response) {
          const authorizedList = <IDwAuthorizedList>response;

          dataConfig.forEach(
            dataItem => {
                this.data.push(dataItem);
            }
          );
        }
      }
    );
    // Jadon add-S
    // 获取当前user的菜单
    this.menuInitSubscription = this.menuService.getMenu().subscribe(
      (data: IDwMenu[]) => {
        this.recursiveMenuService.menuList = data;
      },
      error => {
        console.log('layout ngOninit getMenu error: ', error);
      }
    );
    // console.log('layout ngOninit menuInitSubscription : ', this.menuInitSubscription);
    // console.log('layout ngOninit recursiveMenuService : ', this.recursiveMenuService);
    // console.log('layout ngOninit recursiveMenuService.menuList : ', this.recursiveMenuService.menuList);
    this.names = [];
    this.program_name = [];
    this.recursiveMenuService.menuList.forEach((item) => {
      item['child'].forEach((obj) => {
        this.program_name.push(this.translateService.instant('prog.' + obj.programId));
        this.names.push({
          module: item.id,
          id: obj.id,
          name: this.translateService.instant('prog.' + obj.programId),
          programId: obj.programId
        });
      });
    });
    console.log('layout getMenuData names : ', this.names);
    // 菜单去重
    const arr2 = this.names.filter((item, index) => {
      const temArr = [];
      this.names.forEach(item2 => temArr.push(item2.name));
      return temArr.indexOf(item.name) === index;
    });
    this.names = arr2;
    // console.log('layout getMenuData names 1 : ', this.names);

    // 存储菜单方便作业后期跳转对应作业动态取得名称
    if (this.names) {
      sessionStorage.setItem('sscMenuDataJson', JSON.stringify(this.names));
    }
    // Jadon add-E

  }

  public personalize(id: string): void {
    this.visibleFromTitle = false;
    switch (id) {
      case 'update-password':
        this.updatePassword();
        break;
      default:
        this.programExecuteService.byId(id);
        break;
    }

  }

  /**
   * 修改密碼
   *
   */
  updatePassword(): void {
    this.dwUpdatePasswordModalService.open().subscribe(
      (ret) => {
        console.log('ret>>>', ret);
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

  // Jadon add-S
  // 左侧menu宽度可手动拉取
  onSideResize($event: DwResizeEvent): void {
    // console.log('onSideResize $event,id : ', $event, this.id);
    cancelAnimationFrame(this.id);
    this.id = requestAnimationFrame(() => {
      this.dwWidth = $event.width;
    });
  }

  public onChange(): void {
    // console.log('layout onChange searchVal : ', this.searchVal);
    const aaa = this.names.filter(tab => JSON.stringify(tab.name).toLowerCase().includes(this.searchVal.toLowerCase()));
      if (aaa) {
        this.program_names = [];
        aaa.forEach((item) => {
          this.program_names.push(item.name);
        });
      } else {
        this.program_names = this.program_name;
      }
  }

  // 串联开启搜寻的作业
  public programNameClick(name: any): void {
    // console.log('layout programNameClick name : ', name);
    const aaa = this.names.filter(tab => tab.name === name);
    // console.log('layout programNameClick aaa : ', aaa);
    let programId = ''; // 作业id
    let moduleId = ''; // 模组id
    programId = aaa[0]['id'];
    moduleId = aaa[0]['module'];
    let routerLink = '/' + moduleId + '/' + programId;
    if (this.programData && this.programData.length) {
      const menuIdx = this.programData.findIndex( menu => {
        return menu.id === programId;
      });
      if (menuIdx !== -1) {
        routerLink = this.programData[menuIdx].routerLink;
      }
    }
    const navigationExtras: NavigationExtras = {
      relativeTo: this._route, // 相對路徑導頁
      queryParams: { }
    };
    // console.log('myHome taskpoolClk navigationExtras : ', navigationExtras);
    // 不关闭当前页签
    this.tabRoutingService.navigateOrCreate(
      [routerLink],
      navigationExtras
      );
    // console.log('layout programNameClick tabRoutingService : ', this.tabRoutingService);

  }

  public keyDown(event: any): void {
    if (event.keyCode === 13) {
      this.programNameClick(this.searchVal);
    }
  }

  // 搜索栏
  public searchDisplay(): void {
    // console.log('layout searchDisplay');
    if (this.searchVal === '') {
      this.isActive = !this.isActive;
    } else {
      this.isActive = false;
    }
  }

  // 全屏显示
  // public fullScreen() {
  //   let screenBox = this.el.nativeElement.ownerDocument.documentElement;
  //   let exitBox = this.el.nativeElement.ownerDocument;
  //   if (this.full) {
  //     if (screenBox.requestFullscreen) {
  //       screenBox.requestFullscreen();
  //     } else if (screenBox.mozRequestFullScreen) {
  //       screenBox.mozRequestFullScreen();
  //     } else if (screenBox.webkitRequestFullscreen) {
  //       screenBox.webkitRequestFullscreen();
  //     } else if (screenBox.msRequestFullscreen) {
  //       screenBox.msRequestFullscreen();
  //     }
  //     this.full = false;
  //   } else {
  //     //退出全屏
  //     if (exitBox.exitFullscreen) {
  //       exitBox.exitFullscreen();
  //     } else if (exitBox.mozCancelFullScreen) {
  //       exitBox.mozCancelFullScreen();
  //     } else if (exitBox.webkitCancelFullScreen) {
  //       exitBox.webkitCancelFullScreen();
  //     } else if (exitBox.msExitFullscreen) {
  //       exitBox.msExitFullscreen();
  //     }
  //     this.full = true;
  //   }
  // }
  // Jadon add-E

  ngOnDestroy(): void {

    // 對服務 subscribe() 的要解除, 如果是 httpClient 或是 router 則不用.
    this.langSubscription.unsubscribe();

    if (this.permissionSubscription) {
      this.permissionSubscription.unsubscribe();
    }
    if (this.menuInitSubscription) {
      this.menuInitSubscription.unsubscribe();
    }
  }

}
