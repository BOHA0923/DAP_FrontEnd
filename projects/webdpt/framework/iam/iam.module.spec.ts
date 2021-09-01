// 進行單一檔案測試時, 以下1行需開啟
// import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';

import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClient } from '@angular/common/http';

import { Observable, of } from 'rxjs';

import { TranslateService } from '@ngx-translate/core';

import { DwIamModule } from './iam.module';
import { DwHttpRequestUrlService } from '../http/service/http-request-url.service';
import { DwSystemConfigService } from '../config/config.service';
import { DwHttpMessageService } from '../http/service/dw-http-message.service';
import { DW_APP_AUTH_TOKEN, DW_APP_ID, LONIG_DEFAULT } from '../config/system.config';
import { DwHttpLoadMaskService } from '../http/service/dw-http-load-mask.service';
import { DwSystemHttpErrorHandler } from '../http/system-error';
import { DwHttpClientOptionsService } from '../http/service/http-client-options.service';

import { DwUserService } from '../user/user.service';
import { DwUserStorage } from '../user/user-storage';
import { DwIamUserService } from './iam-user.service';
import { DW_AUTH_TOKEN, DwAuthService } from '../auth/auth.service';
import { DwIamAuthService } from './iam-auth.service';
import { DwTenantService } from '../user/tenant.service';
import { DwIamTenantService } from './iam-tenant.service';
import { DwIamRepository } from './iam-repository';


describe(`ModuleTesting::DwIamModule::`, () => {
  let authService: DwAuthService = null;
  let tenantService: DwTenantService = null;
  let userService: DwUserService = null;

  // 呼叫 beforeEach() 來為每個 it() 測試準備前置條件，並依賴 TestBed 來建立類別和注入服務。
  // 每個 it() 都會跑一次 beforeEach()
  beforeEach(() => {
    // // 進行單一檔暗 testing 時, 會報錯  Cannot read property 'getComponentFromError' of null
    // // 需要利用以下這 2 行排除
    // TestBed.resetTestEnvironment();
    // TestBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());

    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([]),
        DwIamModule
      ],
      providers: [
        { provide: DW_AUTH_TOKEN, useValue: {} },
        { provide: DW_APP_AUTH_TOKEN, useValue: '' },
        { provide: DW_APP_ID, useValue: '' },
        { provide: TranslateService, useFactory: (): any => {} },
        { provide: LONIG_DEFAULT, useValue: ''},
        { provide: DwHttpRequestUrlService, useFactory: (): any => {} },
        { provide: DwHttpMessageService, useFactory: (): any => {} },
        { provide: DwHttpLoadMaskService, useFactory: (): any => {} },
        { provide: DwSystemHttpErrorHandler, useFactory: (): any => {} },
        { provide: HttpClient, useFactory: (): any => {} },
        { provide: DwHttpClientOptionsService, useFactory: (): any => {} },
        { provide: DwIamRepository, useFactory: (): any => {} },
        {
          provide: DwSystemConfigService,
          useFactory: (): any => {
            return {
              get(): Observable<any> {
                return of(null);
              }
            };
          }
        },
        {
          provide: DwUserStorage,
          useFactory: (): any => {
            return {
              get(): any {
                return null;
              }
            };
          }
        }
      ]
    });

  });


  it('DwAuthService should be [DwIamAuthService] service', () => {
    authService = TestBed.get(DwAuthService);
    expect(authService instanceof DwIamAuthService).toBeTruthy();
  });

  it('DwTenantService should be [DwIamTenantService] service', () => {
    tenantService = TestBed.get(DwTenantService);
    expect(tenantService instanceof DwIamTenantService).toBeTruthy();
  });

  it('DwUserService should be [DwIamUserService] service', () => {
    userService = TestBed.get(DwUserService);
    expect(userService instanceof DwIamUserService).toBeTruthy();
  });


});
