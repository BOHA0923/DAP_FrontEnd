import { Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';

import { Observable } from 'rxjs';
import { IDwAccInfoFormOption } from '@webdpt/framework/account';
import { DwAccountInfoService, DwAccountInfoDataSourceService } from '@webdpt/framework/account';


@Component({
  selector: 'app-account-info',
  templateUrl: './account-info.component.html',
  styleUrls: ['./account-info.component.less']
})
export class AccountInfoComponent implements OnInit {
  formOption: Observable<Array<IDwAccInfoFormOption>>|null = null; // 動態表單設定檔, 當為 null 時, 默認使用內建的動態表單設定
  isShowForm: boolean = false; // 是否顯示 <dw-account-info>
  isUseHeadImage: boolean = true; // 是否使用頭像
  isUseUpdatePassword: boolean = true; // 是否使用變更密碼

  private _userInfo: any = null; // 接收從<dw-account-info>發送出來的用戶基本資料或是在 init 裡取得的.

  constructor(
    private accountInfoService: DwAccountInfoService,
    private accountInfoDataSourceService: DwAccountInfoDataSourceService
  ) {
  }


  ngOnInit(): void {
    // 在<dw-account-info> 初始化時, 就必須先取的一次 userInfo, 因為在 asyncValidators() 裡, 會需要用到保存後的 userInfo
    // 如果預期使用內建的動態表單設定, 以下可以註解
    // this.accountInfoDataSourceService.getUserBasicInfo().subscribe(
    //   (userInfo) => {
    //     this.setUserInfo(userInfo);
    //     this.formOption = this.getFormOption(); // 使用時如果有用到內建的非同步驗證, 需先確認 this._userInfo 有值.
    //     this.isShowForm = true;
    // });

    this.isShowForm = true;
  }


  /**
   * 取得用戶個人基本資料
   *
   * param {*} $event: 從 <dw-account-info> 發送出來的用戶基本資料
   *
   */
  getUserInfoValue($event: any): void {
    this.setUserInfo($event);
  }

  /**
   * 設定用戶個人基本資料
   *
   * param {*} userInfo: 從 <dw-account-info> 發送出來的用戶基本資料或是在 init 裡取得的.
   *
   */
  setUserInfo(userInfo: any): void {
    if (this._userInfo === null) {
      this._userInfo = Object.assign({}, userInfo);
      return;
    }

    // 第一次指定完成後, 如果 this.userInfo 再用等號=賦值, 視為不同 object.
    Object.assign(this._userInfo, userInfo);
  }

  /**
   * 取得動態表單的設定檔
   * [必需使用 Observable]: 樣版 select 的 option 可能會需要調用其他 API 來取得
   *
   */
  private getFormOption(): Observable<Array<IDwAccInfoFormOption>> {
    return Observable.create((observer: any) => {
      // 調用自定義的動態表單設定
      observer.next(this.getConfig());
      observer.complete();
    });
  }


  /**
   * 動態表單的設定檔
   *
   */
  private getConfig(): Array<IDwAccInfoFormOption> {
    const config = [
      {
        type: 'label',
        name: 'id',
        columns: 2,
        label: 'dw-account-info-form-id'
      },
      {
        type: 'input',
        name: 'name',
        columns: 2,
        label: 'dw-account-info-form-name',
        required: true,
        validators: [
          Validators.minLength(3)
        ]
      },
      {
        type: 'input',
        name: 'nickname',
        columns: 2,
        label: 'dw-account-info-form-nickname'
      },
      {
        type: 'radio',
        name: 'sex',
        columns: 2,
        label: 'dw-account-info-form-sex',
        option: [{
          label: 'dw-account-info-form-sex-male',
          value: 'male'
        }, {
          label: 'dw-account-info-form-sex-female',
          value: 'female'
        }, {
          label: 'dw-account-info-form-sex-unknow',
          value: 'unknow'
        }
       ]
      },
      {
        type: 'date',
        name: 'birthday',
        columns: 2,
        label: 'dw-account-info-form-birthday'
      },
      {
        type: 'phone',
        name: 'telephone',
        columns: 2,
        label: 'dw-account-info-form-telephone',
        required: true,
        validators: [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(11),
          this.accountInfoService.userMobilephoneNumeric()
        ],
        asyncValidators: [
          this.accountInfoService.verifyMobilephone(this._userInfo)
        ],
        prefix: {
          type: 'prefixSelect',
          name: 'cellphonePrefix',
          label: '',
          required: true,
          option: [{
            label: '+86',
            value: '+86'
          }, {
            label: '+886',
            value: '+886'
          }],
        }
      },
      {
        type: 'input',
        name: 'email',
        columns: 1,
        label: 'dw-account-info-form-email',
        required: true,
        validators: [
          Validators.required,
          Validators.email
        ],
        asyncValidators: [
          this.accountInfoService.verifyEmailExist(this._userInfo)
        ]
      },
      {
        type: 'input',
        name: 'address',
        columns: 1,
        label: 'dw-account-info-form-address'
      },
      {
        type: 'checkbox',
        name: 'readCheck',
        columns: 1,
        required: true,
        label: 'dw-account-info-form-readCheck'
      }
    ];

    return config;
  }


}
