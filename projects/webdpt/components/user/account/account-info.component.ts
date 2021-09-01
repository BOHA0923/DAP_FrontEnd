import { Component, OnInit, Input, Inject, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';

import { Observable, Subject, forkJoin, of } from 'rxjs';
import { switchMap, map, filter } from 'rxjs/operators';
import { UploadFile } from 'ng-quicksilver/upload';
import { DwModalService } from 'ng-quicksilver/modal';
import { TranslateService } from '@ngx-translate/core';

import { IDwAccInfoFormOption, DwAccountInfoService, DwAccountInfoDataSourceService, DwAccountInfoUploadService } from '@webdpt/framework/account';

import { DwUpdatePasswordModalService } from '@webdpt/components/modals/update-password';
import { APP_DATE_FORMAT } from '@webdpt/framework/config';
import { DwSystemConfigService } from '@webdpt/framework/config';


@Component({
  selector: 'dw-account-info',
  templateUrl: './account-info.component.html',
  styleUrls: ['./account-info.component.less']
})
export class DwAccountInfoComponent implements OnInit {
  accountInfoForm: FormGroup; // 綁定 formGroup.
  isShowForm: boolean = false; // 解析[動態表單設定檔]與[用戶基本資料]完成後, 才顯示動態表單.
  headImage: any[] = []; // 頭像
  isButtLoading: boolean = false; // 保存按鈕是否顯示載入中.

  private dwMultiTenant: boolean;
  private _formOption: Array<IDwAccInfoFormOption> = []; // 動態表單設定檔
  private _userInfo: any = null; // 用戶基本資料
  private _isUseHeadImage: boolean = true; // 默認使用頭像
  private _isUseUpdatePassword: boolean = true; // 默認使用變更密碼

  @Output() userInfoValue = new EventEmitter();
  @Input() formOption$: Observable<Array<IDwAccInfoFormOption>>|null; // 動態表單設定檔

  // 是否提供頭像
  @Input()
  set isUseHeadImage(val: boolean) {
    this._isUseHeadImage = (typeof val === 'string') ? JSON.parse(val) : val; // 預防 boolean 字串.
  }
  get isUseHeadImage(): boolean {
    return this._isUseHeadImage;
  }

  // 是否使用修改密碼
  @Input()
  set isUseUpdatePassword(val: boolean) {
    this._isUseUpdatePassword = (typeof val === 'string') ? JSON.parse(val) : val; // 預防 boolean 字串.
  }
  get isUseUpdatePassword(): boolean {
    return this._isUseUpdatePassword;
  }

  // 動態表單設定檔
  set formOption(params: Array<IDwAccInfoFormOption>) {
    this._formOption = this.accountInfoService.getFullConfig(params);
  }
  get formOption(): Array<IDwAccInfoFormOption> {
    return this._formOption;
  }


  constructor(
    private fb: FormBuilder,
    private accountInfoService: DwAccountInfoService,
    private accountInfoDataSourceService: DwAccountInfoDataSourceService,
    private accountInfoUploadService: DwAccountInfoUploadService,
    private dwModalService: DwModalService,
    private dwUpdatePasswordModalService: DwUpdatePasswordModalService,
    private translateService: TranslateService,
    private configService: DwSystemConfigService,
    @Inject(APP_DATE_FORMAT) private dwDateFormat: string
  ) {
    this.configService.get('multiTenant').subscribe(
      multiTenant => {
        this.dwMultiTenant = multiTenant;
      }
    );
  }


  ngOnInit(): void {
    // 動態表單的設定檔
    const _forkJoin = [
      this.getRxjsFormOption(),
      this.accountInfoDataSourceService.getUserBasicInfo()
    ];

    forkJoin(_forkJoin).subscribe(
      (res) => {
        this.formOption = res[0];

        // 第一次指定完成後, 如果 this.userInfo 再用等號=賦值, 視為不同 object.
        this._userInfo = res[1];

        // 將收到的 userInfo 發送到調用端
        this.userInfoValue.emit(this._userInfo);

        this.accountInfoForm = this.fb.group({});

        this.formOption.forEach((item: IDwAccInfoFormOption) => {
          // 初始化 formGroup
          this.setFormControl(item);

          // 如果有設定前綴欄位
          if (item.hasOwnProperty('prefix')) {
            this.setFormControl(item.prefix);
          }
        });

        // 設定頭像的預覽.
        if (this._userInfo.hasOwnProperty('headImageUrl') && this._userInfo.headImageUrl) {
          this.headImage = [{
            url: this._userInfo.headImageUrl
          }];
        }

        this.isShowForm = true;
      }
    );
  }


  /**
   * 取得動態表單的設定, formOption$ 允許 null 或 Observable.
   *
   */
  getRxjsFormOption(): Observable<any> {
    if (this.formOption$ === null) {
      return of(this.accountInfoService.getDefaultConfig());
    }

    return this.formOption$;
  }


  /**
   * 初始化 formGroup 的 formControl
   *
   * param {IDwAccInfoFormOption} item: 每一個欄位的設定
   *
   */
  setFormControl(item: IDwAccInfoFormOption): void {
    let _value: any = '';
    if (this._userInfo.hasOwnProperty(item.name)) {
      _value = this._userInfo[item.name];
    }

    // select 的初始值需要為 array, 當 dwMode 為 multiple 或 tags 時，ngModel 為array.
    // 當 value 為空值時, 賦值為空數組 [], 如此才不會產生一個空白的 tag
    if (item.type === 'select') {
      if (this._userInfo[item.name]) {
        _value = this._userInfo[item.name];
      } else {
        _value = [];
      }
    }

    // 增加 checkbox 的初始值判斷, 因為當為空字串''時, checkbox 會被勾選, 但是 form valid 卻為 false
    if (item.type === 'checkbox') {
      _value = (typeof _value === 'boolean') ? _value : false;
    }

    // 初始化 formGroup 的 formControl
    this.accountInfoForm.addControl(item.name,
      new FormControl(_value)
    );

    if (item.disabled) {
      this.accountInfoForm.get(item.name).disable();
    }


    if (item.required === true) {
      // 取得設定同步驗證器
      this.getDefaultValidators(item);

      // 設定同步驗證器
      if (item.type === 'checkbox') {
        this.accountInfoForm.get(item.name).setValidators([...item.validators, Validators.requiredTrue]);
      } else {
        this.accountInfoForm.get(item.name).setValidators([...item.validators, Validators.required]);
      }

      // 設定非同步驗證器
      if (item.asyncValidators.length > 0) {
        this.accountInfoForm.get(item.name).setAsyncValidators(item.asyncValidators);
      }
    }
  }


  /**
   * 取得默認的驗證器, 只有在調用端未設定且是云端時, email與telephone會有默認的驗證器
   *
   * param {IDwAccInfoFormOption} item: 每一個欄位的設定
   *
   */
  private getDefaultValidators(item: IDwAccInfoFormOption): void {
    if (this.formOption$ || !this.dwMultiTenant) {
      return;
    }

    switch (item.name) {
      case 'email':
        Object.assign(item, {
          validators: [
            Validators.required,
            Validators.email
          ],
          asyncValidators: [
            this.accountInfoService.verifyEmailExist(this._userInfo)
          ]
        });
        break;

      case 'telephone':
        Object.assign(item, {
          validators: [
            Validators.required,
            Validators.minLength(10),
            Validators.maxLength(11),
            this.accountInfoService.userMobilephoneNumeric()
          ],
          asyncValidators: [
            this.accountInfoService.verifyMobilephone(this._userInfo)
          ]
        });
        break;


    }

  }


  /**
   * <dw-input-group> 的 has-error, 需要在<dw-form-control> 裡加 [ dwValidateStatus ].
   *
   * param {boolean} required: 是否為必填
   *
   */
  checkPhoneError(required: boolean): string|null {
    if (!this.dwMultiTenant || !required) {
      return;
    }

    const telephone = this.accountInfoForm.get('telephone');
    const cellphonePrefix = this.accountInfoForm.get('cellphonePrefix');
    // 有修改, 有值, 無報錯, 才進行檢查.
    if ((telephone.dirty || cellphonePrefix.dirty) && (telephone.errors || cellphonePrefix.errors)) {
      return 'error';
    }

    return;
  }


  /**
   * 上傳文件之前的鉤子
   *
   * param {UploadFile} file: 上傳檔案
   *
   */
  beforeLogoUpload = (file: UploadFile): Observable<any> => {
    const subject = new Subject();
    const reader = new FileReader();
    const image = this.fileToObject(file);

    reader.addEventListener('load', () => {
      // 為了顯示縮圖在 + 號框裡
      image.thumbUrl = reader.result as string;
      // 在双向綁定時, 應該是用 push, 但是看來是bug,
      // 另一個解法是重新給一個新的 file list，不要用push, 不過是這是 2019 的 issue
      this.headImage = [image];
      // this.headImage.push(image);
      subject.next(false);
    });

    reader.readAsDataURL(<any>file);
    image.status = 'done';

    return subject.asObservable();
  }


  /**
   * 轉型態
   *
   * param {UploadFile} file
   *
   */
  private fileToObject(file: UploadFile): UploadFile {
    return {
      lastModified: file.lastModified,
      lastModifiedDate: file.lastModifiedDate,
      name: file.filename || file.name,
      size: file.size,
      type: file.type,
      uid: file.uid,
      response: file.response,
      error: file.error,
      percent: 0,
      originFileObj: <any>file
    };
  }


  /**
   * 刪除檔案 - 目前 IAM 的個人資料裡沒有記錄 fileId, 在存檔過後, 無法刪除實體檔案, 只有在上傳時有機會刪檔.
   *
   * param {UploadFile | string} file: 新的上傳為 UploadFile, 已經完成上傳的為 string
   *
   */
  remove = (file: UploadFile | string): Observable<any> => {

    // 刪除不立即生效, 只是清除本機個人資料裡的欄位資料.
    return new Observable((observer): void => {
      this.headImage = [];
      this._userInfo.headImageUrl = '';
      observer.next(true);
      observer.complete();
    });

    // // 刪除立即生效, 即時向 IAM 更新個人資料-備用.
    // return new Observable((observer): void => {
    //   this.dwAccountInfoService.updateUserHeadimageUrl('').subscribe(
    //     (ret) => {
    //       this._userInfo.headImageUrl = '';
    //       observer.next(true);
    //       observer.complete();
    //     }
    //   );
    // });
  }


  /**
   * 取得表單的輸入值
   *
   */
  getFormValue(): void {
    const _formValue: any = this.accountInfoForm.getRawValue();

    for (let [name, value] of Object.entries(_formValue)) {
      if (value instanceof Date) {
        value = (new DatePipe('zh_tw')).transform(value, this.dwDateFormat);
      }

      if (Array.isArray(value)) {
        value = value.toString();
      }

      this._userInfo[name] = value; // 同步到用戶基本資料
    }
  }


  /**
   * 取得需要傳遞的值
   *
   */
  getPostValue(): any {
    const ret = {};
    for (const key of Object.keys(this.accountInfoForm.controls)) {
      ret[key] = this._userInfo[key];
    }

    // 外加頭像的 shareUrl
    ret['headImageUrl'] = this._userInfo.headImageUrl;

    return ret;
  }


  /**
   * 保存表單
   *
   */
  saveFormData(): void {
    this.isButtLoading = true;
    this.getFormValue();

    // 使用 IAM 時, 提交表單
    this.updateHeadImage().pipe(
      switchMap((shareUrl) => {
        this._userInfo.headImageUrl = shareUrl;
        return this.accountInfoDataSourceService.updateUserBasicInfo(this.getPostValue());
      }),
      switchMap((ret) => {
        return this.accountInfoDataSourceService.refreshUserInfo(this._userInfo);
      })
    ).subscribe(
      (success) => {
        this.isButtLoading = false;

        // 將更新成功後的 userInfo 發送到調用端.
        this.userInfoValue.emit(this._userInfo);

        this.dwModalService.success({
          dwTitle: this.translateService.instant('dw-account-info-form-update-success-title'),
          dwContent: this.translateService.instant('dw-account-info-form-update-success-content')
        });
      },
      (error: HttpErrorResponse) => {
        this.isButtLoading = false;
        this.dwModalService.error({
          dwTitle: this.translateService.instant('dw-account-info-form-update-error-title'),
          dwContent: this.translateService.instant('dw-account-info-form-update-error-content')
        });
      }
    );

  }


  /**
   * 上傳頭像
   *
   */
  private updateHeadImage(): Observable<any> {
    // 沒有上傳頭像時
    if (this.headImage.length === 0) {
      return new Observable((observer): void => {
        observer.next('');
        observer.complete();
      });
    }

    // 已經有上傳頭像時
    if (this.headImage[0].hasOwnProperty('url') && this.headImage[0].url) {
      return new Observable((observer): void => {
        observer.next(this.headImage[0].url);
        observer.complete();
      });
    }

    // 進行上傳頭像
    return this.accountInfoUploadService.uploadAndShare(this.headImage[0].originFileObj).pipe(
      filter(ret => {
        return ret.hasOwnProperty('shareUrl') && ret.shareUrl;
      }),
      map(ret => ret.shareUrl)
    );
  }


  /**
   * 修改密碼
   *
   */
  updatePassword(): void {
    this.dwUpdatePasswordModalService.open().subscribe();
  }

}
