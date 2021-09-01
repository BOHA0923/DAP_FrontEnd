import { Injectable } from '@angular/core';

import { IDwRequestOptions } from '../interface/client.interface';
import { DwHttpModule } from '../http.module';


/**
 * 在 framework 裡宣告空的 method, 在 DwDivMaskModule 裡會做替換
 *
 */
@Injectable({
  providedIn: DwHttpModule
})
export class DwHttpLoadMaskService {

  constructor(
  ) {
  }


  /**
   * 開啟遮罩
   *
   */
  showMask(options: IDwRequestOptions): any {

  }


  /**
   * 關閉遮罩
   *
   */
  hideMask(maskId: any): void {

  }


}
