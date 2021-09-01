import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DW_LANG_LOADER, DW_LANGUAGE_JSON } from '@webdpt/framework/config';
import { languageList } from './model/language.config';
import { DwLanguageI18nRepository } from './repository/language-i18n-repository';
import { DwInitialLangLoaderService } from './initial-lang-loader.service';
import { DwViewLangLoaderService } from './view-lang-loader.service';


@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
    DwLanguageI18nRepository,
    // 語言清單
    {
      provide: DW_LANGUAGE_JSON,
      useValue: languageList
    },
    // 初始翻譯檔載入器
    DwInitialLangLoaderService,
    {
      provide: DW_LANG_LOADER,
      useExisting: DwInitialLangLoaderService,
      multi: true
    },
    // 畫面翻譯檔載入器
    DwViewLangLoaderService,
    {
      provide: DW_LANG_LOADER,
      useExisting: DwViewLangLoaderService,
      multi: true
    }
  ]
})
export class DwLanguageI18nModule { }
