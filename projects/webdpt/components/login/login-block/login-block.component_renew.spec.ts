// // 進行單一檔案測試時, 以下2行需開啟
// import 'zone.js/dist/zone-testing';
// import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';

import { async, TestBed, ComponentFixture, tick, fakeAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { ReactiveFormsModule } from '@angular/forms';
import { EventEmitter, Component } from '@angular/core';
import { Location } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { Observable, of, BehaviorSubject } from 'rxjs';

import { DwIconModule, DW_ICONS } from 'ng-quicksilver/icon';
import { DwModalRef } from 'ng-quicksilver/modal';
import { DwModalModule } from 'ng-quicksilver/modal';
import { DwModalService } from 'ng-quicksilver/modal';
import { TranslateService } from '@ngx-translate/core';
import { IconDefinition } from '@ant-design/icons-angular';
import * as AllIcons from '@ant-design/icons-angular/icons';

import { DwAuthService} from '@webdpt/framework/auth';
import { DwUserService} from '@webdpt/framework/user';
import { DwLanguageService} from '@webdpt/framework/language';
import { DwLanguageListService} from '@webdpt/framework/language';
import { DwTenantService} from '@webdpt/framework/user';
import { DwProgramExecuteService} from '@webdpt/framework/program-info';
import { DwSystemConfigService} from '@webdpt/framework/config';

import { DwLanguageModule } from '@webdpt/components/language';

import { DwLoginBlockComponent } from './login-block.component';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { DwRememberLoginService } from '../service/remember-login.service';
import { DW_APP_ID } from '@webdpt/framework/config';
// html 裡用到的 <i dw-icon> 的值
const antDesignIcons = AllIcons as {
  [key: string]: IconDefinition;
};
const icons: IconDefinition[] = Object.keys(antDesignIcons).map(key => {
  const i = antDesignIcons[key];
  return i;
});

// ng zorro 開窗的返回值
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


describe('DwLoginBlockComponent 單元測試', () => {
  let component: DwLoginBlockComponent;
  let fixture: ComponentFixture<DwLoginBlockComponent>;

  beforeEach(async(() => {
    // // 進行單一檔案 testing 時, 會報錯  Cannot read property 'getComponentFromError' of null
    // // 需要利用以下這 2 行排除
    // TestBed.resetTestEnvironment();
    // TestBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());

    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([ // 假路由, 用來判斷導頁是否完成
          { path: 'forget', component: ForgetMockComponent },
          { path: 'home', component: HomeMockComponent }
        ]),
        ReactiveFormsModule,
        DwLanguageModule,
        DwIconModule,
        BrowserAnimationsModule,
        DwModalModule
      ],
      declarations: [
        DwLoginBlockComponent,
        ForgetMockComponent,
        HomeMockComponent
      ],
      providers: [
        {
          provide: DwModalService,
          useClass: ModalMockService
        },
        {
          provide: DW_ICONS,
          useValue: icons
        },
        {
          provide: DwAuthService,
          useClass: DwAuthMockService
        },
        {
          provide: DwUserService,
          useFactory: (): any => {
            return {
              getUser(): Observable<any> {
                return of(null);
              }

            };
          }
        },
        {
          provide: DwRememberLoginService,
          useClass: DwRememberLoginMockService
        },
        {
          provide: DwLanguageService,
          useClass: DwLanguageMockService
        },
        {
          provide: TranslateService,
          useClass: TranslateMockService
        },
        {
          provide: DwTenantService,
          useClass: DwTenantMockService,
        },
        {
          provide: DwProgramExecuteService,
          useFactory: (): any => {
            return {
              goHome (): any {
                return null;
              }

            };
          }
        },
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
          provide: DwLanguageListService,
          useFactory: (): any => {
            return {
              getLanguagesList(): Observable<any> {
                return of([]);
              }
            };
          }
        },
        {
          provide: ActivatedRoute,
          useClass: ActivatedMockRoute
        },
        { provide: DW_APP_ID, useValue: 'dwAppId' }
      ]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(DwLoginBlockComponent);
        component = fixture.componentInstance;
        component.tenantId = '99999999';
        component.identityType = 'query';
        component.showRemember = true;
        fixture.detectChanges();
      });


  }));


  describe('UI 測試', () => {
    it('組件已經創建', () => {
      expect(component).toBeTruthy();
    });

    it('登入表單在初始狀態時，登入按鈕不能按', () => {
      const disabled = fixture.debugElement.nativeElement.querySelector('.login-form-button').disabled;
      expect(disabled).toBeTruthy();
    });

    it('只有輸入帳號時，登入按鈕不能按', () => {
      component.validateForm.get('userId').setValue('userId');
      component.validateForm.get('password').setValue('');
      fixture.detectChanges();
      const disabled = fixture.debugElement.nativeElement.querySelector('.login-form-button').disabled;
      expect(disabled).toBeTruthy();
    });

    it('只有輸入密碼時，登入按鈕不能按', () => {
      component.validateForm.get('userId').setValue('');
      component.validateForm.get('password').setValue('password');
      fixture.detectChanges();
      const disabled = fixture.debugElement.nativeElement.querySelector('.login-form-button').disabled;
      expect(disabled).toBeTruthy();
    });

    it('完整輸入帳號與密碼時，登入按鈕可以按', () => {
      component.validateForm.get('userId').setValue('userId');
      component.validateForm.get('password').setValue('password');
      fixture.detectChanges();
      const disabled = fixture.debugElement.nativeElement.querySelector('.login-form-button').disabled;
      expect(disabled).toBeFalsy();
    });

    it('當有儲存登入資訊時，記住我會打勾', () => {
      const rememberLoginService = TestBed.get(DwRememberLoginService);

      rememberLoginService.setRememberLogin({
        rememberLogin: true,
        userId: null,
        userName: null,
        language: 'zh_TW'
      });

      const remember = rememberLoginService.getRememberLogin();
      component.validateForm.get('remember').setValue(remember.rememberLogin);
      fixture.detectChanges();
      const elChecked = component.validateForm.get('remember').value;
      expect(elChecked).toBeTruthy();
    });

    it('當沒有儲存登入資訊時，記住我不會打勾', () => {
      const rememberLoginService = TestBed.get(DwRememberLoginService);
      rememberLoginService.setRememberLogin({
        rememberLogin: false,
        userId: null,
        userName: null,
        language: null
      });

      const remember = rememberLoginService.getRememberLogin();
      component.validateForm.get('remember').setValue(remember.rememberLogin);
      fixture.detectChanges();
      const elChecked = component.validateForm.get('remember').value;
      expect(elChecked).toBeFalsy();
    });

    it('當有設定語言選單時，出現語言下拉選單', () => {
      component.showLanguage = true;
      fixture.detectChanges();
      const elRemember = fixture.debugElement.nativeElement.querySelector('.login-form-forgot');
      expect(elRemember).toBeTruthy();
    });

    it('當沒有設定語言選單時，隱藏語言下拉選單', () => {
      component.showLanguage = false;
      fixture.detectChanges();
      const elRemember = fixture.debugElement.nativeElement.querySelector('.login-form-forgot');
      expect(elRemember).toBeFalsy();
    });

    it('當記住我的語言別與選單的語言別不同時，要重新設定語言別', () => {
      const rememberLoginService = TestBed.get(DwRememberLoginService);

      rememberLoginService.setRememberLogin({
        rememberLogin: true,
        userId: null,
        userName: null,
        language: 'zh_TW'
      });

      component.ngOnInit();

      const languageService = TestBed.get(DwLanguageService);

      expect(languageService.status).toBe('setup'); // 重新設定語言別
    });

    it('當記住我的語言別與選單的語言相同時，不需重新設定語言別', () => {
      const rememberLoginService = TestBed.get(DwRememberLoginService);
      const languageService = TestBed.get(DwLanguageService);

      rememberLoginService.setRememberLogin({
        rememberLogin: true,
        userId: null,
        userName: null,
        language: 'zh_TW'
      });

      languageService.currentLanguage = 'zh_TW';

      component.ngOnInit();

      expect(languageService.status).toBe(''); // 不需要重新設定語言別
    });

  });



  describe('交互測試', () => {
    it('登入失敗時，顯示錯誤訊息彈窗', (done) => {
      component.validateForm.get('userId').setValue('userId');
      component.validateForm.get('password').setValue('password');
      component.submitForm();
      fixture.detectChanges();

      const authService = TestBed.get(DwAuthService);
      authService.isLoggedIn = false;
      authService.description = '登入失敗';
      authService.currTenantList = [];

      const modalService = TestBed.get(DwModalService);

      component.login();
      fixture.detectChanges();

      expect(modalService.status).toBe('error'); // 偵測開啟錯誤訊息彈窗
      done();
    });

    it('登入成功時，顯示租戶清單彈窗，並點擊其中一筆租戶，刷新 userToken', fakeAsync(() => {
      component.returnUrl = '/home';
      component.validateForm.get('userId').setValue('userId');
      component.validateForm.get('password').setValue('password');
      component.submitForm();
      fixture.detectChanges();

      const currTenantList = [
        {
          'sid': 28205582758464,
          'id': 'cloudent',
          'name': 'DAP測試第一企業',
          'customerId': '',
          'contacts': 'eee',
          'email': 'eee@ddd',
          'imageUrl': '',
          'description': 'DAP測試第一企業'
        },
        {
          'sid': 60381321704000,
          'id': 'cloudent2',
          'name': 'DAP測試第二企業',
          'customerId': '',
          'description': 'DAP範例應用企業帳號之二, cloud02多租戶登入'
        }
      ];

      const authService = TestBed.get(DwAuthService);
      const modalService = TestBed.get(DwModalService);

      authService.isLoggedIn = null;
      component.login();
      fixture.detectChanges();

      const tenantService = TestBed.get(DwTenantService);
      tenantService.setTenantList(currTenantList);
      fixture.detectChanges();

      expect(modalService.status).toBe('create'); // 偵測開啟多租戶選單

      component.changeTenant(28205582758464); // 點擊其中一筆刷新 userToken

      tick();
      const location = TestBed.get(Location);
      const url = location.path();
      expect(url).toBe('/home');
    }));

    it('登入失敗後，送出按鈕要恢復成可按', (done) => {
      component.validateForm.get('userId').setValue('userId');
      component.validateForm.get('password').setValue('password');
      component.submitForm();
      fixture.detectChanges();

      const authService = TestBed.get(DwAuthService);
      authService.isLoggedIn = undefined;
      authService.description = '登入失敗';
      authService.currTenantList = [];

      component.login();
      fixture.detectChanges();

      expect(component.isDisabled).toBeFalsy(); // 登入失敗
      done();
    });

    it('登入成功後，選擇租戶刷新token時，如果未指定租戶Sid，將無法刷新token且登出', () => {
      component.validateForm.get('userId').setValue('userId');
      component.validateForm.get('password').setValue('password');
      component.submitForm();
      fixture.detectChanges();

      const currTenantList = [
        {
          'sid': 28205582758464,
          'id': 'cloudent',
          'name': 'DAP測試第一企業',
          'customerId': '',
          'contacts': 'eee',
          'email': 'eee@ddd',
          'imageUrl': '',
          'description': 'DAP測試第一企業'
        },
        {
          'sid': 60381321704000,
          'id': 'cloudent2',
          'name': 'DAP測試第二企業',
          'customerId': '',
          'description': 'DAP範例應用企業帳號之二, cloud02多租戶登入'
        }
      ];

      const authService = TestBed.get(DwAuthService);

      authService.isLoggedIn = null;
      component.login();
      fixture.detectChanges();

      const tenantService = TestBed.get(DwTenantService);
      tenantService.setTenantList(currTenantList);
      fixture.detectChanges();

      component.changeTenant(null); // 點擊其中一筆刷新 userToken
      expect(authService.status).toBe('logout');
    });

  });



  // 使用fakeAsync() 與 tick() 會造成 TypeError: Cannot read property 'assertPresent' of undefined
  // 所以run 單一檔案的單元測試時, 需要在第一行加 import 'zone.js/dist/zone-testing';
  describe('路由測試', () => {
    it('當登入成功時，跳轉到首頁', fakeAsync(() => {
      component.returnUrl = '/home';
      component.validateForm.get('userId').setValue('userId');
      component.validateForm.get('password').setValue('password');
      component.submitForm();
      fixture.detectChanges();

      const authService = TestBed.get(DwAuthService);
      authService.isLoggedIn = true;
      component.login();
      fixture.detectChanges();

      tick(); // 路由跳轉時, 會有一個 timeout 時間
      const location = TestBed.get(Location);
      const url = location.path();
      expect(url).toBe('/home');
    }));

    it('點擊忘記密碼時，會跳轉到忘記密碼頁', fakeAsync(() => {
      component.forget();
      fixture.detectChanges();

      tick(); // 路由跳轉時, 會有一個 timeout 時間
      const location = TestBed.get(Location);
      const url = location.path();
      expect(url).toBe('/forget');
    }));

    it('當沒有默認跳轉頁時，登入後會導向到自訂首頁', fakeAsync(() => {
      component.loginedForwardUrl(null);

      tick(); // 路由跳轉時, 會有一個 timeout 時間
      const location = TestBed.get(Location);
      const url = location.path();
      expect(url).toBe('');
    }));

    it('當在已登入狀態下進入登入頁時，將直接進行導頁', fakeAsync(() => {
      const authService = TestBed.get(DwAuthService);
      const activatedRoute = TestBed.get(ActivatedRoute);

      authService.isLoggedIn = true;
      activatedRoute.testQueryParamMap = {
        returnUrl: '/home'
      };

      component.ngOnInit();
      fixture.detectChanges();

      tick(); // 路由跳轉時, 會有一個 timeout 時間
      const location = TestBed.get(Location);
      const url = location.path();
      expect(url).toBe('/home');
    }));

    it('當在已登入狀態下進入登入頁時，將不會開啟多租戶選單窗', fakeAsync(() => {
      const authService = TestBed.get(DwAuthService);
      const modalService = TestBed.get(DwModalService);

      authService.isLoggedIn = true;

      component.ngOnInit();
      component.ngAfterViewInit();
      fixture.detectChanges();
      tick();

      expect(modalService.status).toBe('');
    }));

  });

});


/**
 * 多語翻譯 mock service
 *
 */
class TranslateMockService {

  onLangChange: EventEmitter<any> = new EventEmitter();
  onTranslationChange: EventEmitter<any> = new EventEmitter();
  onDefaultLangChange: EventEmitter<any> = new EventEmitter();

  get(): Observable<any> {
    return of(null);
  }

  instant(): any {
    return null;
  }

}


/**
 * 多租戶 mock service
 *
 */
class DwTenantMockService {
  tokenValidSubject: BehaviorSubject<boolean>;
  tenantSubject: BehaviorSubject<any[]>;
  currTenantList = [];

  constructor(
  ) {
    this.tenantSubject = new BehaviorSubject<any[]>(this.currTenantList);
  }

  get currTenantList$(): Observable<any[]> {
    return this.tenantSubject;
  }

  setTenantList(currTenantList: any): void {
    this.currTenantList = currTenantList;
    this.tenantSubject.next(currTenantList);
  }

  tokenRefreshTenant(tenantSid: number): Observable<any> {
    return new Observable((observer): void => {
      if (!tenantSid) {
        observer.error(new Error());
      } else {
        observer.next(true);
      }
      observer.complete();
    });
  }
}


/**
 * 記住我 mock service
 */
class DwRememberLoginMockService {
  private rememberLoginInfo: any = {
    rememberLogin: null,
    userId: null,
    userName: null,
    language: null
  };

  setRememberLogin(rememberLoginInfo: any): any {
    this.rememberLoginInfo = rememberLoginInfo;
  }

  getRememberLogin(): any {
    return this.rememberLoginInfo;
  }
}

/**
 * 登入 mock service
 *
 */
class DwAuthMockService {
  isLoggedIn: boolean;
  description: string;
  currTenantList = [];
  status = '';

  login(userConfig: any): Observable<any> {
    return new Observable((observer): void => {
      if (this.isLoggedIn === undefined) {
        observer.error(new Error());
      } else {
        observer.next({
          success: this.isLoggedIn,
          description: this.description, // 登入失敗時, 顯示.
          currTenantList: this.currTenantList
        });
      }
      observer.complete();
    });
  }

  logout(): Observable<any> {
    this.status = 'logout';
    return of(null);
  }

}


/**
 * ng-zorro 開窗 mock service
 *
 */
class ModalMockService {
  status = '';
  create<T>(): DwModalRef<T> {
    const modalRef: DwModalRef = dwModalRef;
    this.status = 'create';
    return modalRef;
  }

  error<T>(): DwModalRef<T> {
    const modalRef: DwModalRef = dwModalRef;
    this.status = 'error';
    return modalRef;
  }
}


/**
 * 多語 mock service
 *
 */
class DwLanguageMockService {
  currentLanguage = 'zh_CN';
  status = '';

  setUp(): Observable<any> {
    this.status = 'setup';
    return of(null);
  }

}


/**
 *  路由 mock ActivatedRoute
 *
 */
class ActivatedMockRoute {
  testQueryParamMap = null;

  get snapshot(): any {
    return {
      queryParamMap: convertToParamMap(this.testQueryParamMap)
    };
  }
}


@Component({
  template: `
    <div></div>`
})
export class ForgetMockComponent {
}

@Component({
  template: `
    <div></div>`
})
export class HomeMockComponent {
}
