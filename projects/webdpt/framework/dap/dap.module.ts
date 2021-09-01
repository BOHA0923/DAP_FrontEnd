import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DwHttpModule } from '@webdpt/framework/http';

import { DwIamModule } from '@webdpt/framework/iam';

import { DwDapAuthorizedService } from './dap-authorized.service';
import { DwAuthorizedService } from '@webdpt/framework/auth';
import { DwDapAuthorizedMessageService } from './dap-authorized-message.service';
import { DwDapAuthFunctionPermissionRepository } from './dap-auth-function-permission-repository';
import { DwAuthFunctionPermissionRepository } from '@webdpt/framework/auth';
import { DwDapDefaultAppModule } from './dap-default-app.module';
import { DwForgetService } from '@webdpt/framework/account';
import { DwDapForgetService } from './dap-forget.service';
import { DwUpdatePasswordService } from '@webdpt/framework/account';
import { DwDapUpdatePasswordService } from './dap-update-password.service';
import { DwDapAccountInfoService } from './dap-account-info.service';
import { DwAccountInfoService } from '@webdpt/framework/account';
import { DwDapAccountInfoDataSourceService } from './dap-account-info-data-source.service';
import { DwAccountInfoDataSourceService } from '@webdpt/framework/account';
import { DwDapAccountInfoUploadService } from './dap-account-info-upload.service';
import { DwAccountInfoUploadService } from '@webdpt/framework/account';
import { DwDapDocumentModule } from './document/dap-document.module';
import { DwDapOrganizeTreeService } from './dap-organize-tree.service';
import { DwOrganizeTreeService } from '@webdpt/framework/organize-tree-core';


@NgModule({
  imports: [
    CommonModule
  ],
  exports: [
    DwDapDocumentModule,
    DwIamModule,
    DwDapDefaultAppModule,
    DwHttpModule
  ],
  providers: [
    DwDapAuthorizedMessageService,
    DwDapAuthorizedService,
    { // 權限驗證，可抽換DwDapAuthorizedService
      provide: DwAuthorizedService,
      useExisting: DwDapAuthorizedService
    },
    DwDapAuthFunctionPermissionRepository,
    {
      provide: DwAuthFunctionPermissionRepository,
      useExisting: DwDapAuthFunctionPermissionRepository
    },
    DwDapForgetService,
    { //  忘記密碼
      provide: DwForgetService,
      useExisting: DwDapForgetService
    },
    DwDapUpdatePasswordService,
    { // 修改密碼
      provide: DwUpdatePasswordService,
      useExisting: DwDapUpdatePasswordService
    },
    DwDapAccountInfoService,
    { // 個人資料維護(動態表單)
      provide: DwAccountInfoService,
      useExisting: DwDapAccountInfoService
    },
    DwDapAccountInfoDataSourceService,
    { // 個人資料維護(資料源)
      provide: DwAccountInfoDataSourceService,
      useExisting: DwDapAccountInfoDataSourceService
    },
    DwDapAccountInfoUploadService,
    { // 個人資料維護(文檔上傳)
      provide: DwAccountInfoUploadService,
      useExisting: DwDapAccountInfoUploadService
    },
    DwDapOrganizeTreeService,
    { // 組織人員樹開窗
      provide: DwOrganizeTreeService,
      useExisting: DwDapOrganizeTreeService
    }
  ]

})

export class DwDapModule { }
