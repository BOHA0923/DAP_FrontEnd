import { Injectable, Inject, NgZone } from '@angular/core';
import { HttpErrorResponse, HttpResponse, HttpEventType } from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { DW_DMC_USERINFO, IDWDmcUserInfo, IDWUploadMangMessage } from '@webdpt/framework/config';
import { DwDmcModule } from './dmc.module';
import { DwDmcRepository } from './dmc-repository';

export const silceUplodLimit = 255 * 1024 * 10; // default,大於此數字啟用分段上傳,約 2.49 M
/**
 * 文檔中心管理服務
 * 當文件超過 255 * 1024 * 10(約2.49M,可變動) 時，自動啟用分段上傳。
 * 成功率較高的最低的分割長度: 255(byte) * 1024 的倍數.
 * 分段上傳時，會報告進度.
 *
 */
@Injectable({
  providedIn: DwDmcModule,
})
export class DwUploadFileMangementService {
  private _activeSilceUplodLimit: number = silceUplodLimit; // default,大於此數字啟用分段上傳,預設約 2.49 M
  // set activeSilceUplodLimit(val: number) {
  //   // val = val * 1048674; // 1048674約1M;
  //   if (val > this.SLICESECTION) {
  //     this._activeSilceUplodLimit = val;
  //   } else {
  //     this._activeSilceUplodLimit = this.SLICESECTION;
  //   }
  // }
  // get activeSilceUplodLimit(): number {
  //   return this._activeSilceUplodLimit;
  // }
  private SLICESECTION: number = 255 * 1024 * 10; // 約 2.49 M, 成功率較高的最低的分割長度
  private defaultBucketName: string = ''; // 默認的儲存區(將會與 username 一致)
  private defaultDirId: string = '00000000-0000-0000-0000-000000000000'; // 默認的目錄ID,
  // private cancelUploadingUids: string[] = [];
  // private sliceUploadingInfo: { uid: string, fileId: string }[] = [];
  private uploadingSubscriptions: {
    uid: string, // file uid
    subscription: Subscription, // 當前上傳Subscription
    fileId?: string, // 片段上傳有fileId
    uplodFrom?: number, // 片段上傳重新上傳開始位置
    bucketName?: string, // 片段上傳所屬bucketName
    dirId?: string, // 片段上傳所屬dirId
  }[] = [];

  constructor(
    private zone: NgZone,

    private dmcRepository: DwDmcRepository,
    @Inject(DW_DMC_USERINFO) private dwDmcUserInfo: IDWDmcUserInfo,
  ) {
    this.defaultBucketName = this.dwDmcUserInfo.username;
  }


  /**
    * 上傳檔案
    *
    * param {File} file: File object
    * param {string} bucketName: 儲存區
    * param {string} dirId: 目錄 ID
    * param {boolean} isKeepToken: 是否保留 userToken(在連續多次的request中需要保留)
    *
    */
  private upload(file: File, bucketName?: string, dirId?: string, isKeepToken?: boolean): Observable<any> {
    bucketName = bucketName || this.defaultBucketName;
    dirId = dirId || this.defaultDirId;
    isKeepToken = (typeof isKeepToken === 'boolean') ? isKeepToken : false;

    const reader = new FileReader(); // 閱讀器

    return Observable.create((observer: any) => {
      if (!(file instanceof File)) {
        this.pushFileMessage(observer, { status: 'error', message: '上傳文件不能為空!' });
        return;
      }
      if (file.size <= this._activeSilceUplodLimit) { // 讀取並上傳整個文件
        // this.pushFileMessage(observer, { status: 'ongoing', percent: 0 });
        this.entireUpload(reader, file, bucketName, dirId, observer, isKeepToken);
      } else {
        // this.pushFileMessage(observer, { status: 'ongoing', percent: 0 });

        // 創建空文件
        this.newEmptyFile(file, bucketName, dirId).subscribe(
          (success) => {
            this.pushFileMessage(observer, { status: 'ongoing', percent: 1 });
            this.sliceUpload(reader, file, success['id'], bucketName, dirId, 0, this.SLICESECTION, observer, isKeepToken);
          },
          (error: HttpErrorResponse) => {
            this.pushFileMessage(observer, { status: 'error', message: error });
          }
        );
      }
    });
  }

  /**
    * 覆蓋上傳
    *
    * param {File} file: File object
    * param {string} fileId: 文件 id
    * param {string} bucketName: 儲存區
    * param {string} dirId: 目錄 ID
    * param {boolean} isKeepToken: 是否保留 userToken(在連續多次的request中需要保留)
    *
    */
  private coverUpload(file: File, fileId: string, bucketName?: string, dirId?: string, isKeepToken?: boolean): Observable<any> {
    bucketName = bucketName || this.defaultBucketName;
    dirId = dirId || this.defaultDirId;
    isKeepToken = (typeof isKeepToken === 'boolean') ? isKeepToken : false;

    const reader = new FileReader(); // 閱讀器

    return Observable.create((observer: any) => {
      if (!(file instanceof File)) {
        this.pushFileMessage(observer, { status: 'error', message: '上傳文件不能為空!' });
        return;
      }

      if (!fileId) {
        this.pushFileMessage(observer, { status: 'error', message: '文件ID不能為空!' });
        return;
      }
      if (file.size <= this._activeSilceUplodLimit) {
        this.entireCoverUpload(reader, file, fileId, bucketName, observer, isKeepToken);
      } else {
        this.sliceUpload(reader, file, fileId, bucketName, dirId, 0, this.SLICESECTION, observer, isKeepToken);
      }
    });
  }

  /**
    * 上傳並分享
    *
    * param {File} file: File object
    * param {string} bucketName: 儲存區
    * param {string} dirId: 目錄 ID
    *
    */
  private uploadAndShare(file: File, bucketName?: string, dirId?: string): Observable<any> {
    bucketName = bucketName || this.defaultBucketName;
    dirId = dirId || this.defaultDirId;
    let fileId = '';

    return Observable.create((observer: any) => {
      if (!(file instanceof File)) {
        this.pushFileMessage(observer, { status: 'error', message: '上傳文件不能為空!' });
        return;
      }

      this.upload(file, bucketName, dirId, true).subscribe(
        (ret) => {
          if (ret.status !== 'success') {
            if (ret.status === 'ongoing' && ret.percent) {
              this.pushFileMessage(observer, { status: 'ongoing', percent: ret.percent, fileId: ret.fileId });
            }
            return;
          }
          fileId = ret.fileId;
          this.pushFileMessage(observer, { status: 'ongoing', percent: 99, fileId: ret.fileId }); //  取得fileId,上傳完畢
          this.dmcRepository.shareToAll(bucketName, [fileId]).subscribe(res => {
            this.pushFileMessage(observer, { status: 'success', percent: 100, fileId: fileId, shareUrl: res[0] });
            observer.complete();
          }, (error: HttpErrorResponse) => {
            this.pushFileMessage(observer, { status: 'error', message: error });
          });
        },
        (error: IDWUploadMangMessage) => {
          this.pushFileMessage(observer, error);
        }
      );
    });
  }

  /**
   * 上傳檔案及是否分享
   *
   * @param file 檔案
   * @param [isShare=true] 是否分享,預設true
   * @param [bucketName] 儲存區
   * @param [dirId] 目錄 ID
   * @param imageParams
   * {
   *    shrink?: string,  ('0'-获取原图、'1'-获取压缩图)
   *    width?: string,  縮圖寬度（高度未設置時，按比例縮小），限shrink='1'產生縮圖時才有作用
   *    height?: string  縮圖高度（寬度未設置時，按比例縮小），限shrink='1'產生縮圖時才有作用
   * } [imageParams={ shrink: '1', width: '150' }] // 預設'1'要縮圖,width: '150'寬度150px,高度依比例縮小
   * @param activeSilceUplodLimit 分段上傳檔案大小,預設為255 * 1024 * 10=2611200(最小值)約2.49M, 不得超過209,715,200約200M(最大值)
   *
   */
  public uploadFile(file: File, isShare: boolean = true, bucketName?: string, dirId?: string,
    imageParams: {
      shrink?: string,
      width?: string,
      height?: string
    } = { shrink: '1', width: '150' },
    activeSilceUplodLimit: number = this._activeSilceUplodLimit
  ): Observable<any> {
    bucketName = bucketName || this.defaultBucketName;
    dirId = dirId || this.defaultDirId;

    if (activeSilceUplodLimit > 209715200) {
      this._activeSilceUplodLimit = 209715200;
    } else if (activeSilceUplodLimit < this._activeSilceUplodLimit) {
      this._activeSilceUplodLimit = this._activeSilceUplodLimit;
    } else {
      this._activeSilceUplodLimit = this._activeSilceUplodLimit;
    }

    return Observable.create((observer: any) => {
      if (!(file instanceof File)) {
        this.pushFileMessage(observer, { status: 'error', message: '上傳文件不能為空!' });
        return;
      }
      const imageRegx = new RegExp('image/(jpg|png|gif|jpeg|bmp)', 'i'); // 可以壓縮的圖檔類型
      if (file.type.match(imageRegx)) { // 可以上傳的圖片種類
        if (isShare) { // 分享,取縮圖,原圖依照params.shrink參數判斷
          this.imageUploadAndShare(file, bucketName, dirId, imageParams).subscribe(res => {
            observer.next(res);
          }, error => {
            observer.error(error);
          });
        } else { // 不分享,不取原圖;取縮圖,依照params.shrink參數判斷
          this.upload(file, bucketName, dirId, true).subscribe(res => {
            if (res.status === 'success') {
              if (imageParams.shrink === '1') { // 取縮圖
                this.dmcRepository.shrinkImageByFileId(bucketName, res.fileId, imageParams).subscribe(shrinkRes => {
                  this.pushFileMessage(observer, {
                    status: 'success',
                    percent: 100,
                    shareUrl: null,
                    shrinkUrl: shrinkRes.data.shareUrl,
                    fileId: res.fileId
                  });
                  observer.complete();
                }, (error: HttpErrorResponse) => {
                  this.pushFileMessage(observer, { status: 'error', message: error });
                });
              } else { // 不取縮圖
                this.pushFileMessage(observer, {
                  status: 'success',
                  percent: 100,
                  shareUrl: null,
                  shrinkUrl: null,
                  fileId: res.fileId
                });
                observer.complete();
              }
            } else {
              this.pushFileMessage(observer, res); // upload的進度
              // observer.next(res);
            }
          }, (error: IDWUploadMangMessage) => {
            observer.error(error);
          });
        }

      } else { // 上傳圖片以外檔案
        if (isShare) {
          this.uploadAndShare(file, bucketName, dirId).subscribe(res => {
            if (res.status === 'success') {
              this.pushFileMessage(observer, {
                status: 'success',
                percent: 100,
                shareUrl: res.shareUrl,
                shrinkUrl: null,
                fileId: res.fileId
              });
              observer.complete();
            } else {
              observer.next(res);
            }
          }, (error: IDWUploadMangMessage) => {
            observer.error(error);
          });
        } else {
          this.upload(file, bucketName, dirId, true).subscribe(res => {
            if (res.status === 'success') {
              this.pushFileMessage(observer, {
                status: 'success',
                percent: 100,
                shareUrl: null,
                shrinkUrl: null,
                fileId: res.fileId
              });
              observer.complete();
            } else {
              this.pushFileMessage(observer, res); // upload的進度
            }
          }, (error: IDWUploadMangMessage) => {
            observer.error(error);
          });
        }
      }


    });
  }

  /**
    * 上傳圖片並分享
    *
    * param {{
    *  shrink:string, ('0'-获取原图、'1'-获取压缩图)
    *  width?: string, 图片宽度（高度未设置是，按比例缩小
    *  height?: string 图片高度（宽度未设置是，按比例缩小）
    *  }}
    * param {File} file: File object
    * param {string} bucketName: 儲存區
    * param {string} dirId: 目錄 ID
    *
    */
  private imageUploadAndShare(file: File, bucketName?: string, dirId?: string,
    params: { shrink?: string, width?: string, height?: string } = { shrink: '1', width: '150' }): Observable<any> {
    bucketName = bucketName || this.defaultBucketName;
    dirId = dirId || this.defaultDirId;

    return Observable.create((observer: any) => {
      if (!(file instanceof File)) {
        this.pushFileMessage(observer, { status: 'error', message: '上傳文件不能為空!' });
        return;
      }
      if (params.shrink !== '1') {
        this.uploadAndShare(file, bucketName, dirId).subscribe(res => {
          if (res.status === 'success') {
            // observer.next({
            //   status: 'success',
            //   data: { percent: 100 },
            //   originUrl: res.shareUrl,
            //   shrinkUrl: res.shareUrl,
            //   fileId: res.fileId
            // });
            this.pushFileMessage(observer, {
              status: 'success',
              percent: 100,
              shareUrl: res.shareUrl,
              shrinkUrl: res.shareUrl,
              fileId: res.fileId
            });
            observer.complete();
          } else {
            observer.next(res);
          }

        }, (error: IDWUploadMangMessage) => {
          observer.error(error);
        });
      } else {
        if (file.size <= this._activeSilceUplodLimit) { // 大size先上傳取fileId再取縮圖
          // 讀取並上傳整個image後,一次取原圖url、縮圖url、fileId
          this.imageUpload(file, bucketName, dirId, params, true).subscribe(res => {
            observer.next(res);
          }, (error: IDWUploadMangMessage) => {
            observer.error(error);
          });
        } else { // 先分段上傳取fileId,再依fileId取縮圖
          this.uploadAndShare(file, bucketName, dirId).subscribe(res => {
            if (res.status === 'success') {
              this.dmcRepository.shrinkImageByFileId(bucketName, res.fileId, params).subscribe(shrinkRes => {
                // observer.next({
                //   status: 'success',
                //   data: { percent: 100 },
                //   originUrl: res.shareUrl,
                //   shrinkUrl: shrinkRes.data.shareUrl,
                //   fileId: res.fileId
                // });
                this.pushFileMessage(observer, {
                  status: 'success',
                  percent: 100,
                  shareUrl: res.shareUrl,
                  shrinkUrl: shrinkRes.data.shareUrl,
                  fileId: res.fileId
                });
                observer.complete();
              }, (error: HttpErrorResponse) => {
                this.pushFileMessage(observer, { status: 'error', message: error });
              });
            } else {
              this.pushFileMessage(observer, res); // uploadAndShare的進度
              // observer.next(res);
            }
          }, (error: IDWUploadMangMessage) => {
            this.pushFileMessage(observer, error);
            // observer.error(error);
          });

        }
      }

    });
  }


  /**
   * 用於啟動讀取指定的 Blob 或 File 內容
   *
   * param {FileReader} reader: 閱讀器
   * param {File} file: File object
   *
   */
  private readAsArrayBuffer(reader: FileReader, file: File | Blob): Observable<ArrayBuffer> {
    return Observable.create((observer: any) => {

      reader.addEventListener('load', () => {
        observer.next(reader.result);
        observer.complete();
      });

      reader.readAsArrayBuffer(<File>file);
    });

  }


  /**
   * 上傳整個文件
   *
   * param {FileReader} reader: 閱讀器
   * param {File} file: File object
   * param {string} bucketName: 儲存區
   * param {string} dirId: 目錄 ID
   * param {*} observer: 調用端的 observer
   * param {boolean} isKeepToken: 是否保留 userToken(在連續多次的request中需要保留)
   *
   */
  private entireUpload(reader: FileReader, file: File, bucketName: string, dirId: string, observer: any, isKeepToken: boolean): void {
    const sub = this.readAsArrayBuffer(reader, file).pipe(
      switchMap((buffer: ArrayBuffer) => {
        // 文件信息
        const header = {
          'extension': this.getFileExtension(file.name),
          'displayName': file.name,
          'totalSize': file.size,
          'segmentTotalSize': file.size,
          'fileName': file.name,
          'directoryId': dirId
        };
        return this.dmcRepository.uploadEntireFile(isKeepToken, header, bucketName, buffer);
      })
    ).subscribe(
      (event) => {
        if (event instanceof HttpResponse) {
          this.deleteUploadingSubsciption((file as any).uid);
          this.pushFileMessage(observer, { status: 'success', percent: 100, fileId: event.body.id });
          observer.complete();
        } else if (event.type === HttpEventType.UploadProgress || event.type === HttpEventType.Sent) {
          this.pushFileMessage(observer, { status: 'ongoing', percent: event.data.percent });
        }

      },
      (error: HttpErrorResponse) => {
        this.pushFileMessage(observer, { status: 'error', message: error });
      }
    );
    this.uploadingSubscriptions.push({ uid: (file as any).uid, subscription: sub });

  }

  /**
   * 上傳圖片
   *
   * param {FileReader} reader: 閱讀器
   * param {File} file: File object
   * param {string} bucketName: 儲存區
   * param {string} dirId: 目錄 ID
   * param {{
   *  shrink:string, ('0'-获取原图、'1'-获取压缩图)
   *  width?: string, 图片宽度（高度未设置是，按比例缩小
   *  height?: string 图片高度（宽度未设置是，按比例缩小）
   *  }}
   * param {boolean} isKeepToken: 是否保留 userToken(在連續多次的request中需要保留)
   *
   */
  private imageUpload(file: File, bucketName: string,
    dirId: string, params: { shrink?: string, width?: string, height?: string }, isKeepToken: boolean = false): Observable<any> {
    return Observable.create((observer: any) => {
      const reader = new FileReader(); // 閱讀器
      const sub = this.readAsArrayBuffer(reader, file).pipe(
        switchMap((buffer: ArrayBuffer) => {
          // 文件信息
          const header = {
            'extension': this.getFileExtension(file.name),
            'displayName': file.name,
            'fileName': file.name,
            'directoryId': dirId
          };
          return this.dmcRepository.imageUpload(isKeepToken, header, bucketName, buffer, params);
        })
      ).subscribe(
        (event) => {
          if (event instanceof HttpResponse) {
            this.deleteUploadingSubsciption((file as any).uid);
            // observer.next({
            //   status: 'success',
            //   data: { percent: 100 },
            //   originUrl: event.body.data.originUrl,
            //   shrinkUrl: event.body.data.shrinkUrl,
            //   fileId: event.body.data.fileId
            // });
            this.pushFileMessage(observer, {
              status: 'success',
              percent: 100,
              shareUrl: event.body.data.originUrl,
              shrinkUrl: event.body.data.shrinkUrl,
              fileId: event.body.data.fileId
            });
            observer.complete();
          } else if (event.type === HttpEventType.UploadProgress || event.type === HttpEventType.Sent) {
            this.pushFileMessage(observer, { status: 'ongoing', percent: event.data.percent });
          }
        },
        (error: HttpErrorResponse) => {
          this.pushFileMessage(observer, { status: 'error', message: error });
        }
      );
      this.uploadingSubscriptions.push({ uid: (file as any).uid, subscription: sub });
    });
  }

  /**
   * 整個文件覆蓋上傳
   *
   * param {FileReader} reader: 閱讀器
   * param {File} file: File object
   * param {string} fileId: 文件 ID
   * param {string} bucketName: 儲存區
   * param {*} observer: 調用端的 observer
   * param {boolean} isKeepToken: 是否保留 userToken(在連續多次的request中需要保留)
   *
   */
  private entireCoverUpload(reader: FileReader, file: File, fileId: string, bucketName: string,
    observer: any, isKeepToken: boolean): void {
    const sub = this.readAsArrayBuffer(reader, file).pipe(
      switchMap(
        (buffer: ArrayBuffer) => {
          return this.dmcRepository.coverUploadEntireFile(isKeepToken, bucketName, fileId, buffer);
        })
    ).subscribe(
      (event) => {
        if (event instanceof HttpResponse) {
          this.deleteUploadingSubsciption((file as any).uid);
          this.pushFileMessage(observer, { status: 'success', percent: 100, fileId: event.body.id });
          observer.complete();
        } else if (event.type === HttpEventType.UploadProgress || event.type === HttpEventType.Sent) {
          this.pushFileMessage(observer, { status: 'ongoing', percent: event.data.percent });
        }

      },
      (error: HttpErrorResponse) => {
        this.pushFileMessage(observer, { status: 'error', message: error });
      }
    );
    this.uploadingSubscriptions.push({ uid: (file as any).uid, subscription: sub });

  }

  /**
   * 創建分段上傳的空文件
   *
   * param {File} file: File object
   * param {string} bucketName: 儲存區
   * param {string} dirId: 目錄 ID
   *
   */
  private newEmptyFile(file: File, bucketName: string, dirId: string): Observable<any> {
    bucketName = bucketName || this.defaultBucketName;
    dirId = dirId || this.defaultDirId;

    return Observable.create((observer: any) => {
      const body = {
        'extension': this.getFileExtension(file.name),
        'displayName': file.name,
        'fileName': file.name,
        'directoryId': dirId
      };

      this.dmcRepository.createEmptyFile(bucketName, body).subscribe(
        (success) => {
          observer.next(success);
          observer.complete();
        },
        (error: HttpErrorResponse) => {
          observer.error(error);
          observer.complete();
        }
      );
    });
  }

  /**
    * 分段上傳
    *
    * param {FileReader} reader: 閱讀器
    * param {File} file: File object
    * param {string} fileId: 檔案 ID
    * param {string} bucketName: 儲存區
    * param {string} dirId: 目錄 ID
    * param {number} from: 開始位置
    * param {number} to: 結束位置
    * param {*} observer: 調用端的 observer
    * param {boolean} isKeepToken: 是否保留 userToken(在連續多次的request中需要保留)
    * param {boolean} cover: 是否覆蓋上傳
    *
    */
  private sliceUpload(reader: FileReader, file: File, fileId: string, bucketName: string, dirId: string,
    from: number, to: number, observer: any, isKeepToken: boolean, cover?: boolean): void {

    const blob: Blob = file.slice(from, to);  // 分割 file
    cover = cover || false;
    let keepRun = true; // 分段上傳, 直到檔案上傳完畢, 再決定是否釋放 userToken.
    let nowPercent = -1;
    const sub = this.readAsArrayBuffer(reader, blob).pipe(
      switchMap((buffer: ArrayBuffer) => {
        if (to === file.size && isKeepToken === false) {
          keepRun = isKeepToken;
        }
        return this.dmcRepository.pieceUploadFile(keepRun, bucketName, fileId, from, (to - 1),
          file.size, buffer, cover);

      })
    ).subscribe(
      (event) => {
        if (event instanceof HttpResponse) { // 此分段上傳完畢
          this.deleteUploadingSubsciption((file as any).uid);
          if (to === file.size) {
            this.pushFileMessage(observer, { status: 'success', percent: 100, fileId: fileId });
            observer.complete();
            return;
          }
          const nextFrom = from + this.SLICESECTION;
          const nextTo = ((to + this.SLICESECTION) > file.size) ? file.size : (to + this.SLICESECTION);
          this.sliceUpload(reader, file, fileId, bucketName, dirId, nextFrom, nextTo, observer, isKeepToken, cover);
        } else if (event.type === HttpEventType.UploadProgress || event.type === HttpEventType.Sent) { // UploadProgress此分段上傳中;Sent開始上傳分段
          if (event.type === HttpEventType.UploadProgress) {
            const percent = Math.round((event.loaded + from) * 100 / file.size);
            if (nowPercent !== percent) { // 不一樣%才傳回
              this.pushFileMessage(observer, { status: 'ongoing', percent: percent === 100 ? 99 : percent });
              nowPercent = percent;
            }
          }
        }
      },
      (error: HttpErrorResponse) => {
        this.pushFileMessage(observer, { status: 'error', message: error });
      }
    );

    this.uploadingSubscriptions.push({
      uid: (file as any).uid, subscription: sub, fileId: fileId,
      uplodFrom: from, bucketName: bucketName, dirId: dirId
    });
  }

  /**
   * 下載文件, 整個下載, 適合小文件
   *
   * param {string} fileId : 文件 ID
   * param {string} fileName: 文件檔名
   * param {string} bucketName: 儲存區
   *
   */
  private download(fileId: string, fileName: string, bucketName?: string): Observable<any> {
    bucketName = bucketName || this.defaultBucketName;

    return Observable.create((observer: any) => {
      if (!fileId || !fileName) {
        this.pushFileMessage(observer, { status: 'error', message: '文件 ID與檔名不得為空' });
        return;
      }

      this.dmcRepository.download(bucketName, fileId).subscribe(
        (success) => {
          const aLink = window.document.createElement('a');
          const objUrl = window.URL.createObjectURL(success);
          aLink.href = objUrl;
          aLink.download = fileName;
          document.body.appendChild(aLink);

          const evt = document.createEvent('MouseEvents');
          evt.initEvent('click', false, false);
          aLink.dispatchEvent(evt);

          window.URL.revokeObjectURL(objUrl);
          document.body.removeChild(aLink);
          this.pushFileMessage(observer, { status: 'success', percent: 100 });
          observer.complete();
        },
        (error: HttpErrorResponse) => {
          this.pushFileMessage(observer, { status: 'error', message: error });
        }
      );
    });
  }

  /**
   * 批量刪除文件
   *
   * param {Array<string>} fileIds: 文件 ID 數組
   * param {string} bucketName: 儲存區
   *
   */
  public deleteFile(fileIds: Array<string> = [], bucketName?: string): Observable<any> {
    bucketName = bucketName || this.defaultBucketName;

    return Observable.create((observer: any) => {
      if (fileIds.length === 0) {
        this.pushFileMessage(observer, { status: 'error', message: '刪除數組不能為空!' });
        return;
      }

      this.dmcRepository.batchDelete(fileIds, bucketName, []).subscribe( // dirId不能傳,否則會刪掉原始上傳的資料夾,這裏傳空[]
        (success) => {
          this.pushFileMessage(observer, { status: 'success', message: '删除成功' });
          observer.complete();
        },
        (error: HttpErrorResponse) => {
          this.pushFileMessage(observer, { status: 'error', message: error });
        }
      );
    });
  }

  /**
   * 獲取文件名的後綴
   *
   * param {string} fileName: 文件檔名
   *
   */
  private getFileExtension(fileName: string): string {
    const pos = fileName.lastIndexOf('.');
    return fileName.substring(pos + 1);
  }

  /**
   * 推送文件上傳，下載成功，進度等信息
   *
   * param {*} observer: 調用端的 observer
   * param {string} status: 進行狀態
   * param {any} data: 訊息 或 HttpErrorResponse
   * param {boolean} completed: 是否結束 observer, 默認 false, 當 status=error 時, 默認為 true
   * param {string} fileId: 文件 ID
   * param {string} shareUrl: 共享 URL
   *
   */
  private pushFileMessage(observer: any, info: IDWUploadMangMessage): void {
    const returnInfo: IDWUploadMangMessage = info;
    // Object.keys(info).forEach(name => {
    //   returnInfo[name] = info[name];
    // });

    // if (returnInfo.status === 'ongoing' && returnInfo.hasOwnProperty('percent')) {
    //   returnInfo.percent = Math.round(returnInfo.percent);
    // }
    if (info.status === 'error') {
      observer.error(returnInfo);
    } else {
      observer.next(returnInfo);
    }
  }

  public newDirectorys(name: string, parentId?: string, bucketName?: string): Observable<any> {
    parentId = parentId || this.defaultDirId;
    bucketName = bucketName || this.defaultBucketName;

    return this.dmcRepository.newDirectorys(bucketName, parentId, name);
  }

  public getDirectorys(dirId?: string, bucketName?: string): Observable<any> {
    dirId = dirId || this.defaultDirId;
    bucketName = bucketName || this.defaultBucketName;

    return this.dmcRepository.getDirectorys(bucketName, dirId);
  }

  /**
   * 取消正在上傳的file
   *
   * @param uid 檔案唯一識別碼
   */
  public cancelUploading(uid: string): void {
    this.uploadingSubscriptions.forEach(s => {
      if (s.uid === uid && s.subscription) {
        s.subscription.unsubscribe();
        if (s.hasOwnProperty('fileId')) {
          this.zone.runOutsideAngular(() => {
            ((_s): void => {
              setTimeout(() => {
                this.deleteFile([_s.fileId], _s.bucketName).subscribe();
              }, 0);
            })(s);
          });
        }
      }
    });
  }

  private deleteUploadingSubsciption(uid: string): void {
    const idx = this.uploadingSubscriptions.findIndex(d => d.uid === uid);
    this.uploadingSubscriptions.splice(idx, 1);
    // while (idx !== -1) {
    //   this.uploadingSubscriptions.splice(idx, 1);
    //   idx = this.uploadingSubscriptions.findIndex(d => d.uid === uid);
    //   console.log(idx);
    // }
  }
}

