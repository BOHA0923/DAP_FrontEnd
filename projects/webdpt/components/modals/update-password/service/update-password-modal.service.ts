import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { DwModalRef } from 'ng-quicksilver/modal';
import { DwModalService } from 'ng-quicksilver/modal';
import { TranslateService } from '@ngx-translate/core';

import { DwUpdatePasswordModalComponent } from '../update-password-modal.component';
import { IDwUpdatePasswordModal } from '../interface/update-password.interface';
import { IDwUpdatePasswordDefault, IDwUpdatePasswordConfig } from '@webdpt/framework/account';

@Injectable({
  providedIn: 'root'
})
export class DwUpdatePasswordModalService {
  private modalConfig: IDwUpdatePasswordModal; // 開窗的設定檔.
  private formConfig: IDwUpdatePasswordConfig; // 變更密碼表單的設定檔.
  private modalSubject: Subject<any>;

  constructor(
    private dwModalService: DwModalService,
    private translateService: TranslateService
  ) {
  }


  /**
   * 設定預設的開窗 modal與變更密碼表單的參數.
   *
   */
  private getDefaultConfig(): IDwUpdatePasswordDefault {
    return {
      modalTitle: 'dw-update-password-title', // modal 標題.
      modalWidth: '40%', // modal 寬度.
      modalOkText: 'dw-determine', // 確認按鈕文字.
      modalCancelText: 'dw-cancel', // 取消按鈕文字.
      modalOnOk: (): void => {}, // 點擊[確認]回調-[作業定義].
      modalOnCancel: (): void => {}, // 點擊[遮罩層]或[右上角叉]或[取消按鈕]的回調-[作業定義].
      modalAfterClose: (): void => {}, // Modal 完全關閉後的回調-[作業定義].
      modalAfterOpen: (): void => {}, // Modal 打開後的回調-[作業定義].
      formVerifyType: 'full' // 驗證方式 full: 全部, email: 電子信箱, mobilephone: 手機號, 預設: full.
    };
  }


  /**
   * 設定事件, 如果 config 裡也有註冊事件, 需調用.
   *
   */
  private setEvents(): void {
    // 點擊[確認]回調.
    this.modalConfig.dwOnOk = (result: DwUpdatePasswordModalComponent): void => {
      this.modalSubject.next(true);
      this.modalSubject.complete();

      // 調用作業的 customOnOk.
      this.modalConfig.customOnOk();
    };


    // 點擊[遮罩層]或[右上角叉]或[取消按鈕]的回調.
    this.modalConfig.dwOnCancel = (result: DwUpdatePasswordModalComponent): void => {
      this.modalSubject.complete();

      // 調用作業的 customOnCancel.
      this.modalConfig.customOnCancel();
    };
  }


  /**
   * 多語(利用KEY值, 取值).
   *
   */
  private translateConfig(): void {
    this.modalConfig.dwTitle = this.translateService.instant(this.modalConfig.dwTitle);
    this.modalConfig.dwOkText = this.translateService.instant(this.modalConfig.dwOkText);
    this.modalConfig.dwCancelText = this.translateService.instant(this.modalConfig.dwCancelText);
  }


  /**
   * 調用 ng-zorro 的 create 開窗.
   *
   */
  private createModal(): DwModalRef {

    const config: any = {
      dwTitle: this.modalConfig.dwTitle,
      dwContent: DwUpdatePasswordModalComponent,
      dwFooter: null,
      dwComponentParams: {
        formConfig: this.formConfig   // 變更密碼表單的設定檔.
      },
      ...this.modalConfig
    };

    return this.dwModalService.create(config);
  }


  /**
   * 設定開窗 modal 的參數.
   *
   */
  private setModalConfig(allConfig: IDwUpdatePasswordDefault): void {
    this.modalConfig = Object.assign({}, {
      dwTitle: allConfig.modalTitle,
      dwWidth: allConfig.modalWidth,
      dwOkText: allConfig.modalOkText,
      dwCancelText: allConfig.modalCancelText,
      customOnOk: allConfig.modalOnOk,
      customOnCancel: allConfig.modalOnCancel,
      customAfterClose: allConfig.modalAfterClose,
      customAfterOpen: allConfig.modalAfterOpen
    });
  }


  /**
   * 設定變更密碼表單的參數.
   *
   */
  private setFormConfig(allConfig: IDwUpdatePasswordDefault): void {
    this.formConfig = Object.assign({}, {
      verifyType: allConfig.formVerifyType
    });

  }


  /**
   * 取得開窗 merge 後的設定檔.
   *
   */
  private setConfig(config: IDwUpdatePasswordDefault): void {
    // config 的優先順序, 2.service 1. open(config).
    const defaultConfig = this.getDefaultConfig();
    const allConfig = {...defaultConfig, ...config};

    // 開窗 modal 的參數.
    this.setModalConfig(allConfig);

    // 變更密碼表單的參數.
    this.setFormConfig(allConfig);
  }


  /**
   * 開窗.
   *
   */
  open(config: IDwUpdatePasswordDefault = {}): Observable<any> {
    this.modalSubject = new Subject();

    // 分析設定檔.
    this.setConfig(config);

    // 多語.
    this.translateConfig();

    // 設定觸發事件.
    this.setEvents();

    const dwModalRef: DwModalRef = this.createModal();

    dwModalRef.afterClose.subscribe(() => {
      this.modalConfig.customAfterClose();
    });

    dwModalRef.afterOpen.subscribe(() => {
      this.modalConfig.customAfterOpen();
    });

    return this.modalSubject.asObservable();
  }

}
