import { LoadChildren } from '@angular/router';

export interface DwModuleRoute {
  /**
   * 路由
   */
  path: string;
  /**
   * 模組路徑#模組名稱
   */
  module?: string;
  loadChildren: LoadChildren;
  /**
   * 是否需登入
   */
  auth?: boolean;
}
