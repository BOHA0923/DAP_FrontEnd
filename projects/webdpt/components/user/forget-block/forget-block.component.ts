import { Component, OnInit, Inject, Input } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, ValidatorFn, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, timer } from 'rxjs';
import { takeUntil, map, finalize, switchMap } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { DwModalService } from 'ng-quicksilver/modal';
import { DwSystemConfigService } from '@webdpt/framework/config';

import { LONIG_DEFAULT } from '@webdpt/framework/config';
import { DwForgetService } from '@webdpt/framework/account';
import { IDwForgetverificationType } from '@webdpt/framework/account';


@Component({
  selector: 'dw-forget-block',
  templateUrl: './forget-block.component.html',
  styleUrls: ['./forget-block.component.css']
})

export class DwForgetBlockComponent implements OnInit {
  showPassword: boolean = false; // 密碼是否使用明碼顯示.
  forgetForm: FormGroup; // 綁定 formGroup.
  formValue: any; // 表單初始值.

  countDownDuration: number = 60; // 倒數總秒數.
  countDown; // 目前的倒數秒數.
  iscountDown: boolean = false; // 是否已經正在倒數.
  isButtLoading: boolean = false; // 註冊按鈕是否顯示載入中.
  optionList: Array<any> = []; // 驗證方式選單.

  @Input() verificationType: Array<IDwForgetverificationType>; // 在 ForgetComponent 裡設定的驗證方式.

  private _mobilephoneLength: number = 11; // 手機號碼長度.

  private dwMultiTenant: boolean;
  constructor(
    private router: Router,
    private forgetService: DwForgetService,
    private dwModalService: DwModalService,
    private translateService: TranslateService,
    private fb: FormBuilder,
    @Inject(LONIG_DEFAULT) private defaultLogin: string,
    private configService: DwSystemConfigService
  ) {
    this.configService.get('multiTenant').subscribe(
      multiTenant => this.dwMultiTenant = multiTenant
    );
  }


  ngOnInit(): void {
    this.getOptionList(); // 取得[驗證方式選單].

    this.formValue = {
      selectVerification: this.optionList[0].value, // this.optionList最少會有一個值.
      verificationCode: '',
      mobilephonePrefix: '+86',
      mobilephone: '',
      email: '',
      password: '',
      repassword: ''
    };


    this.forgetForm = this.fb.group({});

    // 驗證方式.
    this.forgetForm.addControl('selectVerification',
      new FormControl(this.formValue.selectVerification, [
        Validators.required
      ]
      ));

    // 驗證碼.
    this.forgetForm.addControl('verificationCode',
      new FormControl(this.formValue.verificationCode, [
        Validators.required
      ]
      ));

    // 密碼.
    this.forgetForm.addControl('password',
      new FormControl(this.formValue.password, [
        Validators.required
      ]
      ));

    // 重複密碼, bind 是把指定的[object]綁到 function 裡, 變成 function 裡的 this.
    this.forgetForm.addControl('repassword',
      new FormControl(this.formValue.repassword, [
        Validators.required,
        this.userPasswordEqual('password', this.forgetForm)
      ]
      ));

    // 切換驗證方式
    this.switVerification();

    // 前端卡控, 若dwMultiTenant為false時, 不提供忘記密碼.
    if (!this.dwMultiTenant) {
      this.router.navigateByUrl(this.defaultLogin);
    }
  }


  /**
   * 取得[驗證方式選單].
   *
   * private
   * returns {void}
   */
  private getOptionList(): void {
    // 預設的驗證方式選單.
    const defOption: Array<any> = [
      { label: this.translateService.instant('dw-forget-mailCode'), value: 'email' },
      { label: this.translateService.instant('dw-forget-mobileCode'), value: 'mobilephone' },
    ];

    // 如果沒有設定的驗證方式, 指定預設的驗證方式選單.
    if (!this.verificationType || this.verificationType.length === 0) {
      this.optionList = defOption;
      return;
    }

    // 提取符合設定驗證方式的選單.
    defOption.forEach((opt) => {
      if (this.verificationType.indexOf(opt.value) !== -1) {
        this.optionList.push(opt);
      }
    });

    if (this.optionList.length > 0) {
      return;
    }

    // 如果都比對不到設定的驗證方式, 指定預設的驗證方式選單.
    this.optionList = defOption;
  }


  // 確定按鈕.
  emitDataOutside(): void {
    this.isButtLoading = true;
    this.updatePassword().subscribe(
      (resp: any) => {
        this.dwModalService.success({
          dwTitle: this.translateService.instant('dw-forget-sentSuccessfully'),
          dwContent: this.translateService.instant('dw-forget-updatedSuccessfully')
        });
        this.router.navigateByUrl(this.defaultLogin);
      }, (objError: any) => {
        console.log('objError>>>>', objError);
        this.isButtLoading = false;
        if (!objError.hasOwnProperty('error') || !objError.error.hasOwnProperty('message') || !objError.error.message) {
          throw objError;
        }
      });
  }

  // 取消按鈕
  cancel(e: any): void {
    this.router.navigateByUrl(this.defaultLogin);
  }

  // <dw-input-group> 的 has-error, 需要在<dw-form-control> 裡加 [dwValidateStatus].
  checkMobilephoneError(): string | null {
    const objTelephone = this.forgetForm.get('mobilephone');
    // 有修改, 有值, 無報錯, 才進行檢查.
    if (objTelephone.dirty && objTelephone.errors) {
      return 'error';
    }

    return;
  }


  // 判斷 [獲取驗證碼] 的 disabled 狀態.
  checkGetCodeDisabled(): boolean {
    if (this.iscountDown) {
      return true;
    }

    if (this.forgetForm.get('selectVerification').value === 'email') {
      const objEmail = this.forgetForm.get('email');
      if (objEmail.dirty && !objEmail.errors && objEmail.value) {
        return false;
      }
      return true;
    }

    const objMobilephone = this.forgetForm.get('mobilephone');
    if (objMobilephone.dirty && !objMobilephone.errors && objMobilephone.value) {
      return false;
    }

    return true;
  }

  // 依據不同的驗證方式, 對不同的 API 發出 request 取得驗證碼.
  private getCodeByType(): Observable<any> {
    if (this.forgetForm.get('selectVerification').value === 'email') {
      return this.forgetService.getVerificationCode('email', this.forgetForm.get('email').value);
    }

    return this.forgetService.getVerificationCode('mobilephone', this.forgetForm.get('mobilephone').value);
  }

  // 獲取驗證碼(60秒內不能重複獲取驗證碼，秒數倒數).
  getCode(): void {
    this.iscountDown = true;

    const oneSecond = 1000; // 1 秒 = 1000 毫秒.
    const interval = oneSecond; // 間隔秒數.
    const duration = this.countDownDuration * oneSecond; // 持續秒數.
    this.countDown = this.countDownDuration; // 給定初始值, 因為要等 http 回來後才開始倒數.

    // 調用 API 發送手機驗證碼.
    this.getCodeByType().subscribe((success) => {
      if (success === null) {
        this.dwModalService.error({
          dwTitle: this.translateService.instant('dw-http-error')
        });
        return;
      }

      let content = this.translateService.instant('dw-forget-confirmCodeSMS');
      if (this.forgetForm.get('selectVerification').value === 'email') {
        content = this.translateService.instant('dw-forget-confirmCodeMailbox');
      }

      this.dwModalService.success({
        dwTitle: this.translateService.instant('dw-forget-sentSuccessfully'),
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

    }, (objError) => {
      console.log('error>>>>', objError);

      this.countDown = this.countDownDuration;
      this.iscountDown = false;

      if (!objError.hasOwnProperty('error') || !objError.error.hasOwnProperty('message') || !objError.error.message) {
        throw objError;
      }

    });

  }


  // 切換驗證方式時, setValidators.
  switVerification(): void {
    switch (this.forgetForm.get('selectVerification').value) {
      case 'email':
        this.forgetForm.removeControl('mobilephonePrefix');
        this.forgetForm.removeControl('mobilephone');

        // 電子信箱.
        this.forgetForm.addControl('email',
          new FormControl(this.formValue.email, [
            Validators.required,
            Validators.email
          ], [
            this.verifyEmailExist()
          ]
          ));
        break;

      case 'mobilephone':
        this.forgetForm.removeControl('email');

        // 手機號碼(國別碼).
        this.forgetForm.addControl('mobilephonePrefix',
          new FormControl(this.formValue.mobilephonePrefix)
        );

        // 手機號碼.
        this.forgetForm.addControl('mobilephone',
          new FormControl(this.formValue.mobilephone, [
            Validators.required,
            Validators.minLength(this._mobilephoneLength),
            Validators.maxLength(this._mobilephoneLength),
            this.userMobilephoneNumeric()
          ], [
              this.verifyMobilephone()
          ]
          ));

        break;
    }
  }

  // 送出更新密碼.
  updatePassword(): Observable<any> {
    const selectVerification = this.forgetForm.get('selectVerification').value;
    return this.forgetService.updatePassword({
      account: ((selectVerification === 'email') ? this.forgetForm.get('email').value : this.forgetForm.get('mobilephone').value),
      password: this.forgetForm.get('password').value,
      verificationCode: this.forgetForm.get('verificationCode').value,
      selectVerification: this.forgetForm.get('selectVerification').value
    });

  }

  // [驗證]-重複密碼要一樣, inputName: 指的是要跟那一個欄位比對.
  userPasswordEqual(inputName: string, theFormGroup: FormGroup): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      return !control.value ? null :
        (control.value === theFormGroup.get(inputName).value ? null : { 'userPasswordEqual': true });
    };
  }


  // [驗證]-手機號碼需為11個數字.
  userMobilephoneNumeric(): ValidatorFn {
    const reg = new RegExp('^(\\d|[0-9]+)$');
    return (control: AbstractControl): { [key: string]: any } => {
      return (!control.value) ? null :
        (!reg.test(control.value) ? { 'userMobilephoneNumeric': true } : null);
    };
  }

  // [驗證]-E-mail需要存在.
  verifyEmailExist(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return timer(500).pipe(
        switchMap(() => {
          return this.forgetService.verifyExist('email', control.value).pipe(
            map(res => (res.isRegister === true) ? null : {'emailNotExist': true})
          );
        })
      );
    };
  }



  // [驗證]-手機號碼需要存在.
  verifyMobilephone(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return timer(500).pipe(
        switchMap(() => {
          return this.forgetService.verifyExist('telephone', control.value).pipe(
            map(res => (res.isRegister === true) ? null : { 'mobilephoneNotExist': true })
          );
        })
      );
    };
  }

}


