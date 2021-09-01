import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, of, Subject } from 'rxjs';
import { map } from 'rxjs/operators';


@Injectable()
export class DwViewLangLoaderService {
  private lastProgramId = ''; // 最後翻譯的作業編號
  private translated: any = {}; // 已翻譯清單

  constructor(
    private http: HttpClient
  ) {
  }

  /**
   * 畫面翻譯檔載入器,不限已登入
   * @param lang 語系
   * @param [programId] 作業編號
   * @returns translation 畫面翻譯檔
   */
  getTranslation(lang: string, programId?: string): Observable<any> {
    // 語言別改變時會取語全部的系文檔，此時只要翻譯最後一個作業，其他的則是透過路由轉換時再翻譯
    if (!programId) {
      programId = this.lastProgramId;
    } else {
      this.lastProgramId = programId;
    }

    const subject: Subject<any> = new Subject<any>();
    const transId = lang + '/' + programId;

    // 沒翻譯過才需要重新取檔案
    if (programId && this.translated[lang] === undefined || programId && this.translated[lang][programId] === undefined ) {
      const languageLoaderObs = this.http.get('assets/i18n/' + transId + '.json').pipe(
        map(
          (response: object) => {
            const langData = response;

            this.translated[lang] ?
              this.translated[lang][programId] = programId :
              this.translated[lang] = new Array, this.translated[lang][programId] = programId;

            return langData;
          }
        )
      );

      let subscription = null;
      subscription = languageLoaderObs.subscribe(
        langData => {
          subject.next(langData);
          subject.complete();
          subscription.unsubscribe();
        },
        error => {
          subject.complete();
          subscription.unsubscribe();
        }
      );
    } else {
      return of({});
      // subject.complete();
    }

    return subject.asObservable();
  }
}
