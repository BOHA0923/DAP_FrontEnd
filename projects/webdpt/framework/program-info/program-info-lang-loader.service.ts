import { Injectable } from '@angular/core';

import { Observable, Subject } from 'rxjs';

import { DwAuthService } from '@webdpt/framework/auth';
import { DwLanguageI18nRepository } from '@webdpt/framework/language';
import { DwProgramInfoModule } from './program-info.module';


/**
 * 目前在此僅提供取資料，若從basic.json拆分出去時要轉成DW_LANG_LOADER provide
 *
 */
@Injectable({
  providedIn: DwProgramInfoModule
})
export class DwProgramInfoLangLoaderService {

  constructor(
    private languageI18nRepository: DwLanguageI18nRepository,
    private authService: DwAuthService
  ) { }

  /**
   * 作業資訊翻譯檔載入器
   * @param lang 語系
   */
  getTranslation(lang: string): Observable<any> {
    const isLoggedIn = this.authService.isLoggedIn; // 是否已登入
    const subject: Subject<any> = new Subject<any>();

    if (isLoggedIn) {
      this.languageI18nRepository.basic(lang).subscribe(
        (translation: any) => {
          const translationProg = translation.prog ? translation.prog : {};
          subject.next(translationProg);
          subject.complete();
        }
      );
    } else {
      subject.complete();
    }

    return subject.asObservable();
  }
}
