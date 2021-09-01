import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { filter, distinctUntilChanged } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';

import { IDwAuthorizedList } from './model/authorized.model';
import { DwAuthFunctionPermissionRepository } from './repository/auth-function-permission-repository';
import { DwTenantService } from '@webdpt/framework/user';
import { DwAuthModule } from './auth.module';

/**
 * 權限中心資料
 */
@Injectable({
  providedIn: DwAuthModule
})
export class DwAuthPermissionInfoService {
  isPermissionInit: boolean = false;
  authorizedList: IDwAuthorizedList; // 作業與功能權限
  authorizedListSubject: BehaviorSubject<IDwAuthorizedList>;

  constructor(
    public dwTenantService: DwTenantService,
    public dwAuthFunctionPermissionRepository: DwAuthFunctionPermissionRepository,
  ) {
    this.authorizedList = null;
    this.authorizedListSubject = new BehaviorSubject<IDwAuthorizedList>(this.authorizedList);

    this.dwTenantService.isTokenValid$.subscribe(
      value => {
        if (!value) {
          this.clearPermissTree();
        } else if (!this.isPermissionInit) {

          this.isPermissionInit = true;

          this.authorizedList = {}; // 作業與功能權限

          this.dwAuthFunctionPermissionRepository.getFunctionPermissionAll().subscribe(
            (response: any) => {
              const home = { // 向下相容舊版 v2.0.2 首頁權限
                'code': 'home',
                'page': [],
                'action': []
              };
              const respData: Array<any> = response.data;
              respData.push(home);

              respData.forEach(
                resp => {
                  // 作業功能按鈕
                  if (resp.hasOwnProperty('action')) {
                    resp.action.forEach(
                      respAction => {
                        if (respAction === '') {
                          respAction = 'disabled';
                        }
                      }
                    );
                  }

                  const mainPage = {
                    programId: resp.code,
                    action: resp.action ? resp.action : []
                  };

                  this.authorizedList[resp.code] = mainPage;

                  // 作業內部頁面
                  if (resp.hasOwnProperty('page')) {
                    const pageLen = resp.page.length;
                    for (let j = 0; j < pageLen; j++) {
                      if (resp.page[j].restriction === 'allow') {
                        const otherPage = {
                          programId: mainPage.programId,
                          action: resp.action ? resp.action : []
                        };

                        otherPage.action = [];

                        this.authorizedList[resp.page[j].id] = otherPage;
                      }
                    }
                  }
                }
              );

              this.authorizedListSubject.next(this.authorizedList);
            },
            (error: any) => {
              console.log(error);
              this.authorizedList = undefined;
              this.authorizedListSubject.next(this.authorizedList);
              this.clearPermissTree(); // 清空，避免再次登入時誤以為有error
            }
          );
        }
      },
      error => {
        console.log(error);
        this.clearPermissTree();
      }
    );
  }

  /**
   * 取作業與功能權限
   * null：登出時未取權限, []:已登入時無權限, undefined: 發生http error
   */
  get authorizedList$(): Observable<IDwAuthorizedList> {
    return this.authorizedListSubject.asObservable().pipe(
      filter(obsData => obsData !== null), // 不廣播初始值
      distinctUntilChanged() // 有改變時才廣播
    );
  }

  /**
   * 清除權限資料
   */
  private clearPermissTree(): void {
    this.isPermissionInit = false;
    // 清空權限中心資料
    // this.iamTree = [];
    // this.iamSubject.next(this.iamTree);
    // 清空作業與功能權限
    // this.setAuthorizedList(null, true);
    this.authorizedList = null; // null：登出時未取權限, []:已登入時無權限, undefined: 發生http error
    this.authorizedListSubject.next(this.authorizedList);
  }
}
