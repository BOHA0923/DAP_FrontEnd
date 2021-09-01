import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

import { DwLanguageService } from '@webdpt/framework/language';
import { DwAuthService } from '@webdpt/framework/auth';
import { DwFinereportRepository } from '../repository/finereport-repository';
import { DwFinereportCoreModule } from '../finereport-core.module';

@Injectable({
  providedIn: DwFinereportCoreModule
})
export class DwFinereportLangLoaderService {

  constructor(
    private translateService: TranslateService,
    private languageService: DwLanguageService,
    private authService: DwAuthService,
    private reportRepository: DwFinereportRepository
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
    this.getTranslation(lang).subscribe(
      langData => {
        this.translateService.setTranslation(lang, langData, true);
      },
      error => {
        console.log(error);
      }
    );
  }

  /**
   * 報表名稱翻譯檔載入器,限已登入
   * @param lang 語系
   */
  getTranslation(lang: string): Observable<any> {
    const isLoggedIn = this.authService.isLoggedIn; // 是否已登入

    if (isLoggedIn) {
      return this.reportRepository.language(lang).pipe(
        map(
          response => {
            const langData = {
              prog: response
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
