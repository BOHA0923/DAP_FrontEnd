
import { Injectable } from '@angular/core';
import { IDwRememberLoginModel } from '../model/remember-login.model';
import { LocalStorage } from '@webdpt/framework/storage';


/**
 * 記住我
 */
@Injectable({
  providedIn: 'root'
})
export class DwRememberLoginService {
  constructor(
    private localStorage: LocalStorage,
  ) {
  }

  /**
   * 儲存記住我
   *
   * @param rememberLoginData 登入頁的記住我資訊
   */
  public setRememberLogin(rememberLoginData: IDwRememberLoginModel): void {
    const remember = rememberLoginData.rememberLogin;

    if (remember) {
      Object.keys(rememberLoginData).forEach(
        key => {
          this.localStorage.set(key, rememberLoginData[key]);
        }
      );
    } else {
      this.localStorage.remove('rememberLogin');
      this.localStorage.remove('userId');
      this.localStorage.remove('userName');
      this.localStorage.remove('language');
    }
  }

  /**
   * 取得記住我
   *
   * @returns rememberLoginData 登入頁的記住我資訊
   */
  public getRememberLogin(): IDwRememberLoginModel {
    const rememberLoginData: IDwRememberLoginModel = {
      rememberLogin: false,
      userId: '',
      userName: '',
      language: ''
    };

    const remember = JSON.parse(this.localStorage.get('rememberLogin'));
    if (remember) {
      rememberLoginData.rememberLogin = true;
    }

    if (this.localStorage.get('userId')) {
      rememberLoginData.userId = this.localStorage.get('userId');
    }

    if (this.localStorage.get('userName')) {
      rememberLoginData.userName = this.localStorage.get('userName');
    }

    if (this.localStorage.get('language')) {
      rememberLoginData.language = this.localStorage.get('language');
    }

    return rememberLoginData;
  }
}
