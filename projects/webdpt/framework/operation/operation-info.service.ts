import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Params } from '@angular/router';

import { Observable, BehaviorSubject } from 'rxjs';
import { filter, distinctUntilChanged, map } from 'rxjs/operators';

import { IDwProgram, IDwProgramData } from './interface/program.interface';
import { IDwOperationInfoService } from './interface/operation-info-service.interface';
import { DwOperationInfoListService } from './operation-info-list.service';
import { DwRouterInfoService } from './router-info.service';
import { DwProgramInfoListJsonService } from './program-info-list-json.service';
import { DwOperationModule } from './operation.module';


@Injectable({
  providedIn: DwOperationModule
})
export class DwOperationInfoService implements IDwOperationInfoService {
  constructor(
    private dwOperationInfoListService: DwOperationInfoListService,
    private dwProgramInfoListJsonService: DwProgramInfoListJsonService,
    private dwRouterInfoService: DwRouterInfoService
  ) {
  }

  /**
   * 取得作業資訊
   */
  operationInfo$(programId: string, executeType?: string): Observable<IDwProgram> {
    const programSubject = new BehaviorSubject<IDwProgram>(null);

    let program: IDwProgram = {
      module: '',
      type: '',
      routerLink: '',
      page: [],
      action: []
    };

    const programBase: IDwProgram = this.operationBaseByType(executeType, programId);

    if (programBase.type) {
      program = Object.assign({}, programBase);
      programSubject.next(program);
    } else {
      this.dwOperationInfoListService.operationListMap$.subscribe(
        list => {
          if (list !== null) {
            if (list[programId]) {
              program = list[programId];
            }
          }

          // 內嵌業務中台應用作業
          if (program.type === 'externalUrl') {
            const ssoProgramBase: IDwProgram = this.operationBaseByType(program.type, programId);

            if (ssoProgramBase.type) {
              program.type = ssoProgramBase.type;
              program.routerLink = ssoProgramBase.routerLink;
            }
          }

          programSubject.next(program);
        },
        error => {
          programSubject.next(program);
        },
      );
    }

    return programSubject.asObservable().pipe(
      filter(obsData => obsData !== null), // 不廣播初始值
      distinctUntilChanged() // 有改變時才廣播
    );
  }

  /**
   * 依類型從平台架構作業建立作業基礎資訊
   *
   * @param type 'fineReport','externalUrl'
   * @param programId 作業編號
   */
  public operationBaseByType(type: string, programId: string): IDwProgram {
    let programBase: IDwProgram = {
      module: '',
      type: '',
      routerLink: '',
      page: [],
      action: []
    };

    if (type) {
      const len = this.dwProgramInfoListJsonService.dwProgramInfoFrameworkJson.length;

      for (let i = 0; i < len; i++) {
        if (this.dwProgramInfoListJsonService.dwProgramInfoFrameworkJson[i].type === type) {
          programBase = Object.assign({}, this.dwProgramInfoListJsonService.dwProgramInfoFrameworkJson[i]);
          programBase.routerLink = programBase.routerLink + '/' + programId;
          break;
        }
      }
    }

    return programBase;
  }

  /**
   * 依路由路徑從平台架構作業建立作業基礎資訊
   *
   * @param routerLink 路由
   * @param programId 作業編號
   */
  private operationBaseByRouterLink(routerLink: string, programId: string): IDwProgram {
    if (routerLink.indexOf('/') !== 0) {
      routerLink = '/' + routerLink;
    }

    let programBase: IDwProgram = {
      module: '',
      type: '',
      routerLink: '',
      page: [],
      action: []
    };

    const len = this.dwProgramInfoListJsonService.dwProgramInfoFrameworkJson.length;

    for (let i = 0; i < len; i++) {
      if (this.dwProgramInfoListJsonService.dwProgramInfoFrameworkJson[i].routerLink === routerLink) {
        programBase = Object.assign({}, this.dwProgramInfoListJsonService.dwProgramInfoFrameworkJson[i]);
        programBase.routerLink = programBase.routerLink + '/' + programId;
        break;
      }
    }

    return programBase;
  }

  /**
   * 從路由資訊中的作業編號查作業資訊
   *
   * @param activatedRouteSnapshot 路由快照
   */
  public routerOperationInfo(activatedRouteSnapshot: ActivatedRouteSnapshot): Observable<IDwProgramData> {
    let programId = '';

    const programData: IDwProgramData = {
      id: programId,
      module: '',
      type: '',
      routerLink: '',
      page: [],
      action: []
    };

    const params = activatedRouteSnapshot.params;
    if (params.hasOwnProperty('programId')) {
      programId = params.programId;
      const pathUrls = [];
      let _ar = activatedRouteSnapshot;
      while (_ar) {
        if (_ar.url.length > 0) {
          pathUrls.unshift(_ar.url[0].path);
        }
        _ar = _ar.parent;
      }
      if (pathUrls.length > 0) {
        const subPath = pathUrls.join('/');
        const programBase = this.operationBaseByRouterLink(subPath, programId);
        programData.id = programId;
        programData.module = programBase.module;
        programData.type = programBase.type;
        programData.routerLink = programBase.routerLink;
      }

      const obs = Observable.create(
        (observer: any) => {
          observer.next(programData);
          observer.complete();
        }
      );

      return obs;
    } else {
      programId = this.dwRouterInfoService.routeSnapshotProgramId(activatedRouteSnapshot);

      return this.operationInfo$(programId).pipe(
        map(
          programMapItem => {
            programData.id = programId;
            programData.module = programMapItem.module;
            programData.type = programMapItem.type;
            programData.routerLink = programMapItem.routerLink;

            return programData;
          }
        )
      );
    }
  }

  /**
   * 參數是否相同
   *
   * @param param1 參數
   * @param diffParam 比對參數
   */
  public isParamEqual(param1: Params, diffParam: Params): boolean {
    let isEqual = false; // 是否相同

    const queryParams1 = param1;
    const queryParams2 = diffParam;
    const count1 = Object.keys(queryParams1).length;
    const count2 = Object.keys(queryParams2).length;

    if (count1 === count2) {
      if (count1 === 0) {
        isEqual = true;
      } else {
        let checkCount = count1;

        Object.keys(queryParams1).forEach(
          (key1: string) => {
            const valInParam2 = queryParams2[key1];
            if (valInParam2 !== undefined) {
              if (valInParam2 === queryParams1[key1]) {
                checkCount = checkCount - 1;
              }
            }
          }
        );

        if (checkCount === 0) {
          isEqual = true;
        }
      }
    }

    return isEqual;
  }
}
