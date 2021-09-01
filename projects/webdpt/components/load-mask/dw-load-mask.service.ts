import { Injectable } from '@angular/core';

import { IDwRequestOptions, IDwRequestUiOptions, IDwLoadMaskCfg } from '@webdpt/framework/http';
import { DwLoadingMaskService } from '@webdpt/components/loading';
import { DwLoadMaskOptionsService } from './dw-load-mask-options.service';


@Injectable({
  providedIn: 'root'
})
export class DwLoadMaskService {

  constructor(
    private dwHttpClientOptionsService: DwLoadMaskOptionsService,
    private dwLoadingMaskService: DwLoadingMaskService,
  ) {
  }

  /**
   * 開啟遮罩
   *
   */
  showMask(options?: IDwRequestOptions): any {
    const uiOptions: IDwRequestUiOptions = this.dwHttpClientOptionsService.getUiOptions(options);
    // 加載遮罩
    const loadMaskCfg: IDwLoadMaskCfg = this.dwHttpClientOptionsService.getLoadingMaskCfg(uiOptions);
    const loadingMaskId = this.dwLoadingMaskService.auto(loadMaskCfg.spinning, loadMaskCfg.delay, loadMaskCfg.tip);

    return loadingMaskId;
  }


  /**
   * 關閉遮罩
   *
   */
  hideMask(loadingMaskId: any): void {
    if (!loadingMaskId) {
      return;
    }

    this.dwLoadingMaskService.hide(loadingMaskId);
  }


}
