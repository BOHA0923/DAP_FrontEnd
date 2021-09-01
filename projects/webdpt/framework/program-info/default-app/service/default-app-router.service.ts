import { Injectable, Inject } from '@angular/core';
import { Params } from '@angular/router';

import { Observable, BehaviorSubject } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { APP_DEFAULT } from '@webdpt/framework/config';
import { DwTenantService } from '@webdpt/framework/user';
import { IDwDefaultAppInfo } from '../interface/default-app.interface';
import { DwOperationInfoService } from '@webdpt/framework/operation';
import { DwDefaultAppRepository } from '../repository/default-app-repository';
import { DwDefaultAppModule } from '../default-app.module';


/**
 * 首頁路由
 */
@Injectable({
  providedIn: DwDefaultAppModule
})
export class DwDefaultAppRouterService {
  private defaultAppRouterLinkSubject: BehaviorSubject<IDwDefaultAppInfo>; // 登入狀態調用API取首頁設定，非登入則是null

  constructor(
    @Inject(APP_DEFAULT) private DEFAULT_APP: string,
    private dwDefaultAppRepository: DwDefaultAppRepository,
    private dwOperationInfoService: DwOperationInfoService,
    private dwTenantService: DwTenantService
  ) {
    this.defaultAppRouterLinkSubject = new BehaviorSubject(null);

    this.dwTenantService.isTokenValid$.pipe(
      switchMap(
        (isTokenValid: boolean) => {
          if (isTokenValid) {
            return this.dwDefaultAppRepository.getMyHomeInfo('');
          } else {
            // 非登入
            return Observable.create(
              (observer: any) => {
                observer.next(null);
                observer.complete();
              }
            );
          }
        },
        (isTokenValid: boolean, info: IDwDefaultAppInfo) => {
          return info;
        }
      )
    ).subscribe(
      (info: IDwDefaultAppInfo) => {
        this.defaultAppRouterLinkSubject.next(info);
      }
    );
  }

  /**
   * 首頁路由(已登入)
   */
  public get defaultAppRouterLink$(): Observable<string> {
    const obs = Observable.create(
      (observer: any) => {
        this.defaultAppInfo$.subscribe(
          (info: IDwDefaultAppInfo) => {
            let routerLink = info.routerLink;

            if (info.execType) {
              this.dwOperationInfoService.operationInfo$(info.programId, info.execType).subscribe(
                operationInfo => {
                  if (operationInfo.routerLink) {
                    routerLink = operationInfo.routerLink;

                    const queryParams: Params = info.queryParams;
                    let qStr = '';
                    Object.keys(queryParams).forEach(
                      key => {
                        qStr = qStr + '&' + key + '=' + queryParams[key];
                      }
                    );

                    if (routerLink && qStr) {
                      routerLink = routerLink + '?' + qStr.substr(1, qStr.length);
                    }
                  }

                  observer.next(routerLink);
                  observer.complete();
                }
              );
            } else {
              observer.next(routerLink);
              observer.complete();
            }
          }
        );
      }
    );

    return obs;
  }

  /**
   * 首頁設定資訊
   */
  public get defaultAppInfo$(): Observable<IDwDefaultAppInfo> {
    const obs: Observable<IDwDefaultAppInfo> = Observable.create(
      (observer: any) => {
        let subscription = null;
        subscription = this.defaultAppRouterLinkSubject.subscribe(
          (info: IDwDefaultAppInfo) => {
            if (info) { // 登入登出狀態不是真的改變而重覆廣播，會擾亂訂閱
              const defaultAppInfo = JSON.parse(JSON.stringify(info));

              if (!info.execType) {
                defaultAppInfo.routerLink = this.DEFAULT_APP;
              }

              observer.next(defaultAppInfo);
              observer.complete();

              if (subscription) {
                subscription.unsubscribe();
              }
            }
          }
        );
      }
    );

    return obs;
  }
}
