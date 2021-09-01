import { Injectable } from '@angular/core';

import { IStorage } from './storage.interface';
import { DwStorageModule } from './storage.module';


@Injectable({
  providedIn: DwStorageModule
})
export class BaseStorage implements IStorage {
  private cache = {};

  get(id: string): any {
    return this.cache[id];
  }

  /* 設定資料 */
  set(id: string, value: any): void {
    if (!id) {
      return;
    }

    this.cache[id] = value;
  }

  /* 去除資料 */
  remove(id: string): void {
    delete this.cache[id];
  }

  /* 清除資料 */
  clear(): void {
    localStorage.clear();
  }

  /* 獲取全部資料 */
  getAll(): Array<any> {
    const newDate = [];
    for (let index = 0, len = localStorage.length; index < len; ++index) {
      newDate.push(JSON.parse(localStorage.getItem(localStorage.key(index))));
    }
    return newDate;
  }

}
