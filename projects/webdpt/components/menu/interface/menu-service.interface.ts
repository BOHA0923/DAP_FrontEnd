import { Observable } from 'rxjs';

import { IDwMenu, IDwMenuConfigMap } from './menu.interface';


export interface IDwMenuService {
  /**
   * 使用者選單過濾權限資料
   */
  menuAuthority(requestOptions?: any): Observable<any[]>;
  /**
   * 取使用者選單，用於呈現
   */
  getMenu(): Observable<IDwMenu[]>;

  /**
   * 取得選單設定對應表
   */
  getMenuConfigMap(): Observable<IDwMenuConfigMap>;
}
