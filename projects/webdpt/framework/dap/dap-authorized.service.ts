import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';

import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { IDwAuthorizedService } from '@webdpt/framework/auth';
import { IDwAuthorizedList } from '@webdpt/framework/auth';
import { DwAuthPermissionInfoService } from '@webdpt/framework/auth';
import { DwDapAuthorizedMessageService } from './dap-authorized-message.service';


/**
 * 路由檢查權限
 *
 * @export
 */
@Injectable()
export class DwDapAuthorizedService implements IDwAuthorizedService {
  constructor(
    private authPermissionInfoService: DwAuthPermissionInfoService,
    private dwDapAuthorizedMessageService: DwDapAuthorizedMessageService
  ) {
  }

  canLoad(url: string): Observable<boolean> | Promise<boolean> | boolean {
    return true;
  }

  /**
   * 路由是否可啟用
   */
  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.authPermissionInfoService.authorizedList$.pipe(
      map(
        response => {
          // null：登出時未取權限, []:已登入時無權限, undefined: 發生http error
          // 等登入後的廣播取得權限資料再進入判斷
          if (response) {
            const authorizedList = <IDwAuthorizedList>response;
            let isActive = false;
            let dwAuthId = '';

            const dwRouteData = route.data.dwRouteData;

            if (dwRouteData) {
              if (dwRouteData.hasOwnProperty('dwAuthId')) {
                dwAuthId = dwRouteData.dwAuthId;

                if (authorizedList !== undefined) {
                  if (authorizedList[dwAuthId] !== undefined) {
                    isActive = true;
                  }
                }
              } else {
                isActive = true;
              }
            } else {
              isActive = true;
            }

            this.dwDapAuthorizedMessageService.canActivateMessage(isActive, dwAuthId);
            return isActive;
          }
        }
      ),
      catchError((error: any, msg: Observable<any>): any => {
        const isActive = false;

        return Observable.create(
          (observer: any) => {
            observer.next(isActive);
            observer.complete();
          }
        );
      })
    );
  }
}
