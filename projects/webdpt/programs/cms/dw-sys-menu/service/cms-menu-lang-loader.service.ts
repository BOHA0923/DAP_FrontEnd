import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { map } from 'rxjs/operators';

import { DwAuthService } from '@webdpt/framework/auth';
import { DwLanguageService } from '@webdpt/framework/language';
import { DwSysMenuRepository } from '../service/menu-repository';

@Injectable()
export class DwCmsMenuLangLoaderService {

  constructor(
    private translateService: TranslateService,
    private languageService: DwLanguageService,
    private authService: DwAuthService,
    private sysMenuRepository: DwSysMenuRepository
  ) {
    // 登入要初始化
    this.authService.isLoggedIn$.subscribe(
      value => {
        if (value) {
          this.init();
        }
      }
    );
  }

  init(): void {
    const lang: string = this.languageService.currentLanguage;
    this.getTranslation(lang, false).subscribe(
      langData => {
        this.translateService.setTranslation(lang, langData, true);
      },
      error => {
        console.log(error);
      }
    );
  }

  /**
   * 選單翻譯檔載入器,限已登入
   *
   * @param lang 語系
   * @param [spinning=true] 是否顯示HTTP加載遮罩
   */
  getTranslation(lang: string, spinning: boolean = true): Observable<any> {
    const isLoggedIn = this.authService.isLoggedIn; // 是否已登入

    if (isLoggedIn) {
      return this.sysMenuRepository.language(lang, spinning).pipe(
        map(
          response => {
            const langData = {
              menu: response
            };

            return langData;
          }
        )
      );
    } else {
      return of({});
    }
  }
}
