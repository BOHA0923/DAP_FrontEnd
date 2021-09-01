import { Injectable } from '@angular/core';

import { IStorage } from './storage.interface';
import { DwStorageModule } from './storage.module';


@Injectable({
  providedIn: DwStorageModule
})
export class SessionStorage implements IStorage {

  /* 獲取資料 */
  get(id: any): any {
    return sessionStorage.getItem(id);
  }

  /* 設定資料 */
  set(id: any, value: any): void {
    // contracts
    if (id === null) { return null; }

    sessionStorage.setItem(id, value);
  }

  /* 去除資料 */
  remove(id: any): void {
    sessionStorage.removeItem(id);
  }

  /* 清除資料 */
  clear(): void {
    sessionStorage.clear();
  }

  /* 獲取全部資料 */
  getAll(): Array<any> {
    const newDate = [];
    for (let index = 0, len = sessionStorage.length; index < len; ++index) {
      newDate.push(sessionStorage.getItem(sessionStorage.key(index)));
    }
    return newDate;
  }

}
