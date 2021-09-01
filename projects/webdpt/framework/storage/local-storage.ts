import { Injectable } from '@angular/core';

import { IStorage } from './storage.interface';
import { DwStorageModule } from './storage.module';


@Injectable({
  providedIn: DwStorageModule
})
export class LocalStorage implements IStorage {

  /* 獲取資料 */
  get(id: any): any {
    return localStorage.getItem(id);
  }

  /* 設定資料 */
  set(id: any, value: any): void {
    // contracts
    if (id === null) { return null; }

    localStorage.setItem(id, value);
  }

  /* 去除資料 */
  remove(id: any): void {
    localStorage.removeItem(id);
  }

  /* 清除資料 */
  clear(): void {
    localStorage.clear();
  }

  /* 獲取全部資料 */
  getAll(): Array<any> {
    const newDate = [];
    for (let index = 0, len = localStorage.length; index < len; ++index) {
      newDate.push(localStorage.getItem(localStorage.key(index)));
    }
    return newDate;
  }

}
