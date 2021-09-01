import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { UploadChangeParam } from 'ng-quicksilver/upload';
import { UploadXHRArgs } from 'ng-quicksilver/upload';
import { Observable, Subscription } from 'rxjs';
import { DwMessageService } from 'ng-quicksilver/message';

import { DwUploadFileMangementService } from '@webdpt/framework/dmc';
import {
  IDwImageViewerFile, IDwImageViewerListAction, DwImageViewerListService, DwImageViewerService,
  IDwImageViewerAction, IDwImageViewerChangeData
} from '@webdpt/components/image-viewer';
import { DwDemoImageViewerService } from '../service/dw-demo-image-viewer.service';

@Component({
  selector: 'app-dw-demo-image-viewer-upload',
  templateUrl: './dw-demo-image-viewer-upload.component.html',
  styleUrls: ['./dw-demo-image-viewer-upload.component.less']
})
export class DwDemoImageViewerUploadComponent implements OnInit {
  public isDemoStyle = false; // 是否自訂樣式
  public isMock = false;
  public demoDirId = '';
  public thumbnailList2: IDwImageViewerFile[] = []; // 圖片瀏覽列表
  public isCheckShow2 = false; // 是否顯示勾選
  private listActionDefault2: IDwImageViewerListAction; // 圖片瀏覽列表預設功能
  public listActionMap2: { [key: string]: IDwImageViewerListAction } = {}; // 圖片瀏覽列表功能
  private viewerAction2: IDwImageViewerAction; // 圖片瀏覽功能鍵

  // public fileList: UploadFile[] = [];
  previewImage: string | undefined = '';
  previewVisible = false;

  constructor(
    private dwUploadFileMangementService: DwUploadFileMangementService,
    private dwImageViewerListService: DwImageViewerListService,
    private dwImageViewerService: DwImageViewerService,
    private dwMessageService: DwMessageService,
    private dwDemoImageViewerService: DwDemoImageViewerService,
    private translateService: TranslateService
  ) {
  }

  ngOnInit(): void {

    // 新增Demo的檔案資料夾
    const newDir = 'demo2';

    this.dwUploadFileMangementService.getDirectorys().subscribe(
      (list: any) => {
        const dirInfos: Array<any> = list.dirInfos ? list.dirInfos : [];
        dirInfos.forEach(
          (item: any) => {
            if (item.name === newDir) {
              this.demoDirId = item.id;
            }
          }
        );

        if (this.demoDirId === '') {
          this.dwUploadFileMangementService.newDirectorys(newDir).subscribe(
            (response: any) => {
              this.demoDirId = response.dirId;
            }
          );
        }
      },
      (error: any) => {
        console.log(error);
        this.isMock = true;
      }
    );

    // 圖片瀏覽列表預設功能
    this.listActionDefault2 = this.dwImageViewerListService.actionDefault();
    this.listActionDefault2.otherAction = [
      {
        audit: { // 審核
          show: true, // 是否顯示
          title: this.translateService.instant('dw-demo-image-viewer-audit'),  // 標題
          disabled: false
        }
      }
    ];
    // 其他功能鍵
    for (let i = 0; i < 3; i++) {
      const newId = 'my-action-' + i;
      const newAction = {};
      newAction[newId] = {
        show: true,
        title: this.translateService.instant('dw-demo-image-viewer-my-action') + '-' + i,
        disabled: false
      };

      this.listActionDefault2.otherAction.push(newAction);
    }

    // 圖片瀏覽預設功能
    this.viewerAction2 = this.dwImageViewerService.viewerActionDefault();

    this.dwDemoImageViewerService.getThumbnailList2().subscribe(
      (response: any) => {
        this.thumbnailList2 = response;
        this.thumbnailList2.forEach(
          (item: any) => {
            this.listActionMap2[item.uid] = Object.assign({}, this.listActionDefault2);
          }
        );
      }
    );
  }

  /**
   * ngForTrackBy追蹤uid，避免file的reference改變時整個重繪
   *
   * @param {number} index 索引
   * @param {IDwImageViewerFile} item 當前項
   * @returns uid 檔案唯一識別碼
   */
  public trackByUid(index: number, item: IDwImageViewerFile): string {
    return item.uid;
  }

  public itemListAction2(file: IDwImageViewerFile, listAction: IDwImageViewerListAction): IDwImageViewerListAction {
    console.log(file.name, 'listAction');
    return listAction;
  }

  /**
   * 刪除檔案，從圖片瀏覽列表移除
   *
   * @param uid 檔案唯一識別碼
   */
  private listRemove2(uid: string): void {
    delete this.listActionMap2[uid];
    const thumbnailListRemove = this.dwImageViewerListService.listRemove(this.thumbnailList2, uid);

    if (thumbnailListRemove.isRemove) {
      const msg = thumbnailListRemove.removeItem.name;
      this.dwMessageService.create('success', msg);
    }
  }

  public handleRemove2 = (file: IDwImageViewerFile): Observable<any> => {
    return Observable.create(
      (observer: any) => {
        if (file.status === 'uploading') {
          // 取消上傳
          this.dwUploadFileMangementService.cancelUploading(file.uid);
          this.listRemove2(file.uid);
          observer.next('ok');
          observer.complete();
        } else if (file.status === 'error') {
          // 刪除上傳失敗檔案
          this.listRemove2(file.uid);
          observer.next('ok');
          observer.complete();
        } else {
          // 刪除文檔中心檔案
          this.dwUploadFileMangementService.deleteFile([file.dmcFileId]).subscribe(
            (response: any) => {
              this.listRemove2(file.uid);
              observer.next('ok');
              observer.complete();
            },
            (error: any) => {
              console.log(error);
              observer.next('error');
              observer.complete();
            }
          );
        }
      }
    );
  }

  public handlePreview2 = (file: IDwImageViewerFile): Observable<any> => {
    return this.dwImageViewerListService.previewModal(
      file, this.thumbnailList2, this.viewerAction2, this.handlePrevious2, this.handleNext2
    );
  }

  public handlePrevious2 = (uid: string): Observable<IDwImageViewerChangeData> => {
    return this.dwImageViewerListService.previous(this.thumbnailList2, uid, this.viewerAction2);
  }

  public handleNext2 = (uid: string): Observable<IDwImageViewerChangeData> => {
    return this.dwImageViewerListService.next(this.thumbnailList2, uid, this.viewerAction2);
  }

  /**
   * 是否顯示CheckBox
   *
   * @param {boolean} show
   */
  public showCheckBox(show: boolean): void {
    this.isCheckShow2 = show;

    // 上傳成功的才可以勾選
    const len = this.thumbnailList2.length;

    for (let i = 0; i < len; i++) {
      if (this.thumbnailList2[i].status === 'done') {
        this.listActionMap2[this.thumbnailList2[i].uid].dwCheck.show = show;
        this.listActionMap2[this.thumbnailList2[i].uid] = Object.assign({}, this.listActionMap2[this.thumbnailList2[i].uid]);
      }
    }
  }

  /**
   * 批次審核
   */
  public batchAudit(): void {
    const len = this.thumbnailList2.length;

    for (let i = 0; i < len; i++) {
      if (this.thumbnailList2[i]['isAudit']) {
        this.thumbnailList2[i].check = true;
      } else {
        this.thumbnailList2[i].check = false;
      }
    }

    this.showCheckBox(true);
  }

  /**
   * 批次審核保存
   */
  public batchAuditSave(): void {
    const len = this.thumbnailList2.length;

    for (let i = 0; i < len; i++) {
      if (this.thumbnailList2[i].check) {
        this.thumbnailList2[i]['isAudit'] = true;
        const msg = i + '.' + this.thumbnailList2[i].name;
        this.dwMessageService.create('success', msg);
      } else {
        this.thumbnailList2[i]['isAudit'] = false;
      }
    }

    this.showCheckBox(false);
  }

  /**
   * 審核保存
   */
  public auditSave(file: IDwImageViewerFile): Observable<void> {
    return Observable.create(
      (observer: any) => {
        let response = null;
        const len = this.thumbnailList2.length;

        for (let i = 0; i < len; i++) {
          if (this.thumbnailList2[i].uid === file.uid) {
            this.thumbnailList2[i]['isAudit'] = true;
            const msg = i + '.' + this.thumbnailList2[i].name;
            this.dwMessageService.create('success', msg);
            response = 'success';
          }
        }

        observer.next(response);
        observer.complete();
      }
    );
  }

  public handleCheck = (file: IDwImageViewerFile): Observable<any> => {
    return Observable.create(
      (observer: any) => {
        const len = this.thumbnailList2.length;

        for (let i = 0; i < len; i++) {
          if (this.thumbnailList2[i].uid === file.uid) {
            this.thumbnailList2[i].check = !this.thumbnailList2[i].check;
          }
        }

        observer.next('ok');
        observer.complete();
      }
    );
  }

  public handleOtherAction = (file: IDwImageViewerFile, actionId: string): Observable<any> => {
    return Observable.create(
      (observer: any) => {
        switch (actionId) {
          case 'audit':
            this.auditSave(file).subscribe(
              (response: any) => {
                observer.next('ok');
                observer.complete();
              }
            );
            break;
          case 'my-action-0':
            const msg1 = 'uid:' + file.uid + '<br>' + file.name;
            this.dwMessageService.create('success', msg1);
            observer.next('ok');
            observer.complete();
            break;
          default:
            const msg2 = 'uid:' + file.uid + '<br>' + 'actionId:' + actionId;
            this.dwMessageService.create('success', msg2);
            observer.next('ok');
            observer.complete();
            break;
        }
      }
    );
  }

  public customReq = (item: UploadXHRArgs): Subscription => {
    const myFile: File = item.file as any;

    return this.dwUploadFileMangementService.uploadFile(myFile, true, null, this.demoDirId,
      { shrink: '1', width: '200' }).subscribe(
        (response: any) => {
          if (response.status === 'success') {
            response['primaryKey'] = 'id-' + Math.random()
              .toString(36)
              .substring(2); // Primary Key

            item.onSuccess(response, item.file, null);
          } else if (response.status === 'error') {
            item.onError(response, item.file);
          } else {
            item.onProgress(response, item.file);
          }
        },
        (err: any) => {
          item.onError(err, item.file);
        });
  }

  public uploadChange(info: UploadChangeParam): void {
    const item = info.file;

    item.title = item.name; // 檔案標題
    item.dmcFileId = null; // DMC fileId (範例)
    item.isAudit = false; // 是否審核 (範例)

    if (info.event && info.event.hasOwnProperty('percent')) { // item.onProgress
      item.percent = info.event.percent;
    }

    if (item.response) { // item.onSuccess
      item.url = item.response.shareUrl ? item.response.shareUrl : null; // 圖檔URL
      item.thumbUrl = item.response.shrinkUrl ? item.response.shrinkUrl : null; // 圖檔縮圖URL
      item.percent = item.response.percent; // 上傳進度百分比
      item.dmcFileId = item.response.fileId;
    }

    if (item.status === 'done') {
      item.message = ''; // 錯誤訊息。例如：上傳失敗

      // 上傳完成改標題
      const nameArr = item.name.split('.');
      if (nameArr.length > 0) {
        item.title = nameArr[0];
      }

      this.listActionMap2[item.uid] = Object.assign({}, this.listActionDefault2);
    }

    const len = this.thumbnailList2.length;
    for (let i = 0; i < len; i++) {
      if (item.uid === this.thumbnailList2[i].uid) {
        this.thumbnailList2[i] = Object.assign({}, item) as IDwImageViewerFile;
        break;
      }
    }
  }

  get fileUploadingCount(): number {
    let count = 0;

    this.thumbnailList2.forEach(
      (item: IDwImageViewerFile) => {
        if (item.status === 'uploading') {
          count = count + 1;
        }
      }
    );

    return count;
  }

  /**
   * 取消所有正在上傳檔案
   */
  cancelUploading(): void {
    const removeList = [];
    // 取消上傳動作
    this.thumbnailList2.forEach(
      (item: IDwImageViewerFile) => {
        if (item.status === 'uploading') {
          this.dwUploadFileMangementService.cancelUploading(item.uid);
          removeList.push(item.uid);
        }
      }
    );

    // 刪除檔案
    removeList.forEach(
      (uid: string) => {
        this.listRemove2(uid);
      }
    );
  }

  /**
   * 點選標題-範例
   */
  public titleClick(param: any): void {
    this.dwMessageService.info('點選標題' + param.title);
  }

  // nowIndex: number = 0;
  // defaultViewAction = {
  //   dwPrevious: {
  //     show: true,
  //     disabled: false,
  //   },
  //   dwNext: {
  //     show: true,
  //     disabled: false,
  //   }
  // };
  // viewerAction = {
  //   dwPrevious: {
  //     show: true,
  //     disabled: true,
  //   },
  //   dwNext: {
  //     show: true,
  //     disabled: false,
  //   }
  // };
  // public handleOk(): void {
  //   console.log('Button ok clicked!');
  //   this.previewVisible = false;
  // }

  // public handleCancel(): void {
  //   console.log('Button cancel clicked!');
  //   this.previewVisible = false;
  // }
  // onPrevious = (): Observable<string> => {
  //   this.nowIndex = this.nowIndex - 1 < 0 ? 0 : this.nowIndex - 1;
  //   this.viewerAction = JSON.parse(JSON.stringify(this.defaultViewAction));
  //   if (this.nowIndex === 0) {
  //     this.viewerAction.dwPrevious.disabled = true;
  //   }
  //   return Observable.create(observer => {
  //     observer.next(this.images[this.nowIndex]);
  //   });
  // }
  // onNext = (): Observable<string> => {
  //   this.nowIndex = this.nowIndex + 1 >= this.images.length ? this.images.length - 1 : this.nowIndex + 1;
  //   this.viewerAction = JSON.parse(JSON.stringify(this.defaultViewAction));
  //   if (this.nowIndex + 1 === this.images.length) {
  //     this.viewerAction.dwNext.disabled = true;
  //   }
  //   return Observable.create(observer => {
  //     observer.next(this.images[this.nowIndex]);
  //   });
  // }
  // dataUrlSample: string = // data: URI Examples
  // tslint:disable-next-line: max-line-length
  //   'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxMTEhUSExIWFRUXGBgYFxgXGBcXGBgYHRcYFxcaFxcYHSggGRolHRgVIjEhJSkrLi4uFx8zODMtNygtLisBCgoKDg0OGxAQGy0lHyUtLS0tLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLf/AABEIALcBEwMBIgACEQEDEQH/xAAcAAABBQEBAQAAAAAAAAAAAAAFAAMEBgcCAQj/xABAEAABAwEFBQYDBwIEBwEAAAABAAIRAwQFEiExBkFRYXETIjKBkbFCocEHI1JictHwFOEzosLxFSRDU4KS0iX/xAAZAQADAQEBAAAAAAAAAAAAAAABAgMABAX/xAAmEQACAgMAAgICAgMBAAAAAAAAAQIRAyExEkEEIjJRQnEUI2ET/9oADAMBAAIRAxEAPwAhTT7UyxPNUCZ3Q8Xkmb78Lep9k/Zxn5KPfejOp+ieHQS4CKW/qVDe2WPHIe6mUt/UqNT8LvL6qs+Cx6d3DedRkPiCNTxbMH1haJWKz27mQx2LQkx6wrzYquKlTdxY0/IJMD6i3ylpSGqyhVQp9UKFaMvPJdJwMjFmSYfS1O9T3sTL2LCsFUQcIxayf7KPeF3tqtIcBmiz6M7lPuW6Wuc6pVMsGjRlJ3y45Bo3lJNpLYYxcnSMht9zV7O/HRa9wB+EFxHpqFbtnbVWrsl1Go08SxwaehIRrbHaB0imwhjNAAAGhukgEFxG6SRJ+FVq3bROIFIEimNM58zkDn6Bc3/s0dv+N5LbC9rs86gtO4oVbrV2TC525QG3tUYYDjHAmR5TvUPaAVK4a5ng+ID4Tz5e3oS8Mqk6JT+O4f0A7beNSrUxYjkco3KVaASG1XNhwzI4nivHXW6AGmCdSfoibqQazC44n5ARpEQqg16BVjtOMQdVDvGzRLhp7Jy1WYsdib/sptKoKjfcINDp1wCFwAEHvKKRhcOam2qyNpuJOnw8OYTdqpgty1OiRorFnlWuWuAiRqETslDGQPNCKIxwDqNEZuephnFlkYlBK3Q09K0Sa1917OMNJ8A5Rr1RO5e1tJosc44qjjOW7kqja65ecRiBkFsP2b2Fj6lGrhgUaPq45fun66J8TYMqXWaNRzHMBg+oUltWBhObN06tV4t13Cq9zjEnRArbdEbldROVsqNrsUGRpyUi7z3XtPBT6t3RnMDeo9ngPjjIWoNgi0UVYGZNb0Hsg9oaZIhFmg4W9B7KGUrA9SXQCSgUCLAnAm6YToQAO2bVRb7+Dz+ikWU5noot9HNnn9E8OgfAVT3+ajN8Durf9SlM0PmogPcP6m+zlWQsSXZGY2MpjV749XGT5BXwtAAAyAyA5DIKp7F0Q97nn/pZNHN0yfTLzVreEcUaQc07aX6GKgUZ7cwpT00zN3RVOdnD2Jp1NSiFyQsKQzRnJQb3v8Mmm3wMEH8zuHQZzxz85t72vsaL6kwYgdTl+6zezVzVdrIxH5GPp81x/Im7pHd8TH/Jnd4MfVcXOJl2fyyTFOzd0E+fPcUTqiHJi0DDkdNy5Dv8QfgBy3fz2+ifsNTC8NO/I89w8xomKjoKjV628a6jru9YHyTojNWGRcVetWFKlTc9xyAGgHEnRrY3laVs39llJgD7W7tH/gaS1jertXH0HJDrr2kbYqLLSW4mvLWvA1wkTIPLvLTrrvKlaKbatJ4ex2hHsRuI4LsjK1ZyRirMZ2+2GdZnGpTBdRccidWn8Lvod/vm1aiaTsQ0X1rabO2o0se0Oa4QQdCFiX2hbFuszsbAXUXaHgfwu58DvTpglGjP6rG1Gcj8ihP/AA9zWFznCA/CM88xMxwU9wNF3FpT1rsjajRx3FZqwJ0AX0oOU+SIVa8NkjE3QkbpTjSG8JGXVELqsvaOwtbLKvdI4PHhPmlqh/KyVsVsxRrtqF5dLXDCDpMTmtp2JsTG2fC0jECQ7qq3sz2FkqCzuMGo1pMjw1BlB6j2Vs2bptD6rQYJdOFViqIuTbol1bPvlD7ZQ5otaGQM0CvC2t/EFVE2V+9qZCCHuuBRq3V2negVWp3gQN6zAiLaXHEcskWoOljegQy3HM5ohZTNNvQLny8LYx0BJIL1c5Un0wnFw1dBAB3YxmfJRr51b0P0UuzDVQr4Peb0Punx9BIGM0Pmonwnq32cpY8J6FQ/hPUexVZCxJGyd69lXLXHuVDhPIz3T8481obgsea2S7qfdaLshe3bUsDj95TyPFzfhd9D/dDFP0x80NeSDLmJprMypThkmG6E81c5RohcFOlNOWFKvt7Uigxs6vn0B/dZ5ZzVawFjGmS6SSZ8ZyHDIz5K+/aD4GDmfZV65ng0xykHrJXnZH92et8eP+tHd2hzm/eCDHUacVDvSvU3Mc4DONJzjLic/ki7Pi5CEqEHUeqX/pZp8AFipdqCSx1Nw4mQUxXs5xlojzGgj91ZqlRrcgAEBvKqGux75IaOJgSOgy9U3dk2qey40bIK92uYfhac+BbmPoq7sftbXu2th8VMmHsJycOXBw4q0/Z1Ux0n03Z/UFBdq9mywnKWk5HgrYOHFk1I3O4b7o2ukK1F2Jp1G9p4OG4qZbLKyqx1N7Q5rhBB3r5n2ev+0XdWFSmZbo5p8Lm8HD67ltdi+0ywPs4rmrhdGdKCagdwAGo56dFVoaM01sy37Ttj3WOoKjZdRcYB+jvzD5+sUyhV7M4T4ToVf9ttt6lvHZBnZ2cEEA5ucRoXHd0HqqfWszXNIRJ69Ee12ec2iTplqZ4c1sWwuwbbPZWuqtPbHvkOjLgMuULGrJXcx2Bx/S72Wz3Tt+X2MuqPptrUsIcHa1WkwXMHGNdcxuWNeqYxtZchbT7fDNRpBLgc4nKRyyUn7P6zq1pdUd3S1mnGTqrBbAy00jUY7FTe0dMlTrdSfYrRTq0z3RoBvaYlp+ayex5JOKZfr8aQMgs6vi0mSCtWfUbUphwggiVnm1NmbJhqrF6ITWyn1LSohrlPV6Z4Jhtmneg2ZI7e6UVscdk2OCDERki9i/wx5qWThSPRwOSXjUlAoFWldrgLqVgD1DeoF7HvDp9VNoOzKg3p4h0+pTQ6CXAf8J6KE493z+imuPcPRQHnu+f0CrIVA2jq7qfdSrJbH0agq0zBHoRvB5FRMBa4hwg6+REg+YITsqD0zrW1Rpt1XvTtFPE3IjxNOrT+3AqUzwhZdYrW+g8VGGNx4EcCFol229tWmHDz5HgujHPyOPNi8Xa4SymV3Wd3TBTNOYE68eKoc5Utt3SQPyyqdcdfC+ow8ZHQgT85Vu2wd96P0/7qg2qt2VXH0+RM/I/JedLc2ethdQQctdooOJ++a07xijT6qRZbTTAAbUDieBBTFGi14xNdE55aFOCm1g1W1Rd/tHdQqqA47Q/Pef2AH83olel6EAhmpyB3CckLuhkOJ/nFHkWSe2aHsQ/C5meTwaZ5OAxN+QcFerVYSQQXBwIIAjfxlZzsu8ntGDWA9n62HGB5hrh5rT6dcPpseNHAEeYBTfGezl+QtmW37dXZ4QdXTI5qp2qyupHHT03havtFZg7OOiplou5w3SM12tHOmB7HbWvHPeOCkFQLfdbmnGzJ3DilSt+Jpy743JRv6Ob0eyIdru4hd2G0aMcc93MKJRu59Vw/E45DU9AOKsl67GWmjRZUq0XMB8JMSDzAMt6GFgl++zXaJrGmyVCA0yac6A6uaTz19UZ2lu8PADBAAxtPlm1Y3ZK8jC7Jzf5IWw7NX822WdjS8MrUwJH4soyHMISV7XR4SrT4FtlrwAoMpubmBI4EbkHv2+qbyaYbhcNZXVezuZWaWE9m4d0bmn4hyVD282pbTruptaHPb4jpH91SMlXkRlFp+IreYJUMOAOZAlU+tftZ7wQd+Q3eaLlxObjmdf2CXyTG8HHoTtVupAwDJ5IrdNTFSDhoSfkVR7Y4hw4clbtmXzQHCTHqpzehooJArxJJRHCoXYKaCcBWYDqznN3X6KJefi8v3Uuz7+qg3me95J4dBLhBqHuHoh9pdFORxPsFPq+A9EOtJ+7/APb2CoxUW233B/U2Wk9kCsxgDdwcInAfod3mqMQQSCCCCQQdQRkQQtgsdINpsDfwt9gqvths6ahNekPvAO838YGhH5gMuYAWyQvaGxZa0ylgyE/Zaj8MMqGm4GQc48xw3HyKghykMqLnTraOiSUlTC1m2uq0ndnaaX/k3eOI3OHMKx3ffdGsB2bx0OR9CqRaajajMFQmNxHiafxN58t6q1uL7PVAeDGrXA5FswHN5esb810RyWjkngp6L5tafvJ5Ee37qjXyyYPP6Zq0Xhbe0ZiIzgHr3R/ZA3Ug9rgTm0E+ZEj3PouF/md0VUEV6yWipSMBxDeHDmjP9T3JJzQq0MyPEZ9Rqff5p6ZpwMzofWPoqS3sZfo5p99xcfC2Y68U9dx7+e/+fVO1aWFuAaxJ+g+q5o08IceGQ5nT39ikbtBD2zd5ClVa86ESegIV4uTauztotY9xbEQSDAaS7CCd2QCy4AiGjWAPOZPloPNCL3vGTgYchlloYEfzqmxJqWiWWKaNstN+WVxFN1YS8TTEO70Z93LMKNZH035tcHQYdGoO8OGoPIrCRaHSDiMiIMmRGkHcp1zX1Vs9Q1GGZyeDmHjnz5rtjL9nM8X6Nvu276FpbnoZzVV2q2KqUfvGZjc4fVebL7SU3NDaRILRm12vONxGe5W679qnVaT/APlatQCW5AEGMt5T6ZLaIP2O3zZqdV1GuxrLQ4gU6jozERgBPhJPrMcFslssjKrHU6jQ5rhBBWGbS7MQwVg0syxFu9vmiuyX2ous9Psba19QNH3dRsFx4NfJE/q9VNopCfpgD7R9kaliqh7JNN5OB/P8Lufv7Q9l76NCoyqwd5hgg79xHmi+1W2lW3gNLW06LTiawZknMYnO35E5CBnvVSdSAeHA57xxRA64b5UrstVmNeg8NBGJ0jNpGsjcQvnTaeO1e4OxS4knj0V6uHaB9B7gwgsc0h7CYEkanmqC9ocXPcO6JJ4DPIKcou9cKRkmrfURbuZLsR8lcriuGpaqrKNMtaXzDneEQC46a5Aqt3NY31qjW0xqYAVyt+0LLBUpNYcVSg9rifhP4mk8xI80y4B22M7a7B2iwU21H1WVWvJbLQRhdEgEHiAfRN7Hte2zBrxBDne6629+1Y2+gKDLMKQD2vLi/Ge7MADCI11XuzVvNajiLcJxfQJJM1foLSkvISUwhQLqU2F2SsAcs2/qUPvR3eI5KfZtPMobefjPT6J8fQSItc9w+Xuh1s/w/wD29gp9fwnyUG1CaeX5voqPoEa9SZ3G/pHso9UTkgtwbZ2S1OFKlUJfHhLSDlryUfbO+3WRrHtDe+8g4uQlVsiyHtTs32gNaiPvR4mjLtB/9896oQqnTTrqrld+37HEB9I5nVpn5Fcba3CTNppjOJqNG/g8c9J9eKjkhe0XxZa+rKe6ohd+maUH4TiH19R9OClmohd81+4fT1UF06QtctqFSztEy5ownyGXyhMYT2r28QI8gSPqFWbqvDsnTmRlkOI0OfmPMo1bb2p5PmSIIg58RvSyg1LXsaMlRDvCsGuk8I+efkol02qHZnn+/wDOS4vG0tqHEIb+WPYjUdVBCsofWmI3suLasCYDiR/P380Mt16Fri2I6Rl5Zx1KDm1viMRhMkykjhS6Fzsl1bweQRMA6xqep1KhpJKqVCCXq8XqJidc1v7Gq18SAcxxGn7r6C2HrMfRbUpkFjs5+hG4yvm9Xz7LdrXWOo9hILXNxNDj3cTcyOUic+SbyaFcIt7Ni25B/pXNGriB881ktrscDC7w6k/Ra5XvEWmmHVWCHtBynuGMiDvWWXtTDnPBBILokboCZ7RFabATXOpuLZxNOnEKTdrXOqAlp1TQs4FSBuCsGzldtK0Uqjhkx7XEcg4Ex6IULYr62ZtdnH9VUolrHnQxpuxD4T1VctFkxEFphpOYX0jed/2F9mLqlWm+lUaRhnE53LCM59uS+era9jKpwTgJMA5kCcp5wt0Z64WjZixNs1KpanZQ0hg5lZtfdpL3uEzmSTxJVzv2+QLK2m3QQT9FUtnrLSq2im2u4tol7e1cNQ0uGI+m9LJ+kUjGvsx66bBSZRNoqOxPBgUuXEqz7I2vtab3QB3ogbhAU/7X7qu6hToGx1WGoSWvayp2kswyHuMnDnlzxckC+zr/AAqufx/6QouPsd/iWwBJepLEyeCu5TQK6JQMO2Y5eZQ68j33fzciFkPdHn7oZeJ7zv5uVIdFkRbR4fRRK57o81JtJ7vmFEreETpn7pmZcIH2VU4tTnnUZDzcf2Wg7aWGlWsR7WpgexzXU5MBzs2lpyJzbMc1VdkaDadR+EZdtkeLZBB5K+XhYKVak6nWBLcXwmDIcYz808vrBk292ZvYLlwW1jIlmFtVpBxAtLZBB6rSLcMVBwE4jTMRrMZRzlQKtjphwexobg+7AGQDSA4ADri9UWs7Zp+o+i2KSlG0KzCNorTWo1AajD32gnE3AcWFuPdGpnTeq9b7aakZQB7q03ow1w6lUqkBr3YJJIaRkcieRQmwbNmo8t7VojUgE+minSb0dMJ/XYBXqdtdA03uYdWkg+RhMolBJJJLGPV4kksYS9SXixj1eJJLGEu6VQtIcDBBkdVwksY3C4dp6dps+Kn3XMDQ+nuacOoH4ZmDyVRvS3imx5zLnT0GevVVfZPtv6hnY5ScLicmYSROM7grZarH3iHszALSDqDJkFPdkXFRTB93AmHOzMCUUoHMKBSyBI3J2x0ySIkklEmXW/tgX0aDbTQqioSAalPIHMTLTOatew+zN2VLH2mBtVzmxWdU8THR325/4cbiM4gydVU9i7PitDqb3EjNpE6IJt1YOxtZp0yQxwEiTB4SN/ms1oZPe0Rr3s1Cm602em7tqWfYvGemmY1g5SNYlArhu5z7PWLRLxpmBprqrpsnsPUtoc9lVtINOFznAuOYmAwET1JCB3zs1XsXa0XtcaYqR2zWuFN8gGA7jBzbxBG5SnpFIP8AZQ7fRfTIa5sSA4Dkeit/2dNIZV/UPZB7TYDWtTGAgYi1suMNAkCXHc3P0V7s9xf0VorWftGVIDDiZpmNORCl53oeXCckvEkSZKaV04plhXZd7IBJNkPdH83oTeDu87r+yLWXwjogduqd93N0KkBZHFpPdHVRLR4R0PuVItRyHVRLSe75H3KZ9AuD9w1++7IDJugiYkSc9StHtObHjEWzmHDd4Xb8uKzG6HEVi0x4eWoIn3Wm0HYm/qptP+Uj6KzI+iC2mAypFQvzYfhygn8IRC7HTTPI/sgNtsxwdqHuPeYDHdBBJ1DQJ1Re5hLXccj8ksE1YpQtqdjKznufSptIcSTDoOZnehty3FaaON1Si8AQBliHHVsqFt9fVqoXjVbTr1GsOBwaDlBY3QHLimDt7eFKo6iK+JheJDmtM5iDp0Q0mVUJVoql8g9vUxAg4iSDkc881CRG/wC3Pr2ipVqRjJh0CBLQGzHQBDkh0rgkkklgnqSS8WMerxJJYwl2KRgugwNTuHVcK57I2cClJg4yZBzy0zHkihZSpWU5rSTAEngEZuW4zVMvMN3jejLbtbRtJc1oAkFvIfREatIsdUqNHdxd4AZDeHRwM5pJ2o2gwnFyphK77Eyk0NY0ALnaCzVKlI1aP+NTbJH/AHKTdct72CeZaI+ELizWoEKfQrkEOaYIMg8CNFzwnTOicFJUVmxd4EbyrHsvQxUKlSILXFp9clHtt2hrxXpgCm8wWj/pvjNo4NObm8pHw5vbPDBTqt/NK7ouzzpqtBfZ+2sZbGzkXfMojtba7OGvpvoB9Z0YapObQDnz/wB1VqWVelUJ8Ls0/trXl4cDy9UvUUUmnombM0nO7UU676T8OWB5aXcjBzC7vnaqu+yGw1KbAymA11TMudghwhugOQk5znoq3cd8CjUL5zGRUe0W51VxIzxPc49DkkybWhYnl9XFWslYCuzA59MPaJDu6SRnGhkHJTtmq+LEI0ACC2pznVQKtR9QZAlzi5wYPhBdMACYG5XW0PsZrf8AKMcxuBvdOk7zqc9PRc6gky/8TpJeJKpMcYvahTTHLs5pAk2yeFvQIFbGd8mfjn6I5ZvCOgQS0HvH9X1VYCyGbUcgotVmINHHL1cQpNqOiYa7NkmO82TwHaJn0Ho8s1jdRtGFxkFmRgRrxH6StFu2p3KZ/JHoYVKtFdgdUaAWNdVDqclzjUywkE6ANxExzV1uDOiDvaTn5gqxD0Qq4P8AT1h+EAjyIT9wV9RxAQK0bVUGV61meyoe85jogeklE7jfDsvwqHx/KqkKkzNvtXs//wCgwx46TPkXN/ZVS9WzaDG/CfPCFfftbbFosrx+B49HAifVU+3UvvKVQx32fNpIM/JO+nTCX1QLvhsVn8zPqAfqoSN7S0WjsngZupjFnMuGUxuyhBEpWPBJJJLDCSSSWMJJJJYwloDaPYNa2JIptnPKYE/OVQqQzGU8t3mrdY9qn06ratez0q854HNAER3RJBgb4GZyz1CyaFlFy4GLxpAuDiO9AOSIXLaQXVMpDmtMcxkZCqF67Y2ivU7Q9lSjwtp0abWgcPD3vNEbHfz2999BkkEHBiY7qWyWcPCAs5IR4ZUTr7sQoVPuycBAMH4Cd36V3YLTnBU0XpRrupua4Oa5sPadWnSHt5555g7ioLrH2dVzQZA0P5TmFDNjr7I6ME2/rLoastYZtdmx4h3HiHDmDBHSNCULu1rqVWrSfriO/I8COR1HIqXSan7yoDtqVSIL6Ya/qzIOPPCWj/xT4G3on8mKTsHW9xAMarm9muNNmIycpKkW0sM4TOabtrZYM+CvxUc/8rKfbXFvaGcgRKK7O1w2JzxtMckDvd5BqN3TmrHsnQa+j3tWZhT96KX9aYNvAEvcdBMSiGx2LtXEkmWn3TFsstSq5xpwBMieSk7L3fVZVNR7gQQRAQaDZbZXq4lJAB7TXTkxTqJwPlTGCNHQdAq8fFP5j7lH2FBH6+f7qsBJDNrOnn9E3Zmg1KQiQXsy499dWrUJmlaRTdTqESGFro0mDOqb2D0aA67KLyC+zMJb4SQMjyzRCn3WkBoaI0Co9m+0FnaAPpDBhJMSXSPkJ0hSKu31Alppsy3hwAPlx+asmiLi0gpW2asj6rrScYqPOJwxCJiNIy0RRxY0ANAnLr6wqpa9talURZ6BbGeMif8AKNVCq7VWs02sNI4yT3sOEuzygA7wtpGptdDW0NFtRzGvZUcwioHBmGS0tGhflrG9UY7O130gw0oe3NpL6YGuh73CVY69rvGrDuzwERAGAA8JJJ+SVtfeDiJLWCYGGAeO4ckGtmWl0z7amyOY1rXASw4TDgc3NxwAOAwz+oKtqxbaB7a2Gq8vqEYnmZEkBrfPC1vyVdU3064fihL1e02Fxgcz6CU7VsdRoBcwichI1PDqgMMJJFJYwk5RpFxgJtWrY+7mVDBcMZPhORjdE6qeSfhGwpWxm7bs0JCatV2VnOc8txEkk4dPIbgtoubZKg5rQTmi9u2BpinNM5rih8hvZVfUx3YyxU6dTtK9PETk0O+Efij8XsrxfGyDX0u2s8Fp1jUKHXuc03FrgpV3Xm6zBwnuHcrKakQyN3bKHeV2vontGnDGT9wgmPfcp90WoVQDJLmiHT1JHlHsh2198GrUw6AHEQNJ3DyHuu9jWd17uLvkAAnlfiXxcTZZwExfN6Um9m178LhTkebiP9KdeVRtq3A2mpiJkYWtHJoA+hPmnxaEyLydBeteNEmWPJJ/mSjsvxp7haXdeKCdkARGhz14plhw1M9wV9k/GPR+11hUee7h5IzcuOm0tJ8URwQixsLpdEZ69Ubt9jHZAS7ITn9IS+xHFtNrgd/4dgpbjnqFzdtHDUJ5Qp1hpNbZ6YaZBzkrmyN7xPVUa0TRMBXi5BXq5xxttjP/AHPl/dS6VAD4p8lHbUToJgpKGJzCgDawJ6Eo205IC1oCtARnlqOYXt2NBq0g7MSyemSZtT8/JNstXZFlQtxYcJgnDOmRO7qj7B6LvUuuzkk4Ikz3TCF33s3ZjQeaTA1/ixb8jJ8lJuy8XVQ4upimWuw4Q/tBoDOKBMzwUsukEK9JnK206BmzF65Oszmhr6WXVu6P5oQmLXVNW2tbupAHzzJ+Xuhla67Sy0MqU8JDcpJglnB3GBkj1ksLWOc8DvPMuJM/PgsrC66EnVuJ0Q297e2m3GT3WuBPTemLW1tUQKpZBInCXT81SNqXVKRfTNTGyNYiZ5Sg2GELasrF7211etUrOyxOJ6DRo8gAFAXdR8rhSZ3Ik3fXFOo15BMGY/nKUVdbGAPAq4sZlsjNpgQ4mJBBEZcAgKSBqPXGc14kksESPWK6qj4ex7ZgZOkaCMoBQIK5XU6AFHLJpBRb9mqVuaG4K7Cd7Xl2HydBJ+Sst4faBUsuGlaqbWuM4YcHB0RMObI3jIqo3XbocJMIhe1opvZhe1tQHc4A+YnQ81x+KvY3kN23byz1jm0tPGWn6hB78vQFhezMASOZ0zjcJ91BtVz0DMY2jgHSP80qDa6baVF1Nk4YIEmTn/dVjCEXom35MrderqSZJzPMq8bM2bBSaDwk9TmfdUiwWR1VxwicIDiBMkYgIHPP3V7sF4gjAWmm8Dwu10V8i4joUl0k2u1inL+ERzccm/v5FU7ag/fFwzJgqZtLbAXNpAk4Zc4N1xnSeg9yh132umz/ABKRed+KVWKpEE7k2RGMLsyYiOvoizLlNR+OcNOB3jx6Ird76De82zNdI/Fp/dP2y0ioWhlNzch3ZmTxVErJTtewPZWmkXgnFOh3eiJWaqXNLsJLYgozYbimC8ZnduHVPWyzsYSymQR8TuJ5JqJ+TPLptjKre4IAEZ5ZqRQABLTrH1CiWeykCWjpHupmHDTjeSM0ZcdAR4kvJSXLRUrTL7rfl04cpUyz31UJDThgkCYPEaLxJActTtD0Kr7X5joUklSJNke3kyI4fuht6y2kSZIiTmJ1gRPRJJZ9CuFr2OAHbUhjyc1wL3B5gsaYkNCsL6aSS6I8OXJ+RHeIzSpmUkkRAY1sDoT7qmfaC6C38wHyBSSSy4Xx/kUlJJJROsSSSSxhJJJLGErdc5lrf5pkkkofI/EaJZLBYsehXV52XAYlJJcSk7HcVQHtVvaAYzheULnqWhmJzxTadIGJxHHWAPn0XqS6Ir2FRSCNy3FSswJHefvcR8gNwSvVjHFjyDLXCMJwnXSY0mP3CSSpF/YOTUdEQ3TRpk1HglxJceZJlRrXUDwRhAbrkPdJJdkUea2RbmouJqNbvdA5ZZq+XPcze434jEuO5JJFBY5fNUMcaLJ7uT3cTy5KLTs0nCOEuPAcAkknQp3Z6cmRkNB03pu3mCAP5CSSz4FDcpJJLlLn/9k=';
  // base64ToBlob(dataUrl: any): any {
  //   const rImageType = /data:(image\/.+);base64,/;
  //   let mimeString = '';
  //   let raw, uInt8Array, i, rawLength;

  //   raw = dataUrl.replace(rImageType, (header, imageType) => {
  //     mimeString = imageType;
  //     return '';
  //   });

  //   raw = atob(raw);
  //   rawLength = raw.length;
  //   uInt8Array = new Uint8Array(rawLength); // eslint-disable-line

  //   for (i = 0; i < rawLength; i += 1) {
  //     uInt8Array[i] = raw.charCodeAt(i);
  //   }

  //   return new Blob([uInt8Array], { type: mimeString });
  // }
  // testFileData(): any {
  //   const file: any = this.base64ToBlob(this.dataUrlSample);
  //   file.name = new Date().getTime().toString() + '.gif';
  //   return file;
  // }

  // images = [
  //   {
  //     type: null,
  //     fileSrc: this.dataUrlSample,
  //     uid: 0,
  //     name: 'dataUrlSample'
  //   },
  //   {
  //     type: null,
  //     fileSrc: 'https://upload.wikimedia.org/wikipedia/zh/7/76/Avengers_Endgame_Poster.jpg',
  //     uid: 0,
  //     name: null
  //   },
  //   {
  //     uid: 'pk006',
  //     name: 'angular.js',
  //     fileSrc: 'http://172.16.2.141:31725/api/dmc/v1/buckets/sampleApp1/shareFiles/files/82adc20e-8b72-45ad-afa0-70e4d163d0ca/toAnyOne',
  //     type: 'text/javascript',
  //     title: 'angular.js>mime沒定義js測試'
  //   },
  //   {
  //     type: null,
  //     fileSrc: 'https://www.w3schools.com/html/mov_bbb.mp4',
  //     uid: 0,
  //     name: '測試MP4檔'
  //   },
  //   {
  //     type: '',
  //     fileSrc: 'https://openspim.org/images/2/20/10_Sample_holder.ogv',
  //     uid: 0,
  //     name: '測試ogg檔'
  //   },
  //   {
  //     type: '',
  //     fileSrc: 'https://dl5.webmfiles.org/big-buck-bunny_trailer.webm',
  //     uid: 0,
  //     name: '測試webm檔'
  //   },
  //   {
  //     type: '',
  //     fileSrc: this.testFileData(),
  //     uid: 0,
  //     name: '測試File圖檔',
  //   },
  //   {
  //     type: '',
  // tslint:disable-next-line: max-line-length
  //     fileSrc: 'https://dmc-paas.digiwincloud.com.cn/api/dmc/v1/buckets/digiwincloud/shareFiles/files/b6e30f87-0753-469e-821d-10331f3896db/toAnyOne',
  //     uid: 1,
  //     name: '文檔中心-)e46/~~____7#$^**)/..jpeg',
  //   },
  //   {
  //     type: '',
  // tslint:disable-next-line: max-line-length
  //     fileSrc: 'https://dmc-paas.digiwincloud.com.cn/api/dmc/v1/buckets/digiwincloud/shareFiles/files/b6e30f87-0753-469e-821d-10331f3896db/toAnyOne',
  //     uid: 2,
  //     name: '文檔中心圖片不加type或name+副檔名無法顯示圖檔',
  //   },
  //   {
  //     type: null,
  //     fileSrc: 'https://img.4gamers.com.tw/ckfinder/image2/auto/2019-04/Endgame-pre-sale-190403-034229.jpg',
  //     uid: 0,
  //     name: '圖檔連結'
  //   },
  //   {
  //     type: null,
  //     fileSrc: 'file.pdf',
  //     uid: 0,
  //     name: null
  //   },
  //   {
  //     type: null,
  //     fileSrc: 'file.xls',
  //     uid: 0,
  //     name: null
  //   },
  //   {
  //     type: null,
  //     fileSrc: 'file.pdf',
  //     uid: 0,
  //     name: null
  //   },
  //   {
  //     type: null,
  //     fileSrc: 'file.txt',
  //     uid: 0,
  //     name: null
  //   },
  //   {
  //     type: null,
  //     fileSrc: 'https://pgw.udn.com.tw/gw/photo.php?u=https://uc.udn.com.tw/photo/2019/11/25/realtime/7111457.jpg',
  //     uid: 0,
  //     name: null
  //   },
  //   {
  //     type: null,
  //     fileSrc: 'https://file-examples.com/wp-content/uploads/2017/02/file-sample_100kB.doc',
  //     uid: 0,
  //     name: null
  //   },
  //   {
  //     type: null,
  //     fileSrc: 'https://truth.bahamut.com.tw/s01/201205/fa431c9ef02246d3cff953bc710b9e52.JPG',
  //     uid: 0,
  //     name: null
  //   },
  //   {
  //     type: null,
  //     fileSrc: 'https://live.staticflickr.com/65535/46778712575_eafae7394b_b.jpg',
  //     uid: 0,
  //     name: 'type-null-Name取副檔名e46/~~____7#$^**)/..gif'
  //   }
  // ];
}
