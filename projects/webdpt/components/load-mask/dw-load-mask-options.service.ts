import { Injectable } from '@angular/core';

import { IDwRequestOptions, IDwRequestUiOptions, IDwLoadMaskCfg } from '@webdpt/framework/http';
import { DwLoadingMaskService } from '@webdpt/components/loading';


@Injectable({
  providedIn: 'root'
})
export class DwLoadMaskOptionsService {

  public constructor(
    public dwLoadingMaskService: DwLoadingMaskService
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
    const opt: IDwRequestOptions = Object.assign({}, options);
    const uiOptions: IDwRequestUiOptions = this.getUiOptions(opt);
    const loadMaskCfg: IDwLoadMaskCfg = this.dwLoadingMaskService.nullConfig();

    if (uiOptions) {
      if (!uiOptions.hasOwnProperty('loadMaskCfg')) {
        opt.uiOptions.loadMaskCfg = loadMaskCfg;
      }
    } else {
      opt['uiOptions'] = {
        loadMaskCfg: loadMaskCfg
      };
    }

    if (spinning !== undefined && spinning !== null) {
      opt.uiOptions.loadMaskCfg.spinning = spinning;
    }

    if (delay !== undefined && delay !== null) {
      opt.uiOptions.loadMaskCfg.delay = delay;
    }

    if (tip !== undefined && tip !== null) {
      opt.uiOptions.loadMaskCfg.tip = tip;
    }

    return opt;
  }


  /**
   * 從請求參數中取得前端參數
   *
   */
  getUiOptions(options?: IDwRequestOptions): IDwRequestUiOptions {
    let uiOptions: IDwRequestUiOptions = null;

    if (options) {
      if (options.hasOwnProperty('uiOptions')) {
        uiOptions = options.uiOptions;
      }
    }

    return uiOptions;
  }


  /**
   * 從前端參數中取得加載遮罩設定值
   *
   */
  getLoadingMaskCfg(uiOptions: IDwRequestUiOptions): IDwLoadMaskCfg {
    const loadMaskCfg: IDwLoadMaskCfg = this.dwLoadingMaskService.nullConfig();

    if (uiOptions) {
      if (uiOptions.hasOwnProperty('loadMaskCfg')) {
        const uiCfg = uiOptions.loadMaskCfg;

        if (uiCfg.hasOwnProperty('spinning')) {
          loadMaskCfg.spinning = uiCfg.spinning;
        }

        if (uiCfg.hasOwnProperty('delay')) {
          loadMaskCfg.delay = uiCfg.delay;
        }

        if (uiCfg.hasOwnProperty('tip')) {
          loadMaskCfg.tip = uiCfg.tip;
        }
      }
    }

    return loadMaskCfg;
  }

}
