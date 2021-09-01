import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, CanLoad, Route, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { DwAuthorizedService } from './authorized.service';
import { DwAuthService } from './auth.service';
import { DwAuthModule } from './auth.module';

@Injectable({
  providedIn: DwAuthModule
})
export class DwAuthGuardService implements CanActivate, CanLoad, CanActivateChild {

  // TODO: auth service -> authorized service()

  // 2020/04/06
  // DwAuthGuardService 的 DI 順序, 會造成向後端取權限時報錯,
  // 因為DwAuthorizedService會先DI DwAuthorizedService(DwDapAuthorizedService)-> DwAuthPermissionInfoService -> DwTenantService,
  // 結果 DwTenantService 在 constructor 裡, 在沒有確認 DwAuthService 是否拿到 userToken 時, 就直接發token 有效通知,
  // 造成 functionPermission 在沒有 userToken下就直接調用後端, 造成報錯,
  // => 解決方案, 要重新調整依賴關係

  constructor(
    private authService: DwAuthService,
    private authorizedService: DwAuthorizedService
  ) {
  }

  canLoad(route: Route): boolean | Observable<boolean> | Promise<boolean> {
    return this.authorizedService.canLoad(route.path);
  }

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.auth(childRoute, state);
  }

  canActivate(route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    // 是否登入及使用權限
    return this.auth(route, state);
  }

  private auth(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    // return this.authService.isAuthenticated(state) && this.authorizedService.canActivate(route);
    if (this.authService.isAuthenticated(state)) {
      return this.authorizedService.canActivate(route);
    } else {
      return false;
    }
  }
}
