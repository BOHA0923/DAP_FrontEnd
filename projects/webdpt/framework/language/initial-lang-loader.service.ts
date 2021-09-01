import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { DwLanguageI18nRepository } from './repository/language-i18n-repository';


@Injectable()
export class DwInitialLangLoaderService {
  constructor(
    private languageI18nRepository: DwLanguageI18nRepository
  ) {
  }

  /**
   * 初始翻譯檔載入器
   */
  getTranslation(lang: string, programId?: string): Observable<any> {
    return this.languageI18nRepository.basic(lang);
  }
}
