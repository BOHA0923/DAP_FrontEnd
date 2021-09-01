import { Injectable } from '@angular/core';

/**
 * 暫時使用，儲存開窗回傳值
 *
 * @export
 * @class SaveService
 */
@Injectable()
export class SaveService {

  saveList;

  /**
   * 儲存
   *
   * @param data
   * @memberof SaveService
   */
  save(data: any): void {
    this.saveList = data;
  }

  /**
   * 取出
   *
   * @returns {*}
   * @memberof SaveService
   */
  get(): any {
    return this.saveList;
  }
}
