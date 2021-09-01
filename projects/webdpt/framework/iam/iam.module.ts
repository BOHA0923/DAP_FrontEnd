import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DwHttpModule } from '@webdpt/framework/http';

import { DwIamAuthService } from './iam-auth.service';
import { DwIamTenantService } from './iam-tenant.service';

import { DwIamUserService } from './iam-user.service';
import { DwAuthService } from '@webdpt/framework/auth';
import { DwTenantService } from '@webdpt/framework/user';
import { DwUserService } from '@webdpt/framework/user';
import { DwSsoTokenRefreshService } from './sso/sso-token-refresh.service';
import { DwSsoService } from './sso/sso.service';
import { DW_SSO_LOGIN } from '@webdpt/framework/config';


@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
    { // 登入驗證用
      provide: DwAuthService,
      useClass: DwIamAuthService
    },
    { //  租戶
      provide: DwTenantService,
      useClass: DwIamTenantService
    },
    {
      provide: DwUserService,
      useClass: DwIamUserService
    },
    DwSsoTokenRefreshService,
    DwSsoService,
    {
      provide: DW_SSO_LOGIN,
      useClass: DwSsoService,
      multi: true
    }
  ],
  exports: [
    DwHttpModule
  ]
})
export class DwIamModule { }
