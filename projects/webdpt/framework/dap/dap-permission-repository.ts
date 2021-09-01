import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { DwDapHttpClient } from './dap-http-client';
import { DwLanguageI18nRepository } from '@webdpt/framework/language';
import { DwProgramInfoListJsonService } from '@webdpt/framework/operation';
import { IDwOperationMap, IDwProgramActionItem } from '@webdpt/framework/operation';
import { DwDapModule } from './dap.module';

/**
 * IAM 權限
 */
@Injectable({
  providedIn: DwDapModule
})
export class DwDapPermissionRepository {

  constructor(
    private http: DwDapHttpClient,
    private programInfoListJsonService: DwProgramInfoListJsonService,
    private languageI18nRepository: DwLanguageI18nRepository
  ) {
  }

  /**
   * 作業上傳互聯應用
   * 報表由後端上傳
   */
  public uploadCc(language: string): Observable<any> {
    return this.uploadCcList(language).pipe(
      switchMap(
        (uploadList: any[]) => {
          const params: any = {
            // product: this.dwAppId,
            program: uploadList,
            // reportProduct: this.dwProduct,
            language: language
          };

          params.program = uploadList;

          return this.http.post('restful/service/DWSys/functionPermission/IAM', params);
        },
        (uploadList: any[], response: any) => {
          if (response.message) {
            response.message = response.message.replace(/\r\n/g, '<br>'); // 將換行字元(\r\n)替換成html的換行標籤(<br>)
          }

          return response;
        }
      )
    );
  }

  /**
   * 作業上傳互聯應用清單
   */
  public uploadCcList(language: string): Observable<any[]> {
    const _dwProgramInfoFrameworkJson = this.programInfoListJsonService.dwProgramInfoFrameworkJson;

    return this.languageI18nRepository.basic(language).pipe(
      switchMap(
        (translation: any) => {
          return this.programInfoListJsonService.programListJsonMap$;
        },
        (translation: any, programListJsonMap: IDwOperationMap) => {
          const translationProg = translation.prog ? translation.prog : {};
          const translationPage = translation.page ? translation.page : {};
          const uploadList: any[] = [];

          Object.keys(programListJsonMap).forEach(
            key => {
              const prog = programListJsonMap[key];
              let needAdd = true; // 是否列入上傳清單

              // 沒有模組歸屬不做模組切分，不上傳到IAM做權限控管
              if (prog.module === 'root') {
                needAdd = false;
              }

              if (needAdd) {
                // 平台架構作業不用列
                _dwProgramInfoFrameworkJson.forEach(
                  frameworkProgram => {
                    if (key === frameworkProgram.id) {
                      needAdd = false;
                    }
                  }
                );
              }

              if (needAdd) {
                let progName = translationProg[key] ? translationProg[key] : '';

                if (progName === '') {
                  progName = key;
                }

                const newItem = {
                  code: key,
                  module: prog.module,
                  name: progName,
                  page: [],
                  action: []
                };

                // 頁面權限基本資料 // 頁面限制 allow,disabled
                const pageList: any[] = JSON.parse(JSON.stringify(prog.page));
                pageList.forEach(
                  pageItem => {
                    let pageName = translationPage[pageItem.id] ? translationPage[pageItem.id] : '';
                    if (pageName === '') {
                      pageName = pageItem.id;
                    }

                    newItem.page.push(
                      {
                        id: pageItem.id,
                        name: pageName,
                        restriction: 'allow,disabled' // API以第一個值為預設值
                      }
                    );
                  }
                );

                // 功能按鈕權限基本資料 // 按鈕功能限制 allow, hidden, disabled
                const actionList: IDwProgramActionItem[] = JSON.parse(JSON.stringify(prog.action));
                actionList.forEach(
                  actionItem => {
                    let actionName = actionItem.name ? actionItem.name : '';
                    if (actionName === '') {
                      actionName = actionItem.id;
                    }

                    newItem.action.push(
                      {
                        id: actionItem.id,
                        name: actionName,
                        restriction: 'allow,hidden,disabled' // API以第一個值為預設值
                      }
                    );
                  }
                );

                uploadList.push(newItem);
              }
            }
          );

          return uploadList;
        }
      )
    );
  }
}
