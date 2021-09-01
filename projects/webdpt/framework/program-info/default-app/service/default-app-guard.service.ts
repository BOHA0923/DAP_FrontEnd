import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, Params } from '@angular/router';

import { Observable } from 'rxjs';

import { DwDefaultAppRouterService } from './default-app-router.service';
import { DwProgramExecuteService } from '../../program-execute.service';
import { DwDefaultAppModule } from '../default-app.module';


@Injectable({
  providedIn: DwDefaultAppModule
})
export class DwDefaultAppGuardService implements CanActivate {

  constructor(
    private defaultAppRouterService: DwDefaultAppRouterService,
    private dwProgramExecuteService: DwProgramExecuteService
  ) {
  }

  /**
   * 應用首頁守門員
   *
   * 自訂首頁和產品應用首頁不允許共存：
   * 1.提供首頁canActivate專屬的DwDefaultAppGuardService，避免其它路由做不必要的判斷
   * 2.DwDefaultAppGuardService必須在路由守門員之後運作，以確保是登入狀態，才能調用API
   * 3.當下路由如果和首頁設定的路由不同，則重新導頁至所設定的首頁
   */
  canActivate(route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return Observable.create(
      (observer: any) => {
        this.defaultAppRouterService.defaultAppRouterLink$.subscribe(
          routerLink => {
            // 不含參數的網址
            const urlArr = state.url.split('?');
            const url = urlArr[0];
            const otherQueryParams: Params = {};

            if (urlArr.length === 2) {
              const paramsArr = urlArr[1].split('&');

              paramsArr.forEach(
                (item: string) => {
                  const itemArr = item.split('=');
                  if (itemArr.length === 2) {
                    otherQueryParams[itemArr[0]] = itemArr[1];
                  } else if (itemArr.length === 1) {
                    otherQueryParams[itemArr[0]] = '';
                  }
                }
              );
            }

            if (url === routerLink) {
              observer.next(true);
            } else {
              this.dwProgramExecuteService.goHome(otherQueryParams);
              observer.next(false);
            }

            observer.complete();
          }
        );
      }
    );
  }
}
