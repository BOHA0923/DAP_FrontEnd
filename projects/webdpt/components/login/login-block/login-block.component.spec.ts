import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { shareTestNoUiModules } from '@webdpt/framework/sharedTest';

import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { Observable, of, throwError } from 'rxjs';
import { DwModalRef } from 'ng-quicksilver/modal';
import { DwModalService } from 'ng-quicksilver/modal';
import { DwAuthService } from '@webdpt/framework/auth';
import { DwUserService } from '@webdpt/framework/user';
import { DwRememberLoginService } from '../service/remember-login.service';
import { DwLanguageService } from '@webdpt/framework/language';
import { TranslateService } from '@ngx-translate/core';
import { DwTenantService } from '@webdpt/framework/user';
import { DwProgramExecuteService } from '@webdpt/framework/program-info';
import { DwSystemConfigService } from '@webdpt/framework/config/config.service';

import { DwLoginBlockModalService } from '../login-block-modal/service/login-block-modal.service';
import { DwLoginBlockModalServiceTest } from '../login-block-modal/testing/login-block-modal.service.test';
import { DW_APP_ID } from '@webdpt/framework/config';
import { DwLoginBlockComponent } from './login-block.component';

import { DwLanguageModule } from '../../language/language.module';

describe('DwLoginBlockComponent', () => {
  let component: DwLoginBlockComponent;
  let fixture: ComponentFixture<DwLoginBlockComponent>;
  let spyAuthLogin: jasmine.Spy;
  let spyAuthLogout: jasmine.Spy;
  let spyShowWarning: jasmine.Spy;
  let spyWindowOpen: jasmine.Spy;
  let spTranInstant: jasmine.Spy;
  const dwModalRef: DwModalRef = {
    afterOpen: of(null),
    afterClose: of(true),
    open: (): any => { },
    close: (): any => { },
    destroy: (): any => { },
    triggerOk: (): any => { },
    triggerCancel: (): any => { },
    getContentComponent: (): any => { },
    getElement: (): any => { },
    getInstance: (): any => { }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [...shareTestNoUiModules, DwLanguageModule],
      declarations: [DwLoginBlockComponent],
      providers: [
        {
          provide: Router, useValue: {
            navigateByUrl: (val: any): Promise<boolean> => {
              return new Promise((resolve): void => {
                resolve(true);
              });
            }
          },
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              queryParamMap: {
                get: (key: string): any => {
                  return `${key}-get`;
                }
              }
            },
            firstChild: null,
            params: of({}),
          }
        },
        FormBuilder,
        {
          provide: DwModalService, useValue: {
            create: (params: any): any => dwModalRef,
            error: (params: any): any => { }
          }
        },
        {
          provide: DwAuthService, useValue: {
            login: (user: any): Observable<any> => {
              return of({
                success: false,
                description: '您目前沒有被企業授權使用此應用'
              });
            },
            logout: (val: boolean): void => { }
          }
        },
        {
          provide: DwUserService, useValue: {
            getUser: (key: string): string => {
              return key;
            }
          }
        },
        {
          provide: DwRememberLoginService, useValue: {
            setRememberLogin: (params: any): void => { },
            getRememberLogin: (): any => {
              return {};
            }
          }
        },
        {
          provide: DwLanguageService, useValue: {
            currentLanguage: (): string => 'TW',
            setUp: (lan: string): void => { }
          }
        },
        {
          provide: DwTenantService, useValue: {
            currTenantList$: of([]),
            tokenRefreshTenant: (id: any): Observable<any> => of(true)
          }
        },
        {
          provide: DwProgramExecuteService, useValue: {
            goHome: (): void => { }
          }
        },
        {
          provide: DwSystemConfigService, useValue: {
            get: (key: any): Observable<any> => {
              return of(`${key}-get`);
            }
          }
        },
        { provide: DW_APP_ID, useValue: 'dwAppId' },
        {
          provide: DwLoginBlockModalService, useClass: DwLoginBlockModalServiceTest
        }
      ]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(DwLoginBlockComponent);
        component = fixture.componentInstance;
        const authService = fixture.debugElement.injector.get(DwAuthService);
        spyAuthLogin = spyOn(authService, 'login');
        spyAuthLogout = spyOn(authService, 'logout');
        const loginBlockModalService = fixture.debugElement.injector.get(DwLoginBlockModalService);
        spyShowWarning = spyOn(loginBlockModalService, 'showWarning');
        const translateService = fixture.debugElement.injector.get(TranslateService);
        spTranInstant = spyOn(translateService, 'instant');
        spyWindowOpen = spyOn(window, 'open');
        fixture.detectChanges();
      });
  }));

  it('DwLoginBlockComponent should create', () => {
    expect(component).toBeTruthy();
  });
  describe('登入沒有Error', () => {
    it('登入回傳訊息1:login>> data.success === false> description: 您目前沒有被企業授權使用此應用', () => {
      spyAuthLogin.and.returnValue(of({
        success: false,
        description: '您目前沒有被企業授權使用此應用'
      }));
      spTranInstant.and.returnValue('您目前沒有被企業授權使用此應用');
      spyShowWarning.and.returnValue(of(true));
      component.login();
      expect(spyAuthLogin).toHaveBeenCalled();
      expect(spyShowWarning).toHaveBeenCalled();
      expect(spyWindowOpen).toHaveBeenCalled();
      expect(spyWindowOpen.calls.argsFor(0)[0]).toContain('mang-enterprise/list');
      expect(spyAuthLogout).toHaveBeenCalled();
    });
    it('登入回傳訊息12:login>> data.success === false> description: 其它的description', () => {
      spyAuthLogin.and.returnValue(of({
        success: false,
        description: '其它的description'
      }));
      spTranInstant.and.returnValue('您目前沒有被企業授權使用此應用');
      let spyModalError: jasmine.Spy;
      const modalService = fixture.debugElement.injector.get(DwModalService);
      spyModalError = spyOn(modalService, 'error');
      spyModalError.and.callThrough();
      component.login();
      expect(spyAuthLogin).toHaveBeenCalled();
      expect(spyModalError).toHaveBeenCalled();
      expect(spyModalError.calls.argsFor(0)[0].dwContent).toContain('其它的description');
      expect(spyAuthLogout).toHaveBeenCalled();
    });
  });
  describe('登入有Error', () => {
    it('登入回傳錯誤訊息:login>>error>411002>dwMultiTenant === true', () => {
      spyAuthLogin.and.returnValue(throwError({
        error: {
          code: 411002
        }
      }));
      spyShowWarning.and.returnValue(of(true));
      component.dwMultiTenant = true;
      component.login();
      expect(spyAuthLogin).toHaveBeenCalled();
      expect(spyShowWarning).toHaveBeenCalled();
      expect(spyWindowOpen).toHaveBeenCalled();
      expect(spyWindowOpen.calls.argsFor(0)[0]).toContain('/product-details?goodsCode');
    });
    it('登入回傳錯誤訊息:login>>error>411002>dwMultiTenant === false', () => {
      spyAuthLogin.and.returnValue(throwError({
        error: {
          code: 411002
        }
      }));
      spyShowWarning.and.returnValue(of(true));
      component.dwMultiTenant = false;
      component.login();
      expect(spyAuthLogin).toHaveBeenCalled();
      expect(spyShowWarning).toHaveBeenCalled();
      expect(spyWindowOpen).not.toHaveBeenCalled();
    });
    it('登入回傳錯誤訊息:login>>error>411003', () => {
      spyAuthLogin.and.returnValue(throwError({
        error: {
          code: 411003
        }
      }));
      spyShowWarning.and.returnValue(of(true));
      component.login();
      expect(spyAuthLogin).toHaveBeenCalled();
      expect(spyShowWarning).toHaveBeenCalled();
    });
    it('登入回傳錯誤訊息:login>>error>411004>dwMultiTenant === true', () => {
      spyAuthLogin.and.returnValue(throwError({
        error: {
          code: 411004
        }
      }));
      spyShowWarning.and.returnValue(of(true));
      component.dwMultiTenant = true;
      component.login();
      expect(spyAuthLogin).toHaveBeenCalled();
      expect(spyShowWarning).toHaveBeenCalled();
      expect(spyWindowOpen).toHaveBeenCalled();
      expect(spyWindowOpen.calls.argsFor(0)[0]).toEqual('consoleUrl-get');
    });
    it('登入回傳錯誤訊息:login>>error>411004>dwMultiTenant === false', () => {
      spyAuthLogin.and.returnValue(throwError({
        error: {
          code: 411004
        }
      }));
      spyShowWarning.and.returnValue(of(true));
      component.dwMultiTenant = false;
      component.login();
      expect(spyAuthLogin).toHaveBeenCalled();
      expect(spyShowWarning).toHaveBeenCalled();
      expect(spyWindowOpen).not.toHaveBeenCalled();
    });
  });
});
