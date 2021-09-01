import { Injectable, ComponentRef } from '@angular/core';
import { ActivatedRouteSnapshot, DetachedRouteHandle } from '@angular/router';
import { Location } from '@angular/common';


@Injectable()
export class DwTabRouteReuseService {

  private handlers: { [key: string]: DetachedRouteHandle } = {};
  deletedRouteKey: any[] = [];
  nowProgramId: string;
  constructor(private location: Location) { }

  clearHandlers(): void {
    this.handlers = {};
  }
  setHandler(key: any): void {
    for (const name in this.handlers) {
      if (this.handlers.hasOwnProperty(name)) {
        if (name.search(key) !== -1) {
          this.handlers[name] = null;
        }
      }
    }
  }
  isDeletedTab(route: ActivatedRouteSnapshot): boolean {
    let flag = false;
    if (route.params.hasOwnProperty('routeKey')) {
      for (let i = 0; i < this.deletedRouteKey.length; i++) {
        if (this.deletedRouteKey[i] === route.params.routeKey) {
          // console.log(this.deletedTabKey[i]);
          flag = true;
          break;
        }
      }
    }
    return flag;
  }
  /** reuse route strategy **/

  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    if (!route.routeConfig || route.routeConfig.loadChildren || route.routeConfig.children) {
      return false;
    }
    return true;
  }

  store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {
    const isDeletedTab = this.isDeletedTab(route);
    if (!route.routeConfig || route.routeConfig.loadChildren || route.routeConfig.children) {
      return;
    }

    const key = this.calcKey(route);
    if (key && handle) {
      if (!isDeletedTab && this.location.path().search('dwTabRouting') !== -1) { // 不是刪除的tab且在多頁籤狀態下
        this.handlers[key] = handle;
      } else {
        this.deactivateOutlet(handle); // 觸發component ngOnDestroy
        this.handlers[key] = null;
      }
      //  console.log(this.handlers[key]);
    }
  }
  private deactivateOutlet(handle: DetachedRouteHandle): void {
    const componentRef: ComponentRef<any> = handle['componentRef'];
    if (componentRef) {
      componentRef.destroy();
    }
  }
  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    if (!route.routeConfig || route.routeConfig.loadChildren || route.routeConfig.children) {
      return false;
    }

    const key = this.calcKey(route);
    if (key) {
      return !!this.handlers[key];
    }

    return false;
  }

  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle {
    if (route.data.dwRouteData && route.data.dwRouteData.programId) {
      this.nowProgramId = route.data.dwRouteData.programId;
    }
    if (!route.routeConfig || route.routeConfig.loadChildren || route.routeConfig.children) {
      return null;
    }

    const key = this.calcKey(route);
    if (key) {
      return this.handlers[key] || null;
    }
    return null;
  }

  shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    let flag = true;
    if (future.params.hasOwnProperty('routeKey') && curr.params.hasOwnProperty('routeKey')) {
      flag = future.params.routeKey === curr.params.routeKey;
    }
    return (future.routeConfig === curr.routeConfig) && flag;
  }

  getTruthRoute(route: ActivatedRouteSnapshot): any {
    let next = route;
    while (next.firstChild) {
      next = next.firstChild;
    }
    return next;
  }

  getUrl(route: ActivatedRouteSnapshot): string {
    let next = this.getTruthRoute(route);
    const segments = [];
    while (next) {
      segments.push(next.url.join('/'));
      next = next.parent;
    }
    const url = '/' + segments.filter(i => i).reverse().join('/');
    return url;
  }

  calcKey(route: ActivatedRouteSnapshot): string {
    let url: string = this.getUrl(route);
    // console.log(this.getUrl(route));
    if (route['_routerState'] && route['_routerState']['url']) {
      url = route['_routerState']['url'];
    }
    // console.log('calcKey', url);
    return url;
  }
}
