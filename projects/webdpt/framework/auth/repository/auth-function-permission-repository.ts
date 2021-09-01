import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { IDwAuthFunctionPermissionRepository } from '../interface/auth-function-permission-repository.interface';
import { DwOperationInfoListService } from '@webdpt/framework/operation';
import { IDwOperationMap, IDwProgram } from '@webdpt/framework/operation';
import { DwAuthModule } from '../auth.module';

/**
 * IAM權限中心資料
 */
@Injectable({
  providedIn: DwAuthModule
})
export class DwAuthFunctionPermissionRepository implements IDwAuthFunctionPermissionRepository {
  constructor(
    private dwOperationInfoListService: DwOperationInfoListService
  ) {
  }

  public getFunctionPermissionAll(): Observable<any> {
    return Observable.create(
      (observer: any) => {
        this.dwOperationInfoListService.operationListMap$.subscribe(
          (operationListMap: IDwOperationMap) => {
            const response = {
              data: []
            };

            Object.keys(operationListMap).forEach(
              key => {
                const source: IDwProgram = operationListMap[key];
                const dataItem = {
                  code: key,
                  page: [],
                  action: []
                };

                if (source.hasOwnProperty('page')) {
                  source.page.forEach(
                    pageItem => {
                      const operationPage = {
                        id: pageItem.id,
                        restriction: 'allow'
                      };

                      dataItem.page.push(operationPage);
                    }
                  );
                }

                if (source.hasOwnProperty('action')) {
                  source.action.forEach(
                    actionItem => {
                      const operationAction = {
                        id: actionItem.id,
                        restriction: 'allow'
                      };

                      dataItem.action.push(operationAction);
                    }
                  );
                }

                response.data.push(dataItem);
              }
            );

            observer.next(response);
            observer.complete();
          }
        );
      }
    );
  }
}
