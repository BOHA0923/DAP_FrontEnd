import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import * as en_US from '../i18n/en_US/dw-basic';
import * as zh_CN from '../i18n/zh_CN/dw-basic';
import * as zh_TW from '../i18n/zh_TW/dw-basic';


@Injectable()
export class DwLanguageI18nRepository {

  constructor(
    private http: HttpClient
  ) {
  }

  /**
   * 全域多語言翻譯
   */
  basic(lang: string): Observable<any> {
    // this.translateService.setTranslation(lang, this.dwI18nBasic(lang), true);
    return this.http.get('assets/i18n/' + lang + '/basic.json').pipe(
      map(
        response => {
          return this.mergeDeep(this.dwI18nBasic(lang), response);
        }
      )
    );
  }

  /**
   * 平台全域多語言
   */
  private dwI18nBasic(lang: string): any {
    switch (lang) {
      case 'en_US':
        return en_US.dwI18nBasic;
      case 'zh_CN':
        return zh_CN.dwI18nBasic;
      case 'zh_TW':
        return zh_TW.dwI18nBasic;
      default:
        return {};
    }
  }

  // ngx-translate/core/src/lib/util.ts
  private isObject(item: any): boolean {
    return (item && typeof item === 'object' && !Array.isArray(item));
  }

  private mergeDeep(target: any, source: any): any {
    const output = Object.assign({}, target);
    if (this.isObject(target) && this.isObject(source)) {
      Object.keys(source).forEach((key: any) => {
        if (this.isObject(source[key])) {
          if (!(key in target)) {
            Object.assign(output, {[key]: source[key]});
          } else {
            output[key] = this.mergeDeep(target[key], source[key]);
          }
        } else {
          Object.assign(output, {[key]: source[key]});
        }
      });
    }
    return output;
  }
}
