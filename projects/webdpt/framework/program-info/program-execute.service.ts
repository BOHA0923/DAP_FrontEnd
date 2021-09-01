import { Injectable, Inject } from '@angular/core';
import { Router, Params, ActivatedRoute, NavigationExtras } from '@angular/router';
import { Subject } from 'rxjs';

import { DwOperationInfoService } from '@webdpt/framework/operation';
import { DW_USING_TAB } from '@webdpt/framework/config';
import { DwDefaultAppRouterService } from './default-app/service/default-app-router.service';
import { IDwDefaultAppInfo } from './default-app/interface/default-app.interface';
import { DwLanguagePreService } from './language-pre.service';
import { DwProgramInfoModule } from './program-info.module';


/**
 * 執行作業
 *
 * @export
 */
@Injectable({
  providedIn: DwProgramInfoModule
})
export class DwProgramExecuteService {

  executeTabProgram$: Subject<any> = new Subject();

  constructor(
    private router: Router,
    public activatedRoute: ActivatedRoute,
    @Inject(DW_USING_TAB) private _usingTab: boolean,
    private dwLanguagePreService: DwLanguagePreService,
    private dwOperationInfoService: DwOperationInfoService,
    private dwDefaultAppRouterService: DwDefaultAppRouterService
  ) { }

  /**
   * 依作業編號執行
   */
  public byId(programId: string, queryParams?: Params): void {
    if (programId !== '') {
      this.dwOperationInfoService.operationInfo$(programId).subscribe(
        operationInfo => {
          this.exec('', programId, operationInfo.type, operationInfo.routerLink, queryParams);
        }
      ).unsubscribe();
    }
  }

  /**
   * Menu 執行作業
   *
   * @param menuType 作業='program', 'fineReport':報表, 外部網頁(另開)='externalUrl'
   * @param menuId 選單編號
   * @param programId 作業編號
   * @param [queryParams] 作業參數
   */
  public byMenu(menuType: string, menuId: string, programId: string, queryParams?: Params): void {
    if (menuId !== '') {
      if (!programId) { // 外部連結
        programId = menuId;
      }

      if (programId !== '') {
        this.dwOperationInfoService.operationInfo$(programId, menuType).subscribe(
          operationInfo => {
            if (operationInfo.routerLink) {
              const title = this.dwLanguagePreService.menu + menuId;
              this.exec(menuType, programId, operationInfo.type, operationInfo.routerLink, queryParams, title, menuId);
            }
          }
        ).unsubscribe();
      }
    }
  }

  private exec(execType: string, programId: string, programType: string, routerLink: string,
    queryParams?: Params, title?: string, menuId?: string
  ): boolean {
    if (programId !== '') {
      if (this._usingTab) {
        if (!menuId) {
          menuId = '';
        }

        if (programType === 'externalUrl') {
          execType = programType;
        }

        const routeInfo: any = {
          type: execType,
          id: programId,
          title: title,
          menuId: menuId,
          routerLink: routerLink,
          queryParams: queryParams
        };
        this.executeTabProgram$.next(routeInfo);
      } else {
        // 導航額外選項
        const navigationExtras: NavigationExtras = {
          relativeTo: this.activatedRoute, // 相對路徑導頁
          queryParams: queryParams
        };
        this.router.navigate([routerLink], navigationExtras);
      }

      return true;
    } else {
      return false;
    }
  }

  /**
   * 回首頁
   *
   * @param [otherQueryParams] 額外參數
   */
  public goHome(otherQueryParams?: Params): void {
    this.dwDefaultAppRouterService.defaultAppInfo$.subscribe(
      (info: IDwDefaultAppInfo) => {
        if (info.programId) {
          const programId = info.programId;
          const menuType = info.execType;
          const title = this.dwLanguagePreService.program + 'dw-home';
          const queryParams = Object.assign({}, info.queryParams);

          // 加上外部傳來的額外參數，例如SSO時傳入
          if (otherQueryParams) {
            Object.keys(otherQueryParams).forEach(
              (otherKey: string) => {
                let exist = false;

                Object.keys(info.queryParams).forEach(
                  (key: string) => {
                    if (key === otherKey) {
                      exist = true;
                    }
                  }
                );

                if (!exist) {
                  queryParams[otherKey] = otherQueryParams[otherKey];
                }
              }
            );
          }

          if (programId !== '') {
            this.dwOperationInfoService.operationInfo$(programId, menuType).subscribe(
              operationInfo => {
                if (operationInfo.routerLink) {
                  const navigationExtras: NavigationExtras = {
                    relativeTo: this.activatedRoute, // 相對路徑導頁
                    queryParams: queryParams
                  };
                  this.router.navigate([operationInfo.routerLink], navigationExtras);
                  // this.exec(menuType, programId, operationInfo.type, operationInfo.routerLink, queryParams, title, '');
                }
              }
            ).unsubscribe();
          }
        } else {
          this.router.navigateByUrl(info.routerLink);
        }
      }
    );
  }
}
