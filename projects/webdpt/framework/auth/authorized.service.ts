import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { IDwAuthorizedService } from './interface/authorized-service.interface';
import { DwAuthModule } from './auth.module';

/**
 * 驗證是否可以載入模組
 *
 * @export
 */
@Injectable({
  providedIn: DwAuthModule
})
export class DwAuthorizedService implements IDwAuthorizedService {

  constructor() { }

  /**
   * 是否可載入
   * @param  url 網址
   * @return  是否可載入
   */
  canLoad(url: string): Observable<boolean> | Promise<boolean> | boolean {
    return true;
  }

  /**
   * 路由是否可啟用
   *
   * @param route 透過Route帶入的驗證資訊
   * returns 路由是否可啟用
   */
  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return true;
  }
}
