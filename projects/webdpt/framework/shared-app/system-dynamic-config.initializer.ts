import { Injectable } from '@angular/core';

import { SessionStorage } from '@webdpt/framework/storage';

/**
 * 環境變數動態設定初始化
 */
@Injectable()
export class DwSystemDynamicConfigInitializer {
  private dwSystemDynamicConfig = {};

  constructor(
    private sessionStorage: SessionStorage,
  ) {
  }

  /**
   * 環境變數設定初始化
   *
   * 設定後就不再改變，適用於TOKEN初始化。
   * 採用優先順序：1.原環境變數 2.Session Storage 3.URL參數(順位最低，避免使用者亂改)
   *
   * @param original 原始設定
   * @param paramName URL參數名稱
   * @param storageKey Session Storage 儲存變數名稱
   * @returns newValue 設定值
   */
  configInit(paramName: string, storageKey: string): string {
    let newValue = '';
    const storageRoot = 'dwSystemDynamicConfig';
    let find = false; // 是否有找到動態設定值

    // Session Storage
    const storageData = this.sessionStorage.get(storageRoot);

    if (storageData) {
      const storageObj = JSON.parse(storageData);

      if (storageObj.hasOwnProperty(storageKey)) {
        find = true;
        newValue = storageObj[storageKey];
      }
    }

    // URL參數，要儲存在Session Storage
    if (!find) {
      const initUrl = new URL(location.href);
      const paramAppToken = initUrl.searchParams.get(paramName);

      if (paramAppToken) {
        find = true;
        newValue = paramAppToken;

        this.dwSystemDynamicConfig[storageKey] = newValue;
        this.sessionStorage.set(storageRoot, JSON.stringify(this.dwSystemDynamicConfig));
      }
    }

    return newValue;
  }
}
