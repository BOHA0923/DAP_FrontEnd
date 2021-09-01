import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, ParamMap, Router, convertToParamMap } from '@angular/router';

import { Observable, from, of } from 'rxjs';
import { map, mergeAll, reduce } from 'rxjs/operators';

import { IDwSsoLogin } from '@webdpt/framework/iam';
import { DW_SSO_LOGIN, DW_USING_TAB } from '@webdpt/framework/config';
import { DwLanguageService } from '@webdpt/framework/language';
import { DwAuthService } from '@webdpt/framework/auth';
import { DwProgramExecuteService } from '@webdpt/framework/program-info';

@Component({
  selector: 'app-sso-login',
  templateUrl: './sso-login.component.html',
  styleUrls: ['./sso-login.component.less']
})
export class DwSsoLoginComponent implements OnInit {
  public showMessage = true; // 是否顯示登入訊息。完成登入即移除訊息

  constructor(
    private router: Router,
    private activateRoute: ActivatedRoute,
    private languageService: DwLanguageService,
    private authService: DwAuthService,
    private dwProgramExecuteService: DwProgramExecuteService,
    @Inject(DW_SSO_LOGIN) private issoLogins: IDwSsoLogin[],
    @Inject(DW_USING_TAB) private _usingTab: boolean
  ) {
  }

  /**
   * 使用 reduce 確保只取到一個結果值, 在 reduce 裡所操作的 Observable, 必定要 complete.
   * reduce 的參數，1: callback(), 2: 初始值，callback(acc: 初始值或上一次的結果值, val: eventLists的每1個值)，最後回傳一個新的狀態，再繼續執行.
   */
  ngOnInit(): void {
    // 取得路由參數
    this.activateRoute.queryParamMap.subscribe(
      (params: ParamMap) => {
        const eventLists = from(this.issoLogins);
        const eventResults = eventLists.pipe(
          map(item => {
            const ret = item.ssoLogin(params);
            return (ret instanceof Observable) ? ret : of(ret);
          }),
          mergeAll(),
          reduce((acc, val): boolean => acc || val, false) // 當有1個 true 結果就為 true 的判斷式.
        );


        eventResults.subscribe(result => {
          if (!result) {
            this.authService.logout();
          } else {
            const programId = params.get('dwProgramId');
            let routerLink = params.get('routerLink') || '';
            const dwLang = params.get('dwLang') || '';
            const newParams = this.filterParams(params);

            if (dwLang) {
              this.languageService.setUp(dwLang);
            }

            if (programId) {
              this.showMessage = false;
              this.dwProgramExecuteService.byId(programId, newParams);
            } else {
              const qryString = this._getUrlQueryParams(newParams);
              // 導頁前往指定頁面時, 需帶其餘的 url query parameters.
              if (qryString) {
                routerLink = routerLink + '?' + qryString;
              }

              this.showMessage = false;
              this.loginedForwardUrl(routerLink);
            }
          }
        });

      }
    );

  }

  /**
   * 將ParamMap中的專用key移除，產生一個新的ParamMap
   */
  private filterParams(paramMap: ParamMap): ParamMap {
    const keys = paramMap.keys;
    const params: {[key: string]: any} = {};
    let values: string[];
    keys.forEach(
      (key: string): void => {
        switch (key) {
          case 'routerLink':
          case 'userToken':
          case 'dwLang':
            break;
          default:
            values = paramMap.getAll(key);
            if (values && values.length > 1) {
              params[key] = values;
            } else {
              params[key] = paramMap.get(key);
            }
        }
      }
    );
    return convertToParamMap(params);
  }

  /**
   * todo 目前寫在 2 個地方, 應該集中到 dw-tab-routing 去.
   * [登入後]的要導頁的 url.
   *
   * param {string} returnUrl: 導頁的 url.
   */
  public loginedForwardUrl(returnUrl: string): void {
    if (returnUrl !== null && returnUrl !== '' && returnUrl !== '/') {
      this.router.navigateByUrl(returnUrl);
    } else {
      this.dwProgramExecuteService.goHome();
    }
  }


  /**
   * 取出網址列的 url query parameters
   * 須考慮?param1=user01&param1=user02&param1=user03
   * param {*} params
   * returns {string}
   */
  private _getUrlQueryParams(params: any): string {
    let qryString = '';
    const qryParams: { key: string, value: string}[] = [];
    let values: string[] = null;
    params.keys.forEach((key) => {
      values = params.getAll(key);
      values.forEach( value => {
        qryParams.push({key, value});
      });
    });

    if (qryParams.length === 0) {
      return qryString;
    }

    // 將其餘的 url query parameters 組成標準參數串.
    qryString = qryParams.map((param) => {
      return encodeURIComponent(param.key) + '=' + encodeURIComponent(param.value);
    }).join('&');

    return qryString;
  }
}
