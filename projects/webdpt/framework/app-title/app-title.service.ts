import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { TranslateService, TranslationChangeEvent } from '@ngx-translate/core';

import { DwAppTitleModule } from './app-title.module';


@Injectable({
  providedIn: DwAppTitleModule
})
export class DwAppTitleService {
  public appTitleLangId = 'app-title';

  constructor(
    private title: Title,
    private translateService: TranslateService
  ) {
  }

  /**
   * 設定app標題
   */
  setTitle(language: string, title?: string): void {
    let newTitle = '';

    if (title) {
      newTitle = title;
      this.title.setTitle(newTitle);
    } else {
      this.translateService.onTranslationChange.subscribe(
        (event: TranslationChangeEvent) => {
          if (event.translations[this.appTitleLangId] !== undefined) {
            newTitle = event.translations[this.appTitleLangId];
          }

          this.title.setTitle(newTitle);
        }
      );
    }
  }
}
