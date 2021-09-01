import { Injectable } from '@angular/core';

import { IDwRequestOptions, IDwRequestUiOptions } from '../interface/client.interface';
import { DwHttpModule } from '../http.module';


/**
 * 在 framework 裡宣告空的 method, 在 DwDivMaskModule 裡會做替換
 *
 */
@Injectable({
  providedIn: DwHttpModule
})
export class DwHttpClientOptionsService {

  constructor(
  ) {
  }


  /**
   * 設定自訂HTTP加載遮罩給HttpClient的options
   *
   * @param [options] 連線參數
   * @param [spinning] 是否顯示
   * @param [delay] 延遲顯示加載效果的時間毫秒（防止閃爍）
   * @param [tip] 描述
   * @returns HttpClient的options
   */
  setLoadMaskCfg(options?: IDwRequestOptions, spinning?: boolean, delay?: number, tip?: string): IDwRequestOptions {
    return null;
  }


  /**
   * 從請求參數中取得前端參數
   *
   */
  getUiOptions(options?: IDwRequestOptions): IDwRequestUiOptions {
    return null;
  }


  /**
   * 從前端參數中取得加載遮罩設定值
   */
  getLoadingMaskCfg(uiOptions: IDwRequestUiOptions): any {
    return null;
  }

}
