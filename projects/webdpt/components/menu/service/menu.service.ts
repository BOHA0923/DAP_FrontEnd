import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { IDwMenu, IDwMenuConfigMap } from '../interface/menu.interface';
import { IDwMenuService } from '../interface/menu-service.interface';
import { DwMenuConfigService } from './menu-config.service';

/**
 * 取使用者選單，用於呈現
 */
@Injectable({ providedIn: 'root' })
export class DwMenuService implements IDwMenuService {

  constructor(
    private dwMenuConfigService: DwMenuConfigService,
  ) {
    this.dwMenuConfigService.init();
  }

  public menuAuthority(requestOptions?: any): Observable<any> {
    return this.dwMenuConfigService.menuAuthority();
  }

  public getMenu(): Observable<IDwMenu[]> {
    return this.dwMenuConfigService.getMenu();
  }

  public getMenuConfigMap(): Observable<IDwMenuConfigMap> {
    return this.dwMenuConfigService.getMenuConfigMap();
  }
}
