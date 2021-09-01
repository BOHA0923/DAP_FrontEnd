import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  // 提出去, 寫在 implementation-routing.module.ts 與 showcase-routing.module.ts 裡,
  // 以避免 與 DwLayoutDefaultComponent 所要執行的事件會衝突.
  // {
  //   path: 'sso-login',
  //   pathMatch: 'prefix',
  //   component: DwSsoLoginComponent
  // }
];

/**
 * An unhandled exception occurred: Error during template compile of 'DwDevToolRoutingModule'
 * Function calls are not supported in decorators but 'RouterModule' was called.
 * 參考它的作法：https://github.com/angular/angular/issues/23609#issuecomment-510871378
 */
export const ssoLoginRouteForChild = RouterModule.forChild(routes);

@NgModule({
  imports: [ssoLoginRouteForChild],
  exports: [RouterModule]
})
export class DwSsoLoginRoutingModule { }
