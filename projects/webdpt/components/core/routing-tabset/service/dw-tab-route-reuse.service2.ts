import { Injectable, Injector } from '@angular/core';
import { ActivatedRouteSnapshot, DetachedRouteHandle, RouteReuseStrategy } from '@angular/router';
import { DwTabInfoService2 } from '@webdpt/framework/routing-tabset';


function getResolvedUrl(route: ActivatedRouteSnapshot): string {
  const url = route.pathFromRoot
    .map(v => v.url.map(segment => segment.toString()).join('/'))
    .join('/');
  return url;
}

function getConfiguredUrl(route: ActivatedRouteSnapshot): string {
  const url = '/' + route.pathFromRoot
    .filter(v => v.routeConfig)
    // tslint:disable-next-line:no-non-null-assertion
    .map(v => v.routeConfig!.path)
    .join('/');
  return url;
}

@Injectable()
export class DwTabRouteReuseService2 implements RouteReuseStrategy {
  currentRoute: ActivatedRouteSnapshot;
  handlers: { [key: string]: DetachedRouteHandle } = {};
  deletedRouteKey: any[] = [];
  nowProgramId: string;

  static getTruthRoute(route: ActivatedRouteSnapshot): any {
    let next = route;
    while (next.firstChild) {
      next = next.firstChild;
    }
    return next;
  }

  static getUrl(route: ActivatedRouteSnapshot): string {
    let next = DwTabRouteReuseService2.getTruthRoute(route);
    const segments = [];
    while (next) {
      segments.push(next.url.join('/'));
      next = next.parent;
    }
    const url = '/' + segments.filter(i => i).reverse().join('/');
    return url;
  }

  static calcKey2(route: ActivatedRouteSnapshot): string {
    let url: string = DwTabRouteReuseService2.getUrl(route);
    if (route['_routerState'] && route['_routerState']['url']) {
      url = route['_routerState']['url'];
    }
    return url;
  }

  static getRoutePath(route: ActivatedRouteSnapshot): string {
    const path = route.pathFromRoot
      .map(r => r.routeConfig && r.routeConfig.path)
      //      .filter(path => !!path)
      .join('/');
    return path;
  }

  private _routeInfoService2: DwTabInfoService2 = null;

  private get routeInfoService2(): DwTabInfoService2 {
    if (this._routeInfoService2 === null) {
      this._routeInfoService2 = this.injector.get(DwTabInfoService2);
    }
    return this._routeInfoService2;
  }

  constructor(
    private injector: Injector
  ) {

  }

  /** reuse route strategy **/

  /**
   * 是否應該儲存
   */
  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    // TODO: 在路由上加一個不緩存的設置
    let shouldDetach = true;
    if (!route.routeConfig || !!route.routeConfig.loadChildren) {
      shouldDetach = false;
    }
    if (!route.component) {
      return false;
    }
    shouldDetach = this.routeInfoService2.shouldDetach(route) && shouldDetach;
    return shouldDetach;
  }

  private getStoreKey(route: ActivatedRouteSnapshot): string {
    const baseUrl = getResolvedUrl(route);
    const childrenParts = [];
    let deepestChild = route;
    while (deepestChild.firstChild) {
      deepestChild = deepestChild.firstChild;
      childrenParts.push(deepestChild.url.join('/'));
    }
    return baseUrl + '////' + childrenParts.join('/');
  }

  /**
   * 儲存， TODO: 這裡destroy已被標註待關閉的route
   */
  store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {
    if (!route.routeConfig || !!route.routeConfig.loadChildren) {
//    if (!route.routeConfig || route.routeConfig.loadChildren || route.routeConfig.children) {
      return;
    }
    if (handle) {
      this.routeInfoService2.store(route, handle);
    }
  }


  /**
   * 是否應該重新連結此路由
   */
  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    let shouldDetach = false;
    if (!route.component) {
      return false;
    }
    if (!route.routeConfig || !!route.routeConfig.loadChildren) {
//    if (!route.routeConfig || route.routeConfig.loadChildren || route.routeConfig.children) {
      shouldDetach = false;
    } else {

      shouldDetach = this.routeInfoService2.shouldAttach(route);
    }

    return shouldDetach;
  }

  /**
   * 取得儲存的路由
   */
  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle {

    if (route.data.dwRouteData && route.data.dwRouteData.programId) {
      this.nowProgramId = route.data.dwRouteData.programId;
    }

    if (!route.component) {
      return false;
    }

    if (!route.routeConfig) {
      return null;
    }
    if (!!route.routeConfig.loadChildren) {
      return null;
    }
//    if (route.routeConfig.children) {
//      return null;
//    }

    // TODO: 這裡可能會造成問，底下的判斷先註解，不註解會造成有子路由的父組件不會進route-info-service2
//    if (route.firstChild !== null) {
//      return null;
//    }

    this.currentRoute = route;

    if (true) {
      return this.routeInfoService2.retrieve(route);
    }
  }

  /**
   * Reuse the route if we're going to and from the same route
   * BUG: https://github.com/angular/angular/issues/16192
   * return false => retrieve => shouldDetach => store
   * return true => 直接用future route
   */
  shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    // TODO???:
    //  判斷curr路由與future在同一頁籤上
    //     ❌如果在，返回true，如果不在，返回false 不可行。

    // 如果使用參數路由/order/:id，則 future.routeConfig === curr.routeConfig 會失效，
    // 所以加上params的判斷
    let shouldReuse = future.routeConfig === curr.routeConfig &&
      JSON.stringify(future.params) === JSON.stringify(curr.params);
    const futureKey = future ? getConfiguredUrl(future) : null;
    const currKey = curr ? getConfiguredUrl(curr) : null;


    if (shouldReuse && (futureKey === currKey) && future.component) {
      const isUnderHosting = DwTabInfoService2.isUnderHosting(future);
      if (isUnderHosting === true) {

        if (this.routeInfoService2.isTabChanged) {
          return false;
        } else {
          return (futureKey === currKey);
        }
      }
    }

    shouldReuse = shouldReuse && (futureKey === currKey);
    return shouldReuse;
  }

  static routeToUrl(route: ActivatedRouteSnapshot): string {
    if (route.url) {
      if (route.url.length) {
        const arraysUrl = route.url.join('/');
        return arraysUrl;
      } else {
        if (typeof route.component === 'function') {
          return `[${route.component.name}]`;
        } else if (typeof route.component === 'string') {
          return `[${route.component}]`;
        } else {
          return `[null]`;
        }
      }
    } else {
      return '(null)';
    }
  }


  private static getChildRouteKeys(route: ActivatedRouteSnapshot): string {
    const url = this.routeToUrl(route);
    return route.children.reduce((fin, cr) => fin += this.getChildRouteKeys(cr), url);
  }

  private static getRouteKey(route: ActivatedRouteSnapshot): string {
    let url = route.pathFromRoot.map(it => this.routeToUrl(it)).join('/') + '*';
    url += route.children.map(cr => this.getChildRouteKeys(cr));
    return url;
  }
}
