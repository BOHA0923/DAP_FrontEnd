import { DOCUMENT } from '@angular/common';
import {
  AfterViewInit,
  Component,
  DoCheck, HostBinding,
  Inject,
  IterableDiffer,
  IterableDiffers,
  NgZone,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChildren
} from '@angular/core';
import { ActivationStart, NavigationEnd, NavigationStart, Router, ActivationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { distinctUntilChanged, first } from 'rxjs/operators';
import { DW_TAB_MULTI_OPEN } from '@webdpt/framework/config';
import { DwTenantService } from '@webdpt/framework/user';
import { DwAuthService } from '@webdpt/framework/auth';
import { DwPostMessageFactoryService, DwPostMessageHub } from '@webdpt/framework/cors-messaging';
import {
  DwTabClose,
  DwTabFocusin,
  DwTabFocusout,
  DwTabInfoService2,
  DwTabOpen,
  DwTabRoutingService,
  IDwTabRouteState,
  StoredTabs,
  DwTabInfoStorageService
} from '@webdpt/framework/routing-tabset';
import { DwBaseIframeComponent } from '@webdpt/components/iframe';
import { DwRecursiveMenuService } from '@webdpt/components/menu';

export const TAB_STORED_KEY = 'TAB_STORED_KEY';

//  把OnPush拿掉測試看看
@Component({
  selector: 'dw-routing-tabset',
  templateUrl: './tabset.component.html',
  styleUrls: ['./tabset.component.less']
})
export class DwRoutingTabSetComponent implements OnInit, AfterViewInit, OnDestroy, DoCheck {

  selectedIndex;
  currentTabInfo: any;

  private outletDiv: HTMLElement;
  private subscription: Subscription = new Subscription();
  private differ: IterableDiffer<IDwTabRouteState>;
  private isStarted: boolean;
  private oldIframe: DwBaseIframeComponent[] = [];
  @ViewChildren(DwBaseIframeComponent) iframes: QueryList<DwBaseIframeComponent>;
  private messageHub: DwPostMessageHub;
  // @HostListener('window:beforeunload', ['$event'])
  // beforeUnloadHandler($event: any): boolean {
  //   this.storeTabs();
  //   return true;
  // }
  @HostBinding('hidden')
  get hidden(): boolean {
    return this.routeInfos.length === 0;
  }
  constructor(private routeInfoService: DwTabInfoService2,
              @Inject(DW_TAB_MULTI_OPEN) private multiOpen: boolean,
              private recursiveMenuService: DwRecursiveMenuService,
              private router: Router,
              private tabRouting: DwTabRoutingService,
              differs: IterableDiffers,
              private storageService: DwTabInfoStorageService,
              @Inject(DOCUMENT) private doc: any,
              private zone: NgZone,
              authService: DwAuthService,
              dwTenantService: DwTenantService,
              messageFactory: DwPostMessageFactoryService
  ) {
    let routeSnapshot: any = null;
    this.messageHub = messageFactory.getHubInstance();
    // 頁籤們變更的比對
    this.differ = differs.find(this.routeInfos).create<IDwTabRouteState>(this.trackByTabId);

    this.subscription.add(
      this.routeInfoService.tabSetIndexChanged.pipe(
        distinctUntilChanged()
      ).subscribe(
        (index: number) => {
          this.selectedIndex = index;
          this.currentTabInfo = this.routeInfoService.getTabState(this.selectedIndex);
          this.isStarted = true;
          if (this.currentTabInfo) {
            this.recursiveMenuService.onSelect(this.currentTabInfo.menuId, this.currentTabInfo.id);
          }
        }
      )
    );
    this.subscription.add(
      this.router.events.subscribe(
        event => {
          if (event instanceof ActivationStart && routeSnapshot === null) {
            if ((event as ActivationStart).snapshot.component) {
              routeSnapshot = (event as ActivationStart).snapshot.component;
            }
          }
          if (event instanceof ActivationEnd && routeSnapshot === null) {
            if ((event as ActivationEnd).snapshot.component) {
              routeSnapshot = (event as ActivationEnd).snapshot.component;
            }
          }
          if (event instanceof NavigationStart) {
            this.routeInfoService.tabSetStateArray[
              this.routeInfoService.previousIndex
              ].scrollTop = this.outletDiv.scrollTop;
          }
          if (event instanceof NavigationEnd) {
            this.storeTabs();
            this.outletDiv.scrollTop = this.routeInfoService.tabSetStateArray[
              this.routeInfoService.currentIndex
              ].scrollTop || 0;
            const tabChangeState = this.routeInfoService.tabChangeState;
            if (tabChangeState) {
              this.routeInfoService.tabRouterChanged.next({
                currentId: tabChangeState.currentTabId,
                previousId: tabChangeState.previousTabId,
                currentRouterLink: this.routeInfoService.currentTabInfo.routerLink,
                componentType: routeSnapshot.name,
                tabChanged: tabChangeState.tabChanged
              });
            } else {
              this.routeInfoService.tabRouterChanged.next(null);
            }
            routeSnapshot = null;
          }
        }
      )
    );

    this.subscription.add(
      authService.isLoggedIn$.subscribe(
        value => {
          if (!value) {
            this.clearStoredTabs();
          }
        }
      )
    );

    this.subscription.add(
      dwTenantService.isTokenValid$.subscribe(
        value => {
          if (!value) {
            this.clearStoredTabs();
          }
        }
      )
    );

  }

  get routeInfos(): Array<IDwTabRouteState> {
    return this.routeInfoService.tabSetStateArray;
  }

  ngOnInit(): void {
    // 建立第一個頁籤  載入預設頁籤
    this.routeInfoService.createFirstRouteFromCurrentRoute(this.getStoredTabs());
  }

  ngAfterViewInit(): void {
    const outletDiv = this.doc.querySelector('.for-tab-query-class');
    if (outletDiv) {
      this.outletDiv = outletDiv;
    } else {
      this.outletDiv = this.doc.documentElement || this.doc.body;
    }

    this.iframes.changes.subscribe((changes: QueryList<DwBaseIframeComponent>) => {
      this._handleReceives(changes);
    });
    if (this.iframes.length > 0) {
      this._handleReceives(this.iframes);
    }
  }

  private _handleReceives(changes: QueryList<DwBaseIframeComponent>): void {
    const iframes = changes.toArray();
    const add = iframes.filter((iframe: DwBaseIframeComponent) => {
      return this.oldIframe.indexOf(iframe) === -1;
    });
    const remove = this.oldIframe.filter((iframe: DwBaseIframeComponent) => {
      return iframes.indexOf(iframe) === -1;
    });
    add.forEach((iframeComponent: DwBaseIframeComponent) => {
      if (iframeComponent.iframe && iframeComponent.iframe.nativeElement) {
        const url = new URL(iframeComponent.iframe.nativeElement.src);
        this.messageHub.addReceiver(
          iframeComponent.iframe.nativeElement.contentWindow,
          `${url.protocol}//${url.host}`
        );
      } else {
        const subscription = iframeComponent.iframes.changes.pipe(first()).subscribe((iframe) => {
          const url = new URL(iframe.first.nativeElement.src);
          this.messageHub.addReceiver(
            iframe.first.nativeElement.contentWindow,
            `${url.protocol}//${url.host}`
          );
        });
      }
    });
    remove.forEach((iframeComponent: DwBaseIframeComponent) => {
      if (iframeComponent.iframe) {
        this.messageHub.removeReceiver(iframeComponent.iframe.nativeElement.contentWindow);
      }
    });

    this.oldIframe = [...iframes];
  }
  closeTab(index: number, $event: any): boolean {

    this.routeInfoService.close(index);

    // 阻止tab select的click
    $event.preventDefault();
    $event.stopPropagation();

    return false;
  }

  tabClick(index: number): void {
    this.routeInfoService.setCurrentIndex(index);
    this.selectedIndex = index;

  }

  showKeys(): void {
    console.log(this.routeInfos);
  }

  ngDoCheck(): void {

    const change = this.differ.diff(this.routeInfos);

    if (change) {

      // 發送建立頁籤的事件
      change.forEachAddedItem(tabState => {
        this.tabRouting.eventSubject.next(new DwTabOpen(
          tabState.item.tabId,
          tabState.item.currentUrl,
          tabState.item.id,
          tabState.item.module,
          tabState.item.type
        ));
        // 新增就給
      });

      // 發送移除頁籤的事件
      change.forEachRemovedItem(tabState => {
        this.tabRouting.eventSubject.next(new DwTabClose(
          tabState.item.tabId,
          tabState.item.currentUrl,
          tabState.item.id,
          tabState.item.module,
          tabState.item.type
        ));

      });

      this.storeTabs();

    }

  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.routeInfoService.destroy();
//    this.clearStoredTabs();
  }

  closeAll(): void {
    this.routeInfoService.closeAll();
  }

  trackByTabId(index: number, item: IDwTabRouteState): string {
    return item['tabId'];
  }

  tabSelected(info: IDwTabRouteState): void {

    const previousTab = this.routeInfoService.tabSetStateArray[this.routeInfoService.previousIndex];

    // 發送離開頁籤的事件
    this.tabRouting.eventSubject.next(new DwTabFocusout(
      previousTab.tabId,
      previousTab.currentUrl,
      previousTab.id,
      previousTab.module,
      previousTab.type
    ));

    // 發送進入頁籤的事件
    this.tabRouting.eventSubject.next(new DwTabFocusin(
      info.tabId,
      info.currentUrl,
      info.id,
      info.module,
      info.type
    ));

  }

  private getStoredTabs(): any {
    const storedTabs = this.storageService.get(TAB_STORED_KEY);
    if (storedTabs) {
      return JSON.parse(storedTabs);
    }
    return null;
  }

  private clearStoredTabs(): void {
    this.storageService.remove(TAB_STORED_KEY);
  }

  private storeTabs(): void {
    if (!this.isStarted) {
      return;
    }
    const storedTabs: StoredTabs = {
      tabs: [],
      currentIndex: this.selectedIndex
    };
    const tabsState = this.routeInfoService.tabSetStateArray;

    tabsState.forEach((state, index) => {

      storedTabs.tabs.push(<any>{
        id: state.id,
        tabId: state.tabId,
        opener: state.opener,
        lastPath: state.lastPath,
        menuId: state.menuId,
        title: state.title,
        queryParams: state.queryParams,
        routerLink: state.routerLink,
        type: state.type,
        currentUrl: state.currentUrl,
        defaultOpen: true,
        scrollTop: state.scrollTop,
        canClose: state.canClose,
        iconClass: state.iconClass
      });
//      const tempState: IDwTabRouteState = Object.assign({}, state);
//      delete tempState.navigateHistory;
//      storedTabs.tabs.push(tempState);
    });
    this.zone.runOutsideAngular(() => {
      setTimeout(() => this.storageService.set(TAB_STORED_KEY, JSON.stringify(storedTabs)));
    });

  }
}
