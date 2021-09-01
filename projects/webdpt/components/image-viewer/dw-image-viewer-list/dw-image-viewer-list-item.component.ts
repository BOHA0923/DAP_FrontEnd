import {
  Component, OnInit, Input, ViewEncapsulation, TemplateRef
} from '@angular/core';
import { Observable } from 'rxjs';
import { isArray } from 'util';
import { TranslateService } from '@ngx-translate/core';

import {
  IDwImageViewerFile, IDwImageViewerListAction, IDwImageViewerActionItem, IDwImageViewerListOtherAction, IDwImageViewerListType
} from '../interface/dw-image-viewer-file.interface';
import { DwImageViewerListService } from './dw-image-viewer-list.service';
import { DwImageViewerFileService } from '../dw-image-viewer-file.service';
import { DwMessageService } from 'ng-quicksilver/message';

@Component({
  selector: 'dw-image-viewer-list-item',
  templateUrl: './dw-image-viewer-list-item.component.html',
  styleUrls: ['./dw-image-viewer-list-item.component.less'],
  preserveWhitespaces: false,
  encapsulation: ViewEncapsulation.None,
})
export class DwImageViewerListItemComponent implements OnInit {
  public dwDownloadToOtherCfg = false; // 下載功能是否移入其他功能鍵
  public viewerFile: IDwImageViewerFile;
  public dwViewerListType = 'picture-card'; // 列表樣式
  public viewerFileType = ''; // 檔案MIME type
  public icons: IDwImageViewerListAction = this.dwImageViewerListService.actionDefault();
  public dwItemImageStyle = {};
  public dwItemTitleStyle = {};
  public dwItemActionsStyle = {};
  public dwItemFileiconStyle = {};

  @Input()
  set dwListType(dwListType: IDwImageViewerListType) { // 列表類型
    this.dwViewerListType = dwListType;
  }

  @Input()
  set dwFile(dwFile: IDwImageViewerFile) { // 檔案物件
    let typeChange = false;

    // 檔案上傳中還不會產生url，上傳過程不用一直重設type
    if (this.viewerFile) {
      if (dwFile.type !== this.viewerFile.type || dwFile.name !== this.viewerFile.name || dwFile.url !== this.viewerFile.url) {
        typeChange = true;
      }
    } else {
      typeChange = true;
    }

    this.viewerFile = dwFile;

    if (typeChange) {
      let url = this.viewerFile.url;

      if (!url) {
        url = this.viewerFile.thumbUrl;
      }

      this.dwImageViewerFileService.getTypeByProperty(
        this.viewerFile.originFileObj, this.viewerFile.type, this.viewerFile.name, url
      ).subscribe(
        (result: any) => {
          this.viewerFileType = result.mimeType;
          this.isViewImageType = this.dwImageViewerFileService.isViewImageType(this.viewerFileType);
        }
      );
    }
  }

  @Input()
  set dwItemAction(dwItemAction: IDwImageViewerListAction) { // 圖片瀏覽列表功能
    if (dwItemAction) {
      Object.keys(dwItemAction).forEach(
        (key: string) => {
          if (isArray(this.icons[key])) {
            this.icons[key] = Object.assign([], dwItemAction[key]);
          } else {
            this.icons[key] = Object.assign({}, dwItemAction[key]);
          }
        }
      );
    }

    this.actionsChange();
  }

  @Input() dwTitleTpl: TemplateRef<void>; // 標題模板
  @Input() dwDesignTpl: TemplateRef<void>; // 自訂設計模板

  @Input()
  set dwItemImageWidth(dwItemImageWidth: any) { // 縮圖寬度
    let width = 0; // 縮圖寬度
    let autoReSize = false; // 是否自動設定縮圖高度、標題寬度，適合沒有自訂樣式時使用。

    if (dwItemImageWidth.hasOwnProperty('width')) {
      width = dwItemImageWidth.width;
    }

    if (width > 0) {
      if (dwItemImageWidth.hasOwnProperty('autoReSize')) {
        autoReSize = dwItemImageWidth.autoReSize;
      }

      this.dwItemImageStyle['width'] = width + 'px'; // 縮圖寬度

      if (autoReSize) {
        this.dwItemImageStyle['height'] = width + 'px'; // 縮圖高度
        this.dwItemTitleStyle['width'] = width + 'px'; // 標題寬度
      }

      // 計算功能icon大小
      // 預設寬：item 104px = (icon 16+ icon邊 4*2) * 3個icon + 左右留白8*2*2
      const actionFontSize = (width - 8 * 2 * 2) / 3 - 4 * 2;
      if (actionFontSize >= 14) { // 避免縮得太小
        this.dwItemActionsStyle['font-size'] = Math.floor(actionFontSize) + 'px';
      }

      // 計算檔案icon大小
      const fileiconFontSize = width - 54;
      if (fileiconFontSize > 0) {
        this.dwItemFileiconStyle['font-size'] = fileiconFontSize + 'px';
      }
    }
  }

  @Input() onPreview: (file: IDwImageViewerFile) => Observable<any>; // 自定義瀏覽的回調
  @Input() onRemove: (file: IDwImageViewerFile) => Observable<any>; // 自定義刪除的回調
  @Input() onDownload: (file: IDwImageViewerFile) => Observable<any>; // 自定義下載的回調
  @Input() onCheck: (file: IDwImageViewerFile) => Observable<any>; // 自定義選擇的回調
  @Input() onOtherAction: (file: IDwImageViewerFile, actionId: string) => Observable<any>; // 自定義其他功能鍵的回調

  public otherActionCfg = this.otherActionCfgInit();
  public isShowItemAction = false;
  public isViewImageType = false;

  constructor(
    private dwImageViewerListService: DwImageViewerListService,
    private dwImageViewerFileService: DwImageViewerFileService,
    private translateService: TranslateService,
    private dwMessageService: DwMessageService,
  ) { }

  ngOnInit(): void {
    if (!this.onPreview) {
      this.icons.dwPreview.show = false;
    }

    if (!this.onRemove) {
      this.icons.dwRemove.show = false;
    }

    if (!this.onCheck) {
      this.icons.dwCheck.show = false;
    }

    this.actionsChange();
  }

  public handlePreview(file: IDwImageViewerFile, e: Event): void {
    e.preventDefault();

    if (this.onPreview) {
      this.onPreview(file).subscribe();
    }
  }

  public handleRemove(file: IDwImageViewerFile, e: Event): void {
    e.preventDefault();

    if (this.onRemove) {
      this.onRemove(file).subscribe();
    }
    return;
  }

  public handleDownload(file: IDwImageViewerFile, e: Event): void {
    e.preventDefault();

    if (this.onDownload) {
      this.onDownload(file).subscribe();
    } else {
      // 下載檔案以原始檔案為主
      let fileSrc: File | string = '';

      if (file.hasOwnProperty('originFileObj')) {
        if (file.originFileObj instanceof File) {
          fileSrc = file.originFileObj;
        }
      }

      if (!fileSrc) {
        if (file.hasOwnProperty('url')) {
          fileSrc = file.url;
        }
      }

      if (fileSrc) {
        this.dwImageViewerFileService.downLoad(fileSrc, file.name).subscribe(
          (result: any) => {
            if (!result.success) {
              const msg = this.translateService.instant('dw-downLoad-err');
              this.dwMessageService.create('loading', msg);
            }
          }
        );
      }
    }
    return;
  }

  public handleCheck(file: IDwImageViewerFile, e: Event): void {
    e.preventDefault();

    if (this.onCheck) {
      this.onCheck(file).subscribe();
    }
    return;
  }

  public handleOtherAction(file: IDwImageViewerFile, actionId: string, e: Event): void {
    e.preventDefault();

    if (this.onOtherAction) {
      this.onOtherAction(file, actionId).subscribe();
    }
    return;
  }

  private checkShowItemAction(action: IDwImageViewerActionItem): boolean {
    let show = null;
    let check = false;

    if (action.hasOwnProperty('show')) {
      show = action.show;
    }

    if (show) {
      check = true;
    }

    return check;
  }

  private otherActionCfgInit(): any {
    return {
      show: false,
      title: '',
      disabled: false,
      open: false // 是否打開
    };
  }

  private actionsChange(): void {
    let isShowItemAction = false;
    const otherActionCfg = this.otherActionCfgInit();
    const stdAction: any = {}; // 標準按鈕:dwPreview, dwRemove, dwDownload, dwCheck
    let stdActionCount = 0; // 標準按鈕數量

    if (this.icons) {
      Object.keys(this.icons).forEach(
        (key: string) => {
          if (key === 'otherAction') {
            const otherAction: Array<IDwImageViewerListOtherAction> = this.icons[key];

            otherAction.forEach(
              (element: IDwImageViewerListOtherAction) => {
                Object.keys(element).forEach(
                  (otherKey: string) => {
                    if (this.checkShowItemAction(element[otherKey])) {
                      isShowItemAction = true;
                      otherActionCfg.show = true;
                    }
                  }
                );
              }
            );
          } else if (this.checkShowItemAction(this.icons[key])) {
            isShowItemAction = true;

            // 標準按鈕
            if (key !== 'dwCheck' && key.startsWith('dw')) {
              stdActionCount = stdActionCount + 1;
              stdAction[key] = Object.assign({}, this.icons[key]);
            }
          }
        }
      );
    }

    this.isShowItemAction = isShowItemAction;
    this.otherActionCfg.show = otherActionCfg.show;

    if (this.otherActionCfg.show) {
      if (stdActionCount >= 3) {
        this.dwDownloadToOtherCfg = true;
      } else {
        this.dwDownloadToOtherCfg = false;
      }
    } else {
      this.dwDownloadToOtherCfg = false;
    }
  }
}
