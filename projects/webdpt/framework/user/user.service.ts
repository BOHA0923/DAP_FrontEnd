import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { DwUserStorage } from './user-storage';
import { DwUserModule } from './user.module';


@Injectable({
  providedIn: DwUserModule
})
export class DwUserService {

  /**
  * 取用即時更改內容(存入名稱 = 取出鍵名)
  */
  public userInfo = {};

  constructor(protected userStorage: DwUserStorage) {
    // reload 時, 可以取出已經儲存的資料.
    const userInfo = this.userStorage.get('DwUserInfo');
    if (userInfo) {
      this.userInfo = JSON.parse(userInfo);
    }
  }

  // 取得租戶清單.
  get currTenantList$(): Observable<any[]> {
    console.error('請注意：DwTenantService.currTenantList$ 取代 DwUserService.currTenantList$'); // 警語
    return null;
  }

  /**
   * 儲存內容
   * string 須用 {id: key, value: data}傳入
   */
  public setUser(userInfo: any): void {
    if (!userInfo.id) {
      return;
    }
    this.userInfo[userInfo.id] = userInfo.value;
    this.userStorage.set('DwUserInfo', JSON.stringify(this.userInfo));
  }


  /**
   * 獲取儲存內容(對應id下資料)
   */
  public getUser(key: string): any {
    if (!key) {
      return;
    }

    return this.userInfo[key];
  }

  /**
   * 獲取詳細儲存內容.
   */
  public getUserDetail(): any {
    console.error('getUserInfo() 取代 getUserDetail()'); // 警語
    return this.userInfo;
  }

  /**
   * 清除所有儲存內容(只能清除屬於user的資料).
   */
  public clearUser(): void {
    this.userStorage.remove('DwUserInfo');
    this.userInfo = {};
  }


  /**
   * 取得使用者資訊.
   * return 返回Observable
   */
  public read(userId?: string): Observable<object> {
    const id = (userId) ? userId : this.getUser('userId');
    const info = {
      success: true,
      description: '', // 取值失敗時, 顯示.
      userInfo: null // 取得的回傳值.
    };

    const userInfo = {
      userId: id,
      userName: id
    };

    info.userInfo = userInfo;

    this.setUserInfo(userInfo);

    return Observable.create((observer) => {
      observer.next(info);
      observer.complete(); // 在 create 裡, 需要 complete.
    });
  }

  /**
   * 批次儲存使用者資訊.
   *
   * param {*} userInfo
   */
  public setUserInfo(userInfo: any): void {
    for (const field of Object.keys(userInfo)) {
      this.setUser({ id: field, value: userInfo[field] });
    }
  }

  /**
   * 获取有權限的租户清單.
   *
   * returns {Observable<any>}
   */
  getTenantList(): Observable<any> {
    console.error('請注意：DwTenantService.getTenants() 取代 DwUserService.getTenantList()'); // 警語
    return new Observable((observer): void => {
      observer.next([]);
      observer.complete();
    });
  }

  /**
   * 獲取用戶儲存的信息.
   *
   * param {string} userToken
   * returns {Observable<any>}
   */
  getUserInfo(userId?: string): any {
    return this.userInfo;
  }

  /**
   * 設定租户清單並發送.
   *
   * returns void.
   */
  setTenantList(currTenantList: any): void {
    console.error('請注意：DwTenantService.setTenantList() 取代 DwUserService.setTenantList()'); // 警語
  }

}

