import { Injectable } from '@angular/core';

import { Observable, Subscription, BehaviorSubject } from 'rxjs';
import { distinctUntilChanged, filter } from 'rxjs/operators';

import { IDwOperationInfoListService } from './interface/operation-info-list-service.interface';
import { IDwOperationMap } from './interface/program.interface';
import { DwProgramInfoListJsonService } from './program-info-list-json.service';
import { DwTenantService } from '@webdpt/framework/user';
import { DwOperationModule } from './operation.module';


@Injectable({
  providedIn: DwOperationModule
})
export class DwOperationInfoListService implements IDwOperationInfoListService {
  private operationSubject: BehaviorSubject<IDwOperationMap>;

  constructor(
    private programInfoListJsonService: DwProgramInfoListJsonService,
    private dwTenantService: DwTenantService
  ) {
    this.operationSubject = new BehaviorSubject<IDwOperationMap>(null);
    let subscription: Subscription;

    let isInit = false;
    this.dwTenantService.isTokenValid$.subscribe(
      value => {
        if (!value) {
          isInit = false;
          const operationMap: IDwOperationMap = null;
          this.operationSubject.next(operationMap);
          if (subscription) {
            subscription.unsubscribe();
          }
        } else if (!isInit) {
          isInit = true;

          subscription = this.programInfoListJsonService.programListJsonMap$.subscribe(
            (operationMap: IDwOperationMap) => {
              this.operationSubject.next(operationMap);
            },
            error => {
              console.log(error);
              this.operationSubject.next({});
            }
          );
        }
      }
    );
  }

  /**
   * 取得作業清單
   */
  get operationListMap$(): Observable<IDwOperationMap> {
    return this.operationSubject.asObservable().pipe(
      filter(obsData => obsData !== null), // 不廣播初始值
      distinctUntilChanged() // 有改變時才廣播
    );
  }
}
