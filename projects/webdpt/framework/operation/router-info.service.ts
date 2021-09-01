import { Injectable } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { DwOperationModule } from './operation.module';



/**
 * 路由
 */
@Injectable({
  providedIn: DwOperationModule
})
export class DwRouterInfoService {

  constructor(
  ) { }

  /**
   * 路由資訊中的作業編號
   */
  public routerProgramId(activatedRoute: ActivatedRoute): string {
    let routerProgramId = null; // 作業編號
    const firstChild = activatedRoute.firstChild;
    const value = activatedRoute.data['value'];

    if (value['dwRouteData']) {
      if (value['dwRouteData'].hasOwnProperty('programId')) {
        routerProgramId = value['dwRouteData'].programId;
      }
    }

    if (!routerProgramId) {
      if (firstChild) {
        routerProgramId = this.routerProgramId(firstChild);
      } else {
        // 報表或外部連結的作業編號在路由參數中
        const params = activatedRoute.params['value'];

        if (params['programId']) {
          routerProgramId = params['programId'];
        }
      }
    }

    return routerProgramId;
  }

  /**
   * 路由快照中的作業編號
   * 頁籤僅能以ActivatedRouteSnapshot查詢
   */
  public routeSnapshotProgramId(activatedRouteSnapshot: ActivatedRouteSnapshot): string {
    let routerProgramId = null; // 作業編號

    // 通常路由會經過很多層才會抵達作業，所以反轉
    const pathFromRoot = activatedRouteSnapshot.pathFromRoot.reverse();
    let tempRoute: ActivatedRouteSnapshot;
    for (let i = 0; i < pathFromRoot.length; i++) {
      tempRoute = pathFromRoot[i];

      // 搜尋route config中的dwRouteData.programId
      if (
        tempRoute.routeConfig &&
        tempRoute.routeConfig.data &&
        tempRoute.routeConfig.data.dwRouteData &&
        tempRoute.routeConfig.data.dwRouteData.programId
      ) {
        routerProgramId = tempRoute.routeConfig.data.dwRouteData.programId;
        break;
      }
    }

    return routerProgramId;
  }
}
