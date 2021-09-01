import { Component, Input, OnInit, OnDestroy, Inject, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { Subscription, Observable, timer } from 'rxjs';
import { takeUntil, map, finalize } from 'rxjs/operators';
import { DwModalRef } from 'ng-quicksilver/modal';
import { DwModalService } from 'ng-quicksilver/modal';
import { TranslateService } from '@ngx-translate/core';

import { DwSystemConfigService } from '@webdpt/framework/config';
import { IDwUpdatePasswordConfig } from '@webdpt/framework/account';
import { DwUpdatePasswordService } from '@webdpt/framework/account';
import { DwUserService } from '@webdpt/framework/user';

import * as crypto from 'crypto-js';

@Component({
  selector: 'app-update-password-modal',
  templateUrl: './update-password-modal.component.html',
  styleUrls: ['./update-password-modal.component.css']
})
export class DwUpdatePasswordModalComponent implements OnInit, OnDestroy, AfterViewInit {
  private subscription: Subscription = new Subscription();

  showPassword: boolean = false; // 密碼是否使用明碼顯示.
  updatePwdForm: FormGroup; // 綁定 formGroup.
  formData: any; // 表單初始值.

  private countDownDuration: number = 60; // 倒數總秒數.
  countDown: number; // 目前的倒數秒數.
  iscountDown: boolean = false; // 是否已經正在倒數.
  isButtLoading: boolean = false; // 註冊按鈕是否顯示載入中.
  optionList: Array<any> = []; // 驗證方式選單.
  isOnlyMobilephone: boolean = false; // 註冊按鈕是否顯示載入中.

  private userInfo: any = null;

  @Input() formConfig: IDwUpdatePasswordConfig; // 變更密碼表單的設定檔.
  dwMultiTenant: boolean;
  constructor(
    private userService: DwUserService,
    private fb: FormBuilder,
    private dwUpdatePasswordService: DwUpdatePasswordService,
    private dwModalService: DwModalService,
    private translateService: TranslateService,
    private modalRef: DwModalRef,
    private configService: DwSystemConfigService
  ) {
    this.configService.get('multiTenant').subscribe(
      multiTenant => this.dwMultiTenant = multiTenant
    );
  }


  ngOnInit(): void {
    this.getOptionList(); // 取得[驗證方式選單].

    this.formData = {
      selectVerification: this.optionList[0].value, // this.optionList最少會有一個值.
      verificationCode: '',
      password: '',
      repassword: ''
    };


    this.updatePwdForm = this.fb.group({});

    // 驗證方式.
    this.updatePwdForm.addControl('selectVerification',
      new FormControl(this.formData.selectVerification, [
        Validators.required,
        this.validSelectVerification()
      ]
    ));

    // 驗證碼.
    this.updatePwdForm.addControl('verificationCode',
      new FormControl(this.formData.verificationCode, [
        Validators.required
      ]
    ));

    // 密碼.
    this.updatePwdForm.addControl('password',
      new FormControl(this.formData.password, [
        Validators.required,
        this.validPasswordFormat(),
        this.validPasswordEqual()
      ]
    ));

    // 重複密碼, bind 是把指定的[object]綁到 function 裡, 變成 function 裡的 this.
    this.updatePwdForm.addControl('repassword',
      new FormControl(this.formData.repassword, [
        Validators.required,
        this.validPasswordFormat(),
        this.validRePasswordEqual()
      ]
    ));

    // 用戶基本資料
    this.subscription.add(
      this.dwUpdatePasswordService.getUserBasicInfo().subscribe(
        (info: any) => {
          this.userInfo = info;

          if (this.dwMultiTenant) {
            this.updatePwdForm.get('selectVerification').markAsTouched({ onlySelf: true });
            this.updatePwdForm.get('selectVerification').markAsDirty({ onlySelf: true });
            this.updatePwdForm.get('selectVerification').updateValueAndValidity();
          }
        }
      )
    );

  }


  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }


  ngAfterViewInit(): void {
    // 如果是地端, 不需要驗證方式, 必須使用強制修改密碼.
    if (!this.dwMultiTenant) {
      this.updatePwdForm.removeControl('selectVerification');
      this.updatePwdForm.removeControl('verificationCode');
    }
  }


  /**
   * 取得[驗證方式選單].
   *
   */
  private getOptionList(): void {
    // 預設的驗證方式選單.
    const defOption: Array<any> = [
      { label: this.translateService.instant('dw-update-password-mailCode'), value: 'email' },
      { label: this.translateService.instant('dw-update-password-mobileCode'), value: 'mobilephone' },
    ];

    // 如果沒有設定的驗證方式, 指定預設的驗證方式選單.
    if (this.formConfig.verifyType === 'full') {
      this.optionList = defOption;
      return;
    }

    // 提取符合設定驗證方式的選單.
    defOption.forEach((opt) => {
      if (this.formConfig.verifyType === opt.value) {
        this.optionList.push(opt);
      }
    });

    // 已經有符合設定驗證方式時, 不需要往下取預設的驗證方式.
    if (this.optionList.length > 0) {
      return;
    }

    // 如果都比對不到設定的驗證方式, 指定預設的驗證方式選單.
    this.optionList = defOption;
  }


  /**
   * 判斷 [獲取驗證碼] 的 disabled 狀態.
   *
   */
  checkGetCodeDisabled(): boolean {
    if (this.iscountDown || this.updatePwdForm.get('selectVerification').errors || !this.checkUserInfo()) {
      return true;
    }

    return false;
  }


  /**
   * 確認用戶資料是否有 email 或 telephone, 如果沒有這2項資料時, 不允許送出[表單資料]與[獲取驗證碼].
   *
   */
  checkUserInfo(): boolean {
    if (!this.userInfo) {
      return false;
    }

    // 如果是地端時, 不需要驗證用戶的email跟手機
    if (!this.dwMultiTenant) {
      return true;
    }

    if (!this.userInfo.hasOwnProperty('email') && !this.userInfo.hasOwnProperty('telephone')) {
      return false;
    }

    if (!this.userInfo.email && !this.userInfo.telephone) {
      return false;
    }

    return true;
  }


  /**
   * 依據不同的驗證方式, 對不同的 API 發出 request 取得驗證碼.
   *
   */
  private getCodeByType(): Observable<any> {
    if (this.updatePwdForm.get('selectVerification').value === 'email') {
      return this.dwUpdatePasswordService.getVerificationCode('email', this.userInfo.email);
    }

    return this.dwUpdatePasswordService.getVerificationCode('mobilephone', this.userInfo.telephone);
  }


  /**
   * 獲取驗證碼(60秒內不能重複獲取驗證碼，秒數倒數).
   *
   */
  getCode(): void {
    this.iscountDown = true;

    const oneSecond = 1000; // 1 秒 = 1000 毫秒.
    const interval = oneSecond; // 間隔秒數.
    const duration = this.countDownDuration * oneSecond; // 持續秒數.
    this.countDown = this.countDownDuration; // 給定初始值, 因為要等 http 回來後才開始倒數.

    // 調用 API 發送手機驗證碼.
    this.getCodeByType().subscribe(
      (success) => {
        let content = this.translateService.instant('dw-update-password-confirmCodeSMS');
        if (this.updatePwdForm.get('selectVerification').value === 'email') {
          content = this.translateService.instant('dw-update-password-confirmCodeMailbox');
        }

        this.dwModalService.success({
          dwTitle: this.translateService.instant('dw-update-password-sentSuccessfully'),
          dwContent: content
        });

        // timer - 給定持續時間後，再按照指定間隔時間依次發出數字(如果沒有takeUntil中止, 會一直持續下去).
        // takeUntil - 發出值，直到提供的 observable 發出值，它便完成.
        // finalize - 當 Observable 完成或報錯時呼叫函式.
        // 從 0 秒開始, 每 1 秒發出值, 直到 (duration + interval) 秒後復歸.
        const stream$ = timer(0, interval).pipe(
          takeUntil(timer(duration + interval)), // timer() 的中止條件, timer() 如果沒有第 2 個參數, 表示發出後就結束.
          map(value => {
            return (duration - (value * interval));
          }),
          finalize(() => {
            this.countDown = this.countDownDuration;
            this.iscountDown = false;
          })
        );

        stream$.subscribe(value => {
          this.countDown = value / oneSecond;
        });

      },
      (objError) => {
        console.log('error>>>>', objError);

        this.countDown = this.countDownDuration;
        this.iscountDown = false;

        if (objError.hasOwnProperty('error') && objError.error.hasOwnProperty('message') && objError.error.message) {
          this.dwModalService.error({
            dwTitle: this.translateService.instant('dw-http-error'),
            dwContent: objError.error.message
          });
        } else {
          throw objError;
        }
      }
    );

  }


  /**
   * 當驗證方式為 mobilephone 時, 需提示目前只開放大陸區(86+).
   *
   */
  switVerification(): void {
    this.isOnlyMobilephone = false;

    if (this.updatePwdForm.get('selectVerification').value === 'mobilephone') {
      this.isOnlyMobilephone = true;
    }
  }


  /**
   * 會根據 FormControl 的狀態自動生成校驗狀態 - 直接使用css定義驗證方式的顯示字顏色.
   *
   */
  // checkValidateStatus(control: string): string | null {
  //   if (this.updatePwdForm.get(control).errors) {
  //     return 'error';
  //   }
  //   return null;
  // }


  /**
   * 確定按鈕.
   *
   */
  emitFormData(): void {
    this.isButtLoading = true;
    this.passwordUpdate().subscribe(
      (resp: any) => {
        this.dwModalService.success({
          dwTitle: this.translateService.instant('dw-update-password-sentSuccessfully'),
          dwContent: this.translateService.instant('dw-update-password-updatedSuccessfully')
        });
        this.modalRef.triggerOk();
      },
      (objError: any) => {
        console.log('objError>>>>', objError);
        this.isButtLoading = false;
        if (objError.hasOwnProperty('error') && objError.error.hasOwnProperty('message') && objError.error.message) {
          this.dwModalService.error({
            dwTitle: this.translateService.instant('dw-http-error'),
            dwContent: objError.error.message
          });
        } else {
          throw objError;
        }
      }
    );
  }


  /**
   * 變更密碼.
   *
   */
  private passwordUpdate(): Observable<any> {
    if (this.dwMultiTenant) {
      return this.userPasswordUpdate();
    }

    return this.userPasswordUpdateForce();
  }


  /**
   * 通過手機號、邮箱修改密碼
   *
   */
  private userPasswordUpdate(): Observable<any> {
    const account = (this.updatePwdForm.get('selectVerification').value === 'email') ? this.userInfo.email : this.userInfo.telephone;

    return this.dwUpdatePasswordService.userPasswordUpdate({
      account: account, // 類型：String 必有字段 備註：手機號或郵箱帳號
      password: this.updatePwdForm.get('password').value, // 類型：String 必有字段 備註：新密碼
      verificationCode: this.updatePwdForm.get('verificationCode').value // 類型：String 必有字段 備註：驗證碼
    });
  }


  /**
   * 強制更新用戶密碼
   *
   */
  private userPasswordUpdateForce(): Observable<any> {
    const encryptOnce = crypto.SHA256(this.updatePwdForm.get('password').value);
    const encryptTwice = crypto.SHA256(encryptOnce);
    const encryptThird = crypto.enc.Base64.stringify(encryptTwice);

    return this.dwUpdatePasswordService.userPasswordUpdateForce({
      id: this.userService.getUser('userId'), // 類型：String 可有字段 備註：用戶Id與Sid不能同時為空
      newPasswordHash: encryptThird // 類型：String 可有字段 備註：用戶密碼與加密後的密碼不能同時為空
    });

  }

  /**
   * 取消按鈕
   *
   */
  cancel(): void {
    this.modalRef.triggerCancel();
  }


  /**
   * [驗證]-驗證方式
   *
   */
  validSelectVerification(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      if (!control.value || !this.userInfo) {
        return null;
      }

      switch (control.value) {
        case 'email':
          if (!this.userInfo.hasOwnProperty('email') || !this.userInfo.email) {
            return { 'mailNotExist': true };
          }
          break;

        case 'mobilephone':
          if (!this.userInfo.hasOwnProperty('telephone') || !this.userInfo.telephone) {
            return { 'mobilephoneNotExist': true };
          }
          break;
      }

      return null;
    };

  }


  /**
   * [驗證]-2個密碼要一樣-在輸入[新密碼]時, 預期同步驗證[確認新密碼].
   *
   */
  validPasswordEqual(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      if (!control.value) {
        return null;
      }

      // 驗證[確認新密碼].
      this.updatePwdForm.get('repassword').updateValueAndValidity();
      return null;
    };

  }


  /**
   * [驗證]-2個密碼要一樣.
   *
   */
  validRePasswordEqual(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      if (!control.value) {
        return null;
      }

      if (control.value === this.updatePwdForm.get('password').value) {
        return null;
      }

      return { 'userPasswordEqual': true };
    };
  }


  /**
   * [驗證]-密碼格式為英文+數字.
   *
   */
  validPasswordFormat(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      if (!control.value) {
        return null;
      }

      // 密碼不能全數字.
      if (new RegExp('^[0-9]*$').test(control.value)) {
        return { 'userPasswordFormat': true };
      }

      // 密碼不能全英文.
      if (new RegExp('^[a-zA-Z]*$').test(control.value)) {
        return { 'userPasswordFormat': true };
      }

      // 密碼不能有英文+數字以外的字.
      if (!new RegExp('^[0-9a-zA-Z]*$').test(control.value)) {
        return { 'userPasswordFormat': true };
      }

      // 密碼只能是英文+數字
      return null;
    };
  }

}
