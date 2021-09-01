import { Params } from '@angular/router';

export interface IDwDefaultAppInfo {
  execType: string;
  programId: string;
  queryParams: Params;
  routerLink: string; // APP_DEFAULT 只有設定路由
}
