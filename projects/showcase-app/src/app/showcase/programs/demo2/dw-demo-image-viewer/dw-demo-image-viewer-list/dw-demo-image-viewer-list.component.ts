import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { DwMessageService } from 'ng-quicksilver/message';

import {
  IDwImageViewerFile, IDwImageViewerListAction, IDwImageViewerAction, DwImageViewerListService,
  DwImageViewerService, IDwImageViewerChangeData
} from '@webdpt/components/image-viewer';

@Component({
  selector: 'app-dw-demo-image-viewer-list',
  templateUrl: './dw-demo-image-viewer-list.component.html',
  styleUrls: ['./dw-demo-image-viewer-list.component.less']
})
export class DwDemoImageViewerListComponent implements OnInit {
  public singleValue = 104;
  public itemImageWidth = {
    'width': 0,
    'autoReSize': true
  };

  public thumbnailList1: IDwImageViewerFile[] = [];

  public listAction1: IDwImageViewerListAction;
  private viewerAction1: IDwImageViewerAction; // 圖片瀏覽功能鍵

  constructor(
    private dwImageViewerListService: DwImageViewerListService,
    private dwImageViewerService: DwImageViewerService,
    private dwMessageService: DwMessageService,
  ) { }

  ngOnInit(): void {
    this.thumbnailList1 = [
      {
        uid: 'pk001', // 檔案唯一識別碼
        name: 'dw-demo-No46.png', // 檔案名
        status: 'done', // 狀態：uploading done error removed
        url: './assets/file/dw-demo-image-viewer/dw-demo-No46.png', // 檔案URL
        thumbUrl: './assets/file/dw-demo-image-viewer/dw-demo-No46.png', // 檔案縮圖URL
        type: 'image/png',
        title: '圖檔一'
      },
      {
        uid: 'pk002',
        name: 'dw-demo-image-viewer知識學院.jpg',
        status: 'done',
        url: './assets/file/dw-demo-image-viewer/dw-demo-image-viewer知識學院.jpg',
        thumbUrl: './assets/file/dw-demo-image-viewer/dw-demo-image-viewer知識學院.jpg',
        type: 'image/jpeg',
        title: '知識學院'
      },
      {
        uid: 'pk003',
        name: '1667f4312344d3772e464e56a6ef9aa1.jpg',
        status: 'done',
        url: 'https://static.digiwin.com/upload/admin/20200402/1667f4312344d3772e464e56a6ef9aa1.jpg',
        thumbUrl: 'https://static.digiwin.com/upload/admin/20200402/1667f4312344d3772e464e56a6ef9aa1.jpg',
        type: 'image/jpeg',
        title: '設備雲-工業APP'
      },
      {
        uid: 'pk004',
        name: 'WPS Writer.docx',
        status: 'done',
        url: './assets/file/dw-demo-image-viewer/WPS Writer.docx',
        thumbUrl: '',
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        title: '文書處理'
      },
      {
        uid: 'pk005',
        name: 'isPDF.pdf',
        status: 'done',
        url: './assets/file/dw-demo-image-viewer/isPDF.pdf',
        thumbUrl: '',
        type: 'application/pdf',
        title: '對外文件'
      },
      {
        uid: 'pk006', // 檔案唯一識別碼
        size: 889542,
        name: 'dw-demo-No46.png', // 檔案名
        status: 'error', // 狀態：uploading done error removed
        url: '', // 檔案URL
        thumbUrl: '', // 檔案縮圖URL
        type: 'image/png',
        title: 'dw-demo-No46.png'
      },
      {
        uid: 'pk007',
        name: 'dw-demo-image-viewer知識學院.jpg',
        status: 'uploading',
        url: './assets/file/dw-demo-image-viewer/dw-demo-image-viewer知識學院.jpg',
        thumbUrl: './assets/file/dw-demo-image-viewer/dw-demo-image-viewer知識學院.jpg',
        type: 'image/jpeg',
        title: '知識學院',
        percent: 60
      }
    ];

    this.listAction1 = this.dwImageViewerListService.actionDefault();
    // this.listAction1.dwRemove.disabled = true; // 刪除禁用
    this.listAction1.dwPreview.title = '先看看';
    this.viewerAction1 = this.dwImageViewerService.viewerActionDefault();
  }

  /**
   * ngForTrackBy追蹤uid，避免file的reference改變時重繪`<dw-image-viewer-list-item>`整個DOM
   *
   * @param {number} index 索引
   * @param {IDwImageViewerFile} item 當前項
   * @returns uid 檔案唯一識別碼
   */
  public trackByUid(index: number, item: IDwImageViewerFile): string {
    return item.uid;
  }

  // 刪除
  public handleRemove1 = (file: IDwImageViewerFile): Observable<any> => {
    return Observable.create(
      (observer: any) => {
        const msg = 'handleRemove1<br>' + file.title + ': ' + file.uid;
        this.dwMessageService.create('success', msg);
        observer.next('ok');
        observer.complete();
      }
    );
  }

  // 瀏覽
  public handlePreview1 = (file: IDwImageViewerFile): Observable<any> => {
    return this.dwImageViewerListService.previewModal(
      file, this.thumbnailList1, this.viewerAction1, this.handlePrevious1, this.handleNext1
    );
  }

  // 前一個
  public handlePrevious1 = (uid: string): Observable<IDwImageViewerChangeData> => {
    return this.dwImageViewerListService.previous(this.thumbnailList1, uid, this.viewerAction1);
  }

  // 下一個
  public handleNext1 = (uid: string): Observable<IDwImageViewerChangeData> => {
    return this.dwImageViewerListService.next(this.thumbnailList1, uid, this.viewerAction1);
  }

  public onSizeChange(value: number): void {
    this.itemImageWidth['width'] = value;
    this.itemImageWidth = Object.assign({}, this.itemImageWidth);
  }
}
