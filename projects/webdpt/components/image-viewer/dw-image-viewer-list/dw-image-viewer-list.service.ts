import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DwModalService } from 'ng-quicksilver/modal';
import { TranslateService } from '@ngx-translate/core';

import {
  IDwImageViewerListAction, IDwImageViewerFile, IDwImageViewerAction, IDwImageViewerChangeData
} from '../interface/dw-image-viewer-file.interface';
import { DwImageViewerModalComponent } from '../dw-image-viewer-modal/dw-image-viewer-modal.component';
import { DwImageViewerService } from '../dw-image-viewer.service';

/**
 * 圖片瀏覽列表服務
 */
@Injectable()
export class DwImageViewerListService {

  constructor(
    private dwImageViewerService: DwImageViewerService,
    private dwModalService: DwModalService,
    private translateService: TranslateService
  ) { }

  /**
   * 圖片瀏覽列表預設功能
   */
  public actionDefault(): IDwImageViewerListAction {
    const action: IDwImageViewerListAction = {
      dwPreview: {
        show: true,
        title: this.translateService.instant('dw-image-viewer-preview'),
        disabled: false
      },
      dwRemove: {
        show: true,
        title: this.translateService.instant('dw-delete'),
        disabled: false
      },
      dwDownload: {
        show: true,
        title: this.translateService.instant('dw-image-viewer-download'),
        disabled: false
      },
      dwCheck: {
        show: false,
        title: this.translateService.instant('dw-image-viewer-check'),
        disabled: false
      },
      otherAction: [],
    };

    return action;
  }

  private resetViewerAction(viewerAction: IDwImageViewerAction, thumbnailList: IDwImageViewerFile[], uid: string): IDwImageViewerAction {
    let action: IDwImageViewerAction = null;

    if (viewerAction) {
      action = JSON.parse(JSON.stringify(viewerAction));

      // 重設上下筆按鈕
      const len = thumbnailList.length;
      for (let i = 0; i < len; i++) {
        if (thumbnailList[i].uid === uid) {
          if (i === 0) {
            action.dwPrevious.disabled = true;
          }
          if (i === len - 1) {
            action.dwNext.disabled = true;
          }

          break;
        }
      }
    } else {
      action = this.dwImageViewerService.viewerActionDefault();
    }

    return action;
  }

  /**
   * 前一個
   *
   * @param thumbnailList 圖片瀏覽列表
   * @param uid 檔案唯一識別碼
   * @param viewerAction 圖片瀏覽功能
   */
  public previous(
    thumbnailList: IDwImageViewerFile[], uid: string, viewerAction: IDwImageViewerAction
  ): Observable<IDwImageViewerChangeData> {
    return Observable.create(
      (observer: any) => {
        const dataSource: IDwImageViewerChangeData = {
          uid: null,
          fileSrc: null,
          name: null,
          type: null,
          title: null,
          viewerAction: null
        };

        const len = thumbnailList.length;
        for (let i = 0; i < len; i++) {
          if (thumbnailList[i].uid === uid) {
            let idx = i;

            if (i > 0) {
              idx = i - 1;
            }

            dataSource.uid = thumbnailList[idx].uid;

            if (thumbnailList[idx].url) {
              dataSource.fileSrc = thumbnailList[idx].url;
            } else {
              dataSource.fileSrc = thumbnailList[idx].originFileObj;
            }

            dataSource.name = thumbnailList[idx].name;
            dataSource.type = thumbnailList[idx].type;
            dataSource.title = thumbnailList[idx].title;
            dataSource.viewerAction = this.resetViewerAction(viewerAction, thumbnailList, dataSource.uid);
            break;
          }
        }

        observer.next(dataSource);
        observer.complete();
      }
    );
  }

  /**
   * 下一個
   *
   * @param thumbnailList 圖片瀏覽列表
   * @param uid 檔案唯一識別碼
   * @param viewerAction 圖片瀏覽功能
   */
  public next(
    thumbnailList: IDwImageViewerFile[], uid: string, viewerAction: IDwImageViewerAction
  ): Observable<IDwImageViewerChangeData> {
    return Observable.create(
      (observer: any) => {
        const dataSource: IDwImageViewerChangeData = {
          uid: null,
          fileSrc: null,
          name: null,
          type: null,
          title: null,
          viewerAction: null
        };

        const len = thumbnailList.length;
        for (let i = 0; i < len; i++) {
          if (thumbnailList[i].uid === uid) {
            let idx = i;

            if (i + 1 <= len - 1) {
              idx = i + 1;
            }

            dataSource.uid = thumbnailList[idx].uid;

            if (thumbnailList[idx].url) {
              dataSource.fileSrc = thumbnailList[idx].url;
            } else {
              dataSource.fileSrc = thumbnailList[idx].originFileObj;
            }

            dataSource.name = thumbnailList[idx].name;
            dataSource.type = thumbnailList[idx].type;
            dataSource.title = thumbnailList[idx].title;
            dataSource.viewerAction = this.resetViewerAction(viewerAction, thumbnailList, dataSource.uid);
            break;
          }
        }

        observer.next(dataSource);
        observer.complete();
      }
    );
  }

  /**
   * 圖片瀏覽開窗
   *
   * @param dwFile 檔案物件
   * @param thumbnailList 圖片瀏覽列表
   * @param viewerAction 圖片瀏覽功能
   * @param onPrevious 自定義瀏覽前一個的回調
   * @param onNext 自定義瀏覽下一個的回調
   */
  public previewModal(
    dwFile: IDwImageViewerFile, thumbnailList: IDwImageViewerFile[],
    viewerAction: IDwImageViewerAction, onPrevious: any, onNext: any
  ): Observable<any> {
    const _viewerAction = this.resetViewerAction(viewerAction, thumbnailList, dwFile.uid);

    if (!onPrevious) {
      _viewerAction.dwPrevious.show = false;
    }

    if (!onNext) {
      _viewerAction.dwNext.show = false;
    }

    return Observable.create(
      (observer: any) => {
        const onOkFn = (): void => {
          observer.next('ok');
          observer.complete();
        };

        const onCancelFn = (): void => {
          observer.next('cancel');
          observer.complete();
        };

        let fileSrc = null;
        if (dwFile.url) {
          fileSrc = dwFile.url;
        } else {
          fileSrc = dwFile.originFileObj;
        }

        this.dwModalService.create({
          dwContent: DwImageViewerModalComponent,
          dwWidth: '650px',
          dwStyle: { top: '20px' },
          dwFooter: null,
          dwClosable: true,
          dwMaskClosable: false,
          dwOnOk: (): void => {
            onOkFn();
          },
          dwOnCancel(): void {
            onCancelFn();
          },
          dwComponentParams: {
            uid: dwFile.uid,
            fileSrc: fileSrc,
            name: dwFile.name,
            type: dwFile.type,
            title: dwFile.title,
            viewerAction: _viewerAction,
            // containerStyle: { 'background-color': '#222222', 'height': '450px' },
            // toolbarStyle: {},
            // titleStyle: {},
            onPrevious: onPrevious,
            onNext: onNext,
          }
        });
      }
    );
  }

  /**
   * 列表刪除指定元素
   *
   * @param list 列表
   * @param uid 檔案唯一識別碼
   */
  public listRemove(list: IDwImageViewerFile[] | Array<any>, uid: string): any {
    const result = {
      isRemove: false,
      removeItem: null
    };

    const len = list.length;
    for (let i = 0; i < len; i++) {
      if (list[i].hasOwnProperty('uid') && list[i].uid === uid) {
        result.isRemove = true;
        result.removeItem = Object.assign({}, list[i]);
        list.splice(i, 1);
        break;
      }
    }

    return result;
  }
}
