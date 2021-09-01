import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';

import { DwProgramInfoListJsonService, IDwOperationMap } from '@webdpt/framework/operation';
import { IDwMenu, IDwMenuConfigMap, IDwMenuService } from '@webdpt/components/menu';
import { DwMenuConfigService } from '@webdpt/components/menu';
import { DwCmsMenuConfigService } from './cms-menu-config.service';

/**
 * 取使用者選單，用於呈現
 */
@Injectable()
export class DwCmsMenuService implements IDwMenuService {
  private menuConfigService: DwMenuConfigService | DwCmsMenuConfigService;

  constructor(
    private injector: Injector,
    private dwProgramInfoListJsonService: DwProgramInfoListJsonService,
  ) {
    // 有使用系統選單設定作業'dw-sys-menu'，資料來源採用動態Menu(API)，否則採用前端靜態Menu(JSON)
    this.dwProgramInfoListJsonService.programListJsonMap$.subscribe(
      (operationMap: IDwOperationMap) => {
        if (operationMap['dw-sys-menu']) {
          this.menuConfigService = this.injector.get(DwCmsMenuConfigService);
          this.menuConfigService.init();
        } else {
          this.menuConfigService = this.injector.get(DwMenuConfigService);
          this.menuConfigService.init();
        }
      },
      error => {
        console.log(error);
        this.menuConfigService = this.injector.get(DwMenuConfigService);
        this.menuConfigService.init();
      }
    );
  }

  public menuAuthority(requestOptions?: any): Observable<any> {
    return this.menuConfigService.menuAuthority(requestOptions);
  }

  public getMenu(): Observable<IDwMenu[]> {
    return this.menuConfigService.getMenu();
  }

  public getMenuConfigMap(): Observable<IDwMenuConfigMap> {
    return this.menuConfigService.getMenuConfigMap();
  }
}
