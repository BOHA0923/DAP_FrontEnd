import { forwardRef, Inject, Injectable } from '@angular/core';

import * as QuicksilverModule from 'ng-quicksilver';
import { DwI18nService } from 'ng-quicksilver/i18n';

import { DwLanguageService } from '@webdpt/framework/language';


@Injectable()
export class DwLanguageSetupService {

  defaultLocale = 'en_US';

  constructor(
    dwI18nService: DwI18nService,
    @Inject(forwardRef(() => DwLanguageService)) languageService: DwLanguageService
  ) {
    languageService.language$.subscribe(
      language => {
        let currentLanguageCode = language;
        const langs = currentLanguageCode.split('-');
        if (langs.length === 2) {
          const lang = langs[0];
          const subLang = langs[1];

          if (lang && subLang) {
            currentLanguageCode = `${lang}_${subLang.toUpperCase()}`;
          }
        }
        dwI18nService.setLocale(QuicksilverModule[currentLanguageCode] || QuicksilverModule[this.defaultLocale]);
      }
    );
  }
}
