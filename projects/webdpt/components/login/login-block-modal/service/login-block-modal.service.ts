import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DwModalRef } from 'ng-quicksilver/modal';
import { DwModalService } from 'ng-quicksilver/modal';

import { DwLoginBlockModalComponent } from '../login-block-modal.component';
import { IDwLoginBlockModal } from '../interface/login-block-modal.interface';

@Injectable({ providedIn: 'root' })
export class DwLoginBlockModalService {
  private _postModal: DwModalRef;

  constructor(
    private dwModalService: DwModalService
  ) { }

  /**
   * 顯示訊息
   *
   * @param modalConfig
   * {
   *  description: string; 描述內容, 必填
   *   btnTitle: string; 關閉button顯示文字, 必填
   *   width?: string; 開窗寬度, 預設'400'
   *   closable?: boolean; 顯示關閉鈕, 預設false不顯示
   *   maskClosable?: boolean; 按遮罩關閉, 預設false
   *  }
   * @returns 關窗後返回訊息
   */
  showWarning(modalConfig: IDwLoginBlockModal): Observable<any> {
    // afterCloasedCallback: Function = (): void => { console.log('to do something'); }
    let _modalConfig: IDwLoginBlockModal = {
      description: '',
      btnTitle: '',
      width: '400',
      closable: false,
      maskClosable: false
    };
    _modalConfig = Object.assign(_modalConfig, modalConfig);
    this._postModal = this.dwModalService.create({
      dwContent: DwLoginBlockModalComponent,
      dwWidth: _modalConfig.width,
      dwFooter: null,
      dwClosable: _modalConfig.closable,
      dwMaskClosable: _modalConfig.maskClosable,
      dwComponentParams: { description: _modalConfig.description, btnTitle: _modalConfig.btnTitle }
    });
    return Observable.create(observer => {
      // 關閉窗後.
      this._postModal.afterClose.subscribe((res) => {
        if (res) { // 是按下按鈕關閉
          observer.next(true);
          observer.complete();
        } else {
          observer.complete();
        }
      });
    });
  }
}
