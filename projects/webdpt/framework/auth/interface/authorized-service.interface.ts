import { ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

/**
 * 驗證是否可以載入模組
 *
 * @export
 */
export interface IDwAuthorizedService {
  /**
   * 是否可載入
   * @param  url 網址
   * @return  是否可載入
   */
  canLoad(url: string): Observable<boolean> | Promise<boolean> | boolean;

  /**
   * 路由是否可啟用
   *
   * @param  route 透過Route帶入的驗證資訊
   * returns  路由是否可啟用
   */
  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> | Promise<boolean> | boolean;
}
