import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';

import { Observable, BehaviorSubject } from 'rxjs';
import { filter, distinctUntilChanged, map, catchError } from 'rxjs/operators';

import { TranslateService } from '@ngx-translate/core';

import { SessionStorage } from '@webdpt/framework/storage';
import { DwLanguageLoaderService } from './language-loader.service';
import { DwViewLangLoaderService } from './view-lang-loader.service';
import { DwLanguageListService } from './language-list.service';
import { IDwLanguageList } from './interface/language.interface';
import { DwAppTitleService } from '@webdpt/framework/app-title';
import { DwLanguageI18nModule } from './language-i18n.module';


/**
 * 動態翻譯文字 ( 需先擁有"對應已翻譯完成文字"，不然將返回傳入文字 )
 * 作業自行使用 this.translateService.instant('翻譯內容'); / this.translateService.stream('翻譯內容');
 * 設定語言別
 * DwLanguageService.setUp(language: string);
 * 訂閱語言變更
 * DwLanguageService.language
 * 訂閱默认語言
 * DwLanguageService.getDefaultLang
 */

@Injectable({
  providedIn: DwLanguageI18nModule
})
export class DwLanguageService implements Resolve<any> {

  private languageSubject: BehaviorSubject<string>; // 語言主題
  private languagesList: IDwLanguageList[];
  private lang: Array<any> = []; // 曾翻譯過的文件檔名

  constructor(
    private sessionStorage: SessionStorage,
    private translateService: TranslateService,
    private languageListService: DwLanguageListService,
    private languageLoaderService: DwLanguageLoaderService,
    private viewLangLoaderService: DwViewLangLoaderService,
    private appTitleService: DwAppTitleService
  ) {
    this.languageSubject = new BehaviorSubject<string>(null);

    this.languagesList = [];
    this.languageListService.getLanguagesList().subscribe(
      response => {
        if (Array.isArray(response)) {
          this.languagesList = response;
        } else {
          this.languagesList = [];
        }
      }
    );

    this.init();

    // 執行全部的翻譯檔載入器
    this.language$.subscribe(
      lang => {
        this.languageLoaderService.getTranslation(lang);
      },
      error => {
        console.log(error);
      }
    );
  }

  /**
   * 設定預設語言別
   */
  setDefaultLang(lang: string): void {
    let language = lang;

    if (!language) {
      language = this.getBrowserCultureLang;
    }

    // 檢查語言別是否為可用語言
    let check = false;
    this.languagesList.every(
      (item: IDwLanguageList) => {
        if (item.value === language) {
          check = true;
          return false;
        } else {
          return true;
        }
      }
    );

    if (!check && this.languagesList[0]) {
      language = this.languagesList[0].value;
    }

    this.translateService.setDefaultLang(language);
  }

  /**
   * 取得預設語言別
   */
  getDefaultLang(): string {
    const language = this.translateService.getDefaultLang();
    return language;
  }

  /**
   * 設定語言別
   */
  setUp(language: any): void {
    if (!language) {
      return;
    }
    this.translateService.use(language);
    this.sessionStorage.set('language', language);
    if (this.lang.length > 0) {
      this.multipleFiles(language, this.lang);
    }
    this.languageSubject.next(language);
    this.appTitleService.setTitle(language);
  }

  /**
   * 訂閱 porgramID 並提取翻譯文件
   */
  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const
      recorded = [],
      programIdList = route.data.dwRouteData;
    let
      language = this.currentLanguage;
    if (!programIdList.programId) {
      return;
    }
    // 登出時，語言別如果被刪除，需要重新初始化語言別，因為畫面翻譯檔載入器不限已登入
    if (!language) {
      this.init();
      language = this.currentLanguage;
    }
    if (programIdList.programId && !programIdList.i18n) {
      this.lang.push(programIdList.programId);
      return this.singleFile(language, programIdList.programId);
    }
    if (programIdList.programId && programIdList.i18n && programIdList.i18n.length === 0) {
      this.lang.push(programIdList.programId);
      return this.singleFile(language, programIdList.programId);
    }
    if (programIdList.programId && programIdList.i18n && toString.call(programIdList.i18n) === '[object Object]') {
      this.translateService.setTranslation(language, programIdList.i18n, true);
      return this.singleFile(language, programIdList.programId);
    }
    if (programIdList.i18n && programIdList.i18n.length > 0) {
      recorded.push(programIdList.programId);
      const data = recorded.concat(programIdList.i18n);
      this.lang = data;
      return this.multipleFiles(language, data);
    }
    if (programIdList.i18n.default && programIdList.i18n.default.length > 0) {
      recorded.push(programIdList.programId);
      const data = recorded.concat(programIdList.i18n.default);
      this.lang = data;
      return this.multipleFiles(language, data);
    }
  }

  /*
  * 連帶i18n
  */
  private multipleFiles(language: string, program: any): Observable<any> {
    const result: any = {};
    for (const id in program) {
      if (Number(id) + 1 === program.length) {
        return this.viewLangLoaderService.getTranslation(language, program[id]).pipe(
          map(
            element => this.translateService.setTranslation(language, element, true)
          ),
          catchError(
            (error: any) => {
              return ('Failed to get translation file：' + error.message || error);
            }
          )
        );
      } else {
        this.viewLangLoaderService.getTranslation(language, program[id]).pipe(
          map(
            element => Object.assign(result, element)
          ),
          catchError(
            (error: any) => {
              return ('Failed to get translation file：' + error.message || error);
            }
          )
        ).subscribe(
          response => this.translateService.setTranslation(language, response, true)
        );
      }
    }
  }

  /*
   * 僅有 programId
   */
  private singleFile(language: string, programId: string): Observable<any> {
    return this.viewLangLoaderService.getTranslation(language, programId).pipe(
      map(
        langData => {
          this.translateService.setTranslation(language, langData, true);
        }
      ),
      catchError(
        (error: any) => {
          return ('Failed to get translation file：' + error.message || error);
        }
      )
    );
  }

  /**
   * 取得瀏覽器語言別
   * navigator.language 在Chrome 版本 68.0.3440.106 有bug,都是取到第一個語言別,無法取到介面所使用的語言
   * https://bugs.chromium.org/p/chromium/issues/detail?id=802006
   * https://zzz.buzz/2016/01/13/detect-browser-language-in-javascript/#behavior-in-ie11
   */
  get getBrowserCultureLang(): string {
    return this.translateService.getBrowserCultureLang().replace(new RegExp(/-/g), '_');
  }

  /**
   * 取得目前語言別
   */
  get currentLanguage(): string {
    const language = this.sessionStorage.get('language');
    return language;
  }

  /**
   * 取得語言別
   */
  get language$(): Observable<string> {
    return this.languageSubject.asObservable().pipe(
      filter(obsData => obsData !== null), // 不廣播初始值
      distinctUntilChanged() // 有改變時才廣播
    );
  }

  init(): void {
    // 语言别意外丢失处理
    this.setDefaultLang(undefined);
    let language = this.getDefaultLang();

    if (this.currentLanguage) {
      language = this.currentLanguage;
    }

    this.setUp(language);
  }
}
