import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { DwModalService } from 'ng-quicksilver/modal';
import { TranslateService } from '@ngx-translate/core';

import { DwTenantService } from '@webdpt/framework/user';
import { DwUserService } from '@webdpt/framework/user';
import { DwDefaultAppRouterService } from '@webdpt/framework/program-info';

@Component({
  selector: 'dw-tenant-block',
  templateUrl: './tenant-block.component.html',
  styleUrls: ['./tenant-block.component.less']
})

export class DwTenantBlockComponent implements OnInit, OnDestroy {
  userDetail: any = {}; // 登入者詳細資料.
  currTenantList = []; // 租戶清單.

  private tenantSubscription: Subscription;
  visibleFromIcon: boolean;
  visibleFromTitle: boolean;

  constructor(
    private userService: DwUserService,
    private dwModalService: DwModalService,
    private translateService: TranslateService,
    private dwTenantService: DwTenantService,
    private defaultAppRouterService: DwDefaultAppRouterService
  ) {
    // 當 sesstion storage 值改變後, this.userDetail 也會跟著改變.
    this.userDetail = this.userService.getUserInfo();
  }


  ngOnDestroy(): void {
    // 對服務 subscribe() 的要解除, 如果是 httpClient 或是 router 則不用.
    if (this.tenantSubscription) {
      this.tenantSubscription.unsubscribe();
    }
  }

  ngOnInit(): void {
    // 取得租戶清單
    this.tenantSubscription = this.dwTenantService.currTenantList$.subscribe(
      lists => {
        this.currTenantList = lists;
      }
    );
  }

  /**
   * 改變租戶清單
   */
  changeTenant(tenantSid: number): void {
    if (this.userDetail.tenantSid === tenantSid) {
      return;
    }

    this.dwModalService.confirm({
      dwIconType: 'exclamation-circle',
      dwTitle: this.translateService.instant('dw-tenant-changeTenant-title'),
      dwContent: this.translateService.instant('dw-tenant-changeTenant-content'),
      dwOnOk: (): void => {
        // 改變租戶時, 關閉租戶選單.
        this.visibleFromIcon = false;
        this.visibleFromTitle = false;

        // 只是改變租戶, 並非跑登入程序.
        this.dwTenantService.tokenRefreshTenant(tenantSid).subscribe(
          () => {
            this.defaultAppRouterService.defaultAppRouterLink$.subscribe(
              routerLink => {
                window.location.href = routerLink;
              }
            );
        });
      }
    });

  }

}
