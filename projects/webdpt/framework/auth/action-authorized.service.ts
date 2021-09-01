import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { IDwActionAuthorizedService } from './interface/action-authorized-service.interface';

import { DwAuthModule } from './auth.module';
import { DwAuthPermissionInfoService } from './auth-permission-info.service';
import { IDwAuthorizedList, IDwAuthorizedItem, IDwAuthorizedAction } from './model/authorized.model';

@Injectable({
  providedIn: DwAuthModule
})
export class DwActionAuthorizedService implements IDwActionAuthorizedService {

  constructor(private authPermissionInfoService: DwAuthPermissionInfoService) {
  }

  /**
   * 取得功能權限
   *
   * @param dwAuthorizedId 作業權限ID
   * @param dwActionId 功能按鈕權限ID，權限擴展至作業或子頁面層級
   */
  public getActionAuth(dwAuthorizedId: string, dwActionId: string): Observable<string> {
    return Observable.create(
      (observer: any) => {
        let restriction: string = null;

        this.authPermissionInfoService.authorizedList$.pipe().subscribe(
          response => {
            const authorizedList: IDwAuthorizedList = <IDwAuthorizedList>response; // 作業與功能權限
            const authorized: IDwAuthorizedItem = authorizedList[dwAuthorizedId];

            if (authorized) {
              let action: IDwAuthorizedAction[] = [];

              // 功能按鈕權限記錄在作業中，如果是子頁面就要以作業編號找功能權限
              if (authorized.programId === dwAuthorizedId) {
                action = authorized.action;
              } else {
                const programAuthorized = authorizedList[authorized.programId];
                if (programAuthorized) {
                  action = programAuthorized.action;
                }
              }

              action = action.filter(
                value => {
                  return value.id === dwActionId;
                }
              );

              // 功能權限
              if (action.length === 1) {
                if (action[0].hasOwnProperty('id') && action[0].hasOwnProperty('restriction')) {
                  restriction = action[0].restriction;
                }
              } else {
                // 權限擴展至作業或子頁面層級
                const upperAuthorized = authorizedList[dwActionId];

                if (upperAuthorized) {
                  restriction = 'allow'; // 允許
                }
              }
            }

            observer.next(restriction);
            observer.complete();
          },
          (error: any) => {
            observer.complete();
            console.log(dwAuthorizedId + '(' + dwActionId + '):');
            console.log(error);
          }
        );
      }
    );
  }
}
