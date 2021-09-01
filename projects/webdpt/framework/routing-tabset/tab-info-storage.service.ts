import { Inject, Injectable } from '@angular/core';
import { DW_TAB_STORE_STRATEGY } from '@webdpt/framework/config';
import { BaseStorage } from '@webdpt/framework/storage';
import { IStorage } from '@webdpt/framework/storage';
import { LocalStorage } from '@webdpt/framework/storage';
import { SessionStorage } from '@webdpt/framework/storage';

@Injectable({
  providedIn: 'root'
})
export class DwTabInfoStorageService implements IStorage {
  storage: IStorage;
  constructor(
    @Inject(DW_TAB_STORE_STRATEGY) private strategy: string,
    localStorage: LocalStorage,
    sessionStorage: SessionStorage
  ) {
    switch (strategy) {
      // LocalStorage
      case 'local':
        this.storage = localStorage;
        break;
      // SessionStorage
      case 'session':
        this.storage = sessionStorage;
        break;
      // 儲存在記憶體 (不儲存)
      default:
        this.storage = new BaseStorage();
    }
  }

  clear(): void {
    this.storage.clear();
  }

  get(id: string): any {
    return this.storage.get(id);
  }

  getAll(): Array<any> {
    return this.storage.getAll();
  }

  remove(id: string): void {
    this.storage.remove(id);
  }

  set(id: string, value: string): void {
    this.storage.set(id, value);
  }
}
