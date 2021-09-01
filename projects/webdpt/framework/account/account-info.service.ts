import { Injectable } from '@angular/core';
import { ValidatorFn, AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';

import { Observable, timer, of } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';

import { TranslateService } from '@ngx-translate/core';

import { DwSystemConfigService } from '@webdpt/framework/config';
import { IDwAccInfoFormOption, IDwAccInfoOptionGrid } from './account-info.interface';
import { DwAccountModule } from './account.module';


@Injectable({
  providedIn: DwAccountModule
})
export class DwAccountInfoService {
  protected dwMultiTenant: boolean;

  constructor(
    protected configService: DwSystemConfigService,
    protected translateService: TranslateService
  ) {
    this.configService.get('multiTenant').subscribe(
      multiTenant => {
        this.dwMultiTenant = multiTenant;
      }
    );
  }


  /**
    * 取得預設的 form element.
    * 要分云端與地端, 主要是 email 與 電話的必填 -- todo
    *
    */
  getDefaultConfig(): Array<IDwAccInfoFormOption> {
    const formOption = [
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
        required: true
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
        label: 'dw-account-info-form-email'
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

    // 如果使用內建的動態表單設定且為云端時, email與telephone預設為 required
    if (this.dwMultiTenant) {
      const idxEmail = formOption.findIndex(item => item.name === 'email');
      if (idxEmail >= 0) {
        Object.assign(formOption[idxEmail], {
          required: true
        });
      }

      const idxPhone = formOption.findIndex(item => item.name === 'telephone');
      if (idxPhone >= 0) {
        Object.assign(formOption[idxPhone], {
          required: true
        });
      }
    }

    return formOption;
  }


  /**
    * 取得<dw-form-item> 的顯示區塊的 Grid 柵格
    *
    * param {number} columns: 1 欄或2欄, 默認2欄
    *
    */
   protected getGridConfig(columns: number): IDwAccInfoOptionGrid {
    // 2 欄 - 默認
    const gridDef = {
      colSpan: 12,
      labelSpan: 8,
      inputSpan: 16
    };

    // 1 欄
    if (columns === 1) {
      Object.assign(gridDef, {
        colSpan: 24,
        labelSpan: 4,
        inputSpan: 20
      });
    }

    return gridDef;
  }


  /**
    * 取得完整的動態欄位的設定
    *
    * param {Array<IDwAccInfoFormOption>} config: 動態欄位的設定
    *
    */
  getFullConfig(config: Array<IDwAccInfoFormOption>): Array<IDwAccInfoFormOption> {
    config.forEach((item: IDwAccInfoFormOption) => {
      this.setItemConfig(item);
      if (item.hasOwnProperty('prefix')) {
        this.setItemConfig(item.prefix);
      }
    });

    return config;
  }


  /**
    * 完善每一個動態欄位的設定
    *
    * param {IDwAccInfoFormOption} item: 每一個欄位的設定
    *
    */
  protected setItemConfig(item: IDwAccInfoFormOption): void {
    // 如果沒有設定 Validators, 默認是 []
    if (!item.hasOwnProperty('validators')) {
      Object.assign(item, {
        validators: []
      });
    }

    // 如果沒有設定 asyncValidator, 默認是 []
    if (!item.hasOwnProperty('asyncValidators')) {
      Object.assign(item, {
        asyncValidators: []
      });
    }

    // 如果沒有設定 dwRequired, 默認是 false
    if (!item.hasOwnProperty('required')) {
      Object.assign(item, {
        required: false
      });
    }

    // 如果沒有設定 disabled, 默認是 false
    if (!item.hasOwnProperty('disabled')) {
      Object.assign(item, {
        disabled: false
      });
    }

    // 如果沒有設定 selectShowSearch, 默認是 false
    if (!item.hasOwnProperty('selectShowSearch')) {
      Object.assign(item, {
        selectShowSearch: false
      });
    }

    // 如果沒有設定 selectMode, 默認是 'default'
    if (!item.hasOwnProperty('selectMode')) {
      Object.assign(item, {
        selectMode: 'default'
      });
    }

    // 如果沒有設定 dwPlaceHolder, 默認使用 dwLabel
    if (!item.hasOwnProperty('placeHolder') && item.label) {
      const itemLabel = this.translateService.instant(item.label);
      Object.assign(item, {
        placeHolder: this.translateService.instant('dw-account-info-form-placeHolder-prefix', { label: itemLabel })
      });
    }

    // 如果沒有設定 columns, 默認是 2 欄
    if (!item.hasOwnProperty('columns')) {
      Object.assign(item, {
        columns: 2
      });
    }

    // 如果沒有設定 gird, 以 columns 取對應的設定值
    if (!item.hasOwnProperty('grid')) {
      Object.assign(item, {
        grid: this.getGridConfig(item.columns)
      });
    }

  }


  /**
    * [ 驗證 ]-E-mail需要不存在.
    * 因為是動態設定, 且是 function 先設定, 無法將 userInfo 設定進來, 所以取 storage.
    *
    */
  verifyEmailExist(userInfo: any): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return timer(500).pipe(
        switchMap(() => {
          if (!userInfo) {
            return of(null);
          }

          // 如果欄位輸入值與 userInfo 一樣時, 不進行校驗
          if (userInfo.hasOwnProperty('email') && userInfo.email === control.value) {
            return of(null);
          }

          return this.verifyExist('email', control.value).pipe(
            map(res => {

              if (res.isRegister !== true) {
                return null;
              }

              return { 'dw-account-info-form-emailRepeat': true };
            }),
            catchError((error): any => {
              console.log('error-email>>>', error);
            })
          );
        })
      );
    };
  }


  /**
    * [ 驗證 ]-手機號碼需為11個數字.
    *
    */
  userMobilephoneNumeric(): ValidatorFn {
    const reg = new RegExp('^(\\d|[0-9]+)$');
    return (control: AbstractControl): { [key: string]: any } => {
      if (!control.value) {
        return null;
      }

      if (!reg.test(control.value)) {
        return { 'dw-account-info-form-needsDigits': true };
      }

      return null;
    };
  }


  /**
    * [ 驗證 ]-手機號碼需要不存在.
    * 因為是動態設定, 且是 function 先設定, 無法將 userInfo 設定進來, 所以取 storage.
    *
    */
  verifyMobilephone(userInfo: any): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return timer(500).pipe(
        switchMap(() => {
          if (!userInfo) {
            return of(null);
          }

          // 如果欄位輸入值與 userInfo 一樣時, 不進行校驗
          if (userInfo.hasOwnProperty('telephone') && userInfo.telephone === control.value) {
            return of(null);
          }

          return this.verifyExist('telephone', control.value).pipe(
            map(res => {
              if (res.isRegister !== true) {
                return null;
              }
              return { 'dw-account-info-form-phoneRepeat': true };
            })
          );
        })
      );
    };
  }


  /**
    * 驗證 [E-mail / telephone] 是否有重覆.
    *
    * param {string} type: 驗證類型, E-mail或手機號碼.
    * param {string} value: E-mail或手機號碼.
    *
    */
  verifyExist(type: string, value: string): Observable<any> {
    const result = {};
    switch (type)  {
      case 'email':
      case 'telephone':
        result['isRegister'] = true;
        break;
    }

    return of(result);
  }


}
