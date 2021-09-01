import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { filter } from 'rxjs/operators';

import { DwUserService } from './user.service';
import { DwUserModule } from './user.module';


@Injectable({
  providedIn: DwUserModule
})
export class DwTenantService {
  // token [有效或無效] 狀態.
  tokenValidSubject: BehaviorSubject<boolean>;
  tokenValid = (typeof this.userService.getUser('isLoggedin') === 'boolean') ? this.userService.getUser('isLoggedin') : null;

  // 租戶清單.
  tenantSubject: BehaviorSubject<any[]>;
  currTenantList = (this.userService.getUser('currTenantList')) ? this.userService.getUser('currTenantList') : [];
  tenantInfoRefresh$: Subject<any> = new Subject<any>();

  constructor(
    protected userService: DwUserService
  ) {
    // 使用BehaviorSubject是為了給初始值, 尤其在 F5 reload 時, 可以讀取 session storage 的值.
    this.tokenValidSubject = new BehaviorSubject<boolean>(this.tokenValid);
    this.tenantSubject = new BehaviorSubject<any[]>(this.currTenantList);
  }

  // 廣播 [token有效或無效] 狀態.
  get isTokenValid$(): Observable<boolean> {
    return this.tokenValidSubject.asObservable().pipe(
      filter(obsData => obsData !== null), // 不廣播初始值
      // 登出後再登入, 在重新刷新UserToken時, 當userToken不一樣需要發送 false 時, 會造成無法廣播, 然後把 login 時取到的 token 登出.
      // distinctUntilChanged()
    );
  }

  // 廣播租戶清單.
  get currTenantList$(): Observable<any[]> {
    return this.tenantSubject;
  }


  /**
   * 获取有權限的租户清單.
   *
   * returns {Observable<any>}
   */
  getTenants(): Observable<any> {
    return new Observable((observer): void => {
      this.setTenantList([]);
      observer.next(true);
      observer.complete();
    });
  }



  /**
   * 获取儲存的租户清單.
   *
   * returns {Observable<any>}
   */
  getTenantList(): any {
    return this.userService.getUser('currTenantList');
  }


  /**
   * 設定租户清單並發送.
   *
   * returns void.
   */
  setTenantList(currTenantList: any): void {
    this.userService.setUserInfo({
      currTenantList: currTenantList
    });
    this.currTenantList = currTenantList;
    this.tenantSubject.next(currTenantList);
  }


  /**
   * 設定token [有效或無效] 狀態並發送.
   *
   * returns void.
   */
  setTokenValid(status: boolean): void {
    this.tokenValid = status;
    this.tokenValidSubject.next(this.tokenValid);
  }


  /**
   * 切换租户，重新刷新UserToken, 刷新UserToken時, 需帶入舊的UserToken.
   *
   * param {number} tenantSid: 租戶的 Sid.
   *
   * returns {Observable<any>}
   */
  tokenRefreshTenant(tenantSid: number): Observable<any> {
    return new Observable((observer): void => {
      this.setTokenValid(true);
      this.tenantInfoRefresh$.next({});
      observer.next(true);
      observer.complete();
    });
  }

}
