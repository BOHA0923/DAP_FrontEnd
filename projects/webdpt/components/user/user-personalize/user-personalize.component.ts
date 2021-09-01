import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { DwModalService } from 'ng-quicksilver/modal';
import { TranslateService } from '@ngx-translate/core';

import { DwUserService } from '@webdpt/framework/user';
import { DwProgramExecuteService } from '@webdpt/framework/program-info';
import { DwAuthPermissionInfoService } from '@webdpt/framework/auth';
import { IDwAuthorizedList } from '@webdpt/framework/auth';
import { DwLanguagePreService } from '@webdpt/framework/program-info';
import { DwUpdatePasswordModalService } from '@webdpt/components/modals/update-password';

@Component({
  selector: 'dw-user-personalize',
  templateUrl: './user-personalize.component.html',
  styleUrls: ['./user-personalize.component.less']
})

export class DwUserPersonalizeComponent implements OnInit, OnDestroy {
  public data = [];
  public userDetail: any = {}; // 登入者詳細資料
  public visibleFromTitle: boolean;
  private permissionSubscription: Subscription;
  private updatePasswordSubscription: Subscription;
  private programPre = this.dwLanguagePreService.program;

  constructor(
    private userService: DwUserService,
    private programExecuteService: DwProgramExecuteService,
    private dwAuthPermissionInfoService: DwAuthPermissionInfoService,
    private dwUpdatePasswordModalService: DwUpdatePasswordModalService,
    private dwLanguagePreService: DwLanguagePreService
  ) {
    this.userDetail = this.userService.getUserInfo();
  }


  ngOnDestroy(): void {
    if (this.permissionSubscription) {
      this.permissionSubscription.unsubscribe();
    }
  }

  ngOnInit(): void {
    const dataConfig = [
      {
        id: 'update-password',
        title: 'dw-update-password-title' // 修改密碼
      },
      {
        id: 'dw-home-setting',
        title: this.programPre + 'dw-home-setting',  // 首頁設定
        dwAuthId: 'dw-home-setting'
      }
    ];

    this.permissionSubscription = this.dwAuthPermissionInfoService.authorizedList$.subscribe(
      response => {
        if (response) {
          const authorizedList = <IDwAuthorizedList>response;

          dataConfig.forEach(
            dataItem => {
              if (dataItem.dwAuthId) {
                // 檢查使用者有權限的清單
                if (authorizedList[dataItem.dwAuthId] !== undefined) {
                  this.data.push(dataItem);
                }
              } else {
                this.data.push(dataItem);
              }
            }
          );
        }
      }
    );
  }

  public personalize(id: string): void {
    this.visibleFromTitle = false;
    switch (id) {
      case 'update-password':
        this.updatePassword();
        break;
      default:
        this.programExecuteService.byId(id);
        break;
    }

  }

  /**
   * 修改密碼
   *
   */
  updatePassword(): void {
    this.dwUpdatePasswordModalService.open().subscribe(
      (ret) => {
        console.log('ret>>>', ret);
      }
    );
  }
}
