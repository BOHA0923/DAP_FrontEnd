import { Injectable, Inject, isDevMode } from '@angular/core';

import { Observable, BehaviorSubject } from 'rxjs';
import { filter, distinctUntilChanged } from 'rxjs/operators';

import { IDwOperationMap, IDwProgramData, IDwProgramPage, IDwProgramAction } from './interface/program.interface';
import { dwProgramDataFramework } from '@webdpt/framework/config';
import { dwProgramDataDev } from '@webdpt/framework/config';
import { programInfoJson } from '@webdpt/framework/config';
import { programPageInfoJson } from '@webdpt/framework/config';
import { programActionInfoJson } from '@webdpt/framework/config';
import { DW_PROGRAM_JSON, DW_PROGRAM_ACTION, DW_PROGRAM_PAGE } from '@webdpt/framework/config';
import { DwOperationModule } from './operation.module';


@Injectable({
  providedIn: DwOperationModule
})
export class DwProgramInfoListJsonService {
  private _programListJsonMap: IDwOperationMap;
  private programListJsonSubject: BehaviorSubject<IDwOperationMap>;
  private _dwProgramDataFramework: Array<IDwProgramData>;

  constructor(
    @Inject(DW_PROGRAM_JSON) private dwProgramJson: Array<any>, // 作業清單靜態設定檔
    @Inject(DW_PROGRAM_PAGE) private dwProgramPageJson: Array<IDwProgramPage>, // 作業子頁面設定檔
    @Inject(DW_PROGRAM_ACTION) private dwProgramActionJson: Array<IDwProgramAction>, // 作業功能設定檔
  ) {
    this._programListJsonMap = null;
    this.programListJsonSubject = new BehaviorSubject<IDwOperationMap>(this._programListJsonMap);

    // 平台架構作業
    this._dwProgramDataFramework = JSON.parse(JSON.stringify(dwProgramDataFramework));

    if (isDevMode()) {
      const _dwProgramDataDev: Array<IDwProgramData> = JSON.parse(JSON.stringify(dwProgramDataDev)); // 開發工具作業
      this._dwProgramDataFramework = this._dwProgramDataFramework.concat(_dwProgramDataDev);
    }

    // 應用作業
    let programData: Array<IDwProgramData> = JSON.parse(JSON.stringify(this.dwProgramJson));
    if (!Array.isArray(programData)) {
      programData = [];
    }
    // 應用作業子頁面
    let programPageData: Array<IDwProgramPage> = JSON.parse(JSON.stringify(this.dwProgramPageJson));
    if (!Array.isArray(programPageData)) {
      programPageData = [];
    }
    // 應用作業功能
    let programActionData: Array<IDwProgramAction> = JSON.parse(JSON.stringify(this.dwProgramActionJson));
    if (!Array.isArray(programActionData)) {
      programActionData = [];
    }

    // 應用填上作業子頁面、功能
    programData.forEach(
      prog => {
        const pageLen = programPageData.length;
        for (let i = 0; i < pageLen; i++) {
          if (programPageData[i].programId === prog.id) {
            prog.page = JSON.parse(JSON.stringify(programPageData[i].page));
            break;
          }
        }

        const actLen = programActionData.length;
        for (let i = 0; i < actLen; i++) {
          if (programActionData[i].programId === prog.id) {
            prog.action = JSON.parse(JSON.stringify(programActionData[i].action));
            break;
          }
        }
      }
    );

    // 指定使用平台作業
    const len = programData.length;
    const programWebdptData: Array<any> = JSON.parse(JSON.stringify(programInfoJson)); // 平台作業
    const programPageWebdptData: Array<IDwProgramPage> = JSON.parse(JSON.stringify(programPageInfoJson)); // 平台作業子頁面
    const pageWebdptLen = programPageWebdptData.length;
    const programActionWebdptData: Array<IDwProgramAction> = JSON.parse(JSON.stringify(programActionInfoJson)); // 平台作業功能
    const actWebdptLen = programActionWebdptData.length;

    programWebdptData.forEach(
      programW => {
        for (let i = 0; i < len; i++) {
          if (programData[i].id === programW.id) {
            programData[i] = JSON.parse(JSON.stringify(programW)); // 填上此平台作業資訊

            for (let j = 0; j < pageWebdptLen; j++) {
              if (programPageWebdptData[j].programId === programW.id) {
                programData[i].page = JSON.parse(JSON.stringify(programPageWebdptData[j].page));
              }
            }

            for (let j = 0; j < actWebdptLen; j++) {
              if (programActionWebdptData[j].programId === programW.id) {
                programData[i].action = JSON.parse(JSON.stringify(programActionWebdptData[j].action));
              }
            }

            break;
          }
        }
      }
    );

    // 合併平台架構與應用
    const listJson = [
      ...this.dwProgramInfoFrameworkJson, // 平台架構作業
      ...programData // Program靜態設定檔
    ];

    this._programListJsonMap = {};
    listJson.forEach(
      item => {
        const programId = item.id;

        if (!item.hasOwnProperty('page')) {
          item.page = [];
        }

        if (!item.hasOwnProperty('action')) {
          item.action = [];
        }

        // 調整成符合 IDwProgram 資料型態
        delete item['id'];
        this._programListJsonMap[programId] = item;

        // // string -> txt -> excel分隔符號為"^"
        // const testList = '{"id":"^' + programId
        //   + '^\'","type":"^' + (item.type ? item.type : '')
        //   + '^\'","name":"^' + item.name
        //   + '^\'","routerLink":"^' + (item.routerLink ? item.routerLink : '')
        //   + '^\'"},';
        // console.log(testList);
      }
    );

    const listMap = Object.assign({}, this._programListJsonMap); // 僅複製屬性值，不是深層複製(deep clone)
    this.programListJsonSubject.next(listMap);
  }

  /**
   * 取得作業清單靜態設定檔
   */
  get programListJsonMap$(): Observable<IDwOperationMap> {
    return this.programListJsonSubject.asObservable().pipe(
      filter(obsData => obsData !== null), // 不廣播初始值
      distinctUntilChanged() // 有改變時才廣播
    );
  }

  /**
   * 取得作業清單靜態設定檔
   */
  get programListJsonMap(): IDwOperationMap {
    const listMap = {};

    Object.keys(this._programListJsonMap).forEach(
      key => {
        const item = Object.assign({}, this._programListJsonMap[key]);
        listMap[key] = item;
      }
    );

    return listMap;
  }

  /**
   * 平台架構作業
   */
  get dwProgramInfoFrameworkJson(): Array<IDwProgramData> {
    return JSON.parse(JSON.stringify(this._dwProgramDataFramework));
  }
}
