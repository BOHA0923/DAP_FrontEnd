import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { IDwDefaultAppInfo } from '../interface/default-app.interface';
import { DwDefaultAppModule } from '../default-app.module';


/**
 * 首頁路由儲存庫
 */
@Injectable({
  providedIn: DwDefaultAppModule
})
export class DwDefaultAppRepository {
  constructor(
  ) {
  }

  public createInfo(): IDwDefaultAppInfo {
    return {
      execType: null, // DB沒資料就還會是null
      programId: '',
      queryParams: {},
      routerLink: null
    };
  }

  /**
   * 取得首頁設定
   *
   * @param level 首頁層級,'common':共用, 'user':用戶自身, '':用戶使用的自定義首頁
   */
  public getMyHomeInfo(level: string): Observable<IDwDefaultAppInfo> {
    return this.getMyHomeInfoNull();
  }

  /**
   * 沒有啟用首頁設定時回傳的空資料
   */
  public getMyHomeInfoNull(): Observable<IDwDefaultAppInfo> {
    return Observable.create(
      (observer: any) => {
        const defaultAppInfo: IDwDefaultAppInfo = this.createInfo();

        observer.next(defaultAppInfo);
        observer.complete();
      }
    );
  }
}
