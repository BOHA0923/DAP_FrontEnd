import { Injectable, Inject } from '@angular/core';

import { Observable } from 'rxjs';

import { TranslateService } from '@ngx-translate/core';

import { DwHttpMessageService } from '@webdpt/framework/http';
import { DwOrganizeTreeService } from '@webdpt/framework/organize-tree-core';
import { IDwOrgTreeDefault, IDwOrgTreeDataMode, DW_ORGTREE_MODAL_DEFAULT } from '@webdpt/framework/organize-tree-core';
import { DwTenantService } from '@webdpt/framework/user';
import { DwDapRepository } from '../dap/dap-repository';


@Injectable()
export class DwDapOrganizeTreeService extends DwOrganizeTreeService {
  constructor(
    private dwTenantService: DwTenantService,
    private dapRepository: DwDapRepository,
    private dwMessageService: DwHttpMessageService,
    private translateService: TranslateService,
    @Inject(DW_ORGTREE_MODAL_DEFAULT) protected openOrgTreeModalDefault: IDwOrgTreeDefault<any>
  ) {
    super(openOrgTreeModalDefault);

    // 當收到 《token 無效》時, 要將 cache 清除 - cache 是租戶的組織.
    this.dwTenantService.isTokenValid$.subscribe((isTokenValid: boolean) => {
      if (isTokenValid === false) {
        this.resetCache();
      }
    });

  }


  /**
   * 取得組織樹資料.
   *
   */
  getOrganizeTree(config: IDwOrgTreeDataMode): Observable<any> {
    return new Observable((observer): void => {
      const _cache = this.getCache(config);
      if (_cache.length > 0 )  {
        observer.next(_cache);
        observer.complete();
        return;
      }

      const _params = {
        param: {
          catalogId: 'defaultOrgCatalog',
          id: 'defaultOrgAspect'
        },
        condition: {
          dataType: config.dataType // full 取組織+人 或  org 取組織
        }
      };

      this.dapRepository.getOrganizeTree(_params).subscribe(
        (respOrgtree) => {
          if (!respOrgtree.success) {
            this.dwMessageService.error(respOrgtree.description).subscribe();
            return;
          }

          if (!respOrgtree.datas || !respOrgtree.datas.length) {
            this.dwMessageService.warning(this.translateService.instant('dw-organize-tree-modal-nodata')).subscribe();
            return;
          }

          this.setCache(config, respOrgtree.datas);

          // 需回傳已經加工過的 treeData.
          observer.next(this.getCache(config));
          observer.complete();
        }
      );

    });


  }

  /**
   * 開窗時提供 reload cache.
   *
   */
  reloadCache(config: IDwOrgTreeDataMode): Observable<any> {
    this.resetCache();
    return this.getOrganizeTree(config);
  }


}
