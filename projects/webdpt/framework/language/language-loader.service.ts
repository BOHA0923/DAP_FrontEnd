import { Injectable, Inject } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

import { DW_LANG_LOADER } from '@webdpt/framework/config';
import { DwLanguageI18nModule } from './language-i18n.module';


@Injectable({
  providedIn: DwLanguageI18nModule
})
export class DwLanguageLoaderService {

  constructor(
    @Inject(DW_LANG_LOADER) private langLoader: any[], // 翻譯檔載入器
    private translateService: TranslateService
  ) { }

  /**
   * 取翻譯檔
   * @param lang 語系
   */
  getTranslation(lang: string): void {
    this.langLoader.forEach(
      (services) => {
       // const obs: Observable<any> = services.getTranslation(lang);
        // 執行翻譯檔載入器
        services.getTranslation(lang).subscribe(
          langData => {
            this.translateService.setTranslation(lang, langData, true);
          },
          error => {
            console.log(error);
          }
        );
      }
    );
  }
}
