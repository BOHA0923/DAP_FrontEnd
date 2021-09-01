import { Injectable, Inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs';
import { switchMap, filter } from 'rxjs/operators';


import { DW_DMC_USERINFO } from '@webdpt/framework/config';
import { DwDmcModule } from './dmc.module';
import { DwDmcRepository } from './dmc-repository';
import { IDWDmcUserInfo, IDWUploadMessage } from '@webdpt/framework/config';


/**
 * 文檔上傳，下載服務
 * 當文件超過 255(byte) * 1024 * 10(可變動) 時，自動啟用分段上傳。
 * 成功率較高的最低的分割長度: 255(byte) * 1024 的倍數.
 * 分段上傳時，會報告進度.
 *
 */
@Injectable({
  providedIn: DwDmcModule,
})
export class DwUploadFileService {
  private SLICESECTION: number = 255 * 1024 * 10; // 約 2.49 M, 成功率較高的最低的分割長度
  // private SLICESECTION: number = 255 * 1024 * 1; // 約 2.49 M, 成功率較高的最低的分割長度
  private defaultBucketName: string = ''; // 默認的儲存區(將會與 username 一致)
  private defaultDirId: string = '00000000-0000-0000-0000-000000000000'; // 默認的目錄ID,

  constructor(
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
  upload(file: File, bucketName?: string, dirId?: string, isKeepToken?: boolean): Observable<any> {
    bucketName = bucketName || this.defaultBucketName;
    dirId = dirId || this.defaultDirId;
    isKeepToken = (typeof isKeepToken === 'boolean') ? isKeepToken : false;

    const reader = new FileReader(); // 閱讀器

    return Observable.create((observer: any) => {
      if (typeof file !== 'object') {
        this.pushFileMessage(observer, 'error', '上傳文件不能為空!');
        return;
      }

      if (file.size <= this.SLICESECTION) { // 讀取並上傳整個文件
        this.pushFileMessage(observer, 'ongoing', 0);
        this.entireUpload(reader, file, bucketName, dirId, observer, isKeepToken);
      } else {
        this.pushFileMessage(observer, 'ongoing', 0);

        // 創建空文件
        this.newEmptyFile(file, bucketName, dirId).subscribe(
          (success) => {
            this.pushFileMessage(observer, 'ongoing', 5);
            this.sliceUpload(reader, file, success['id'], bucketName, dirId, 0, this.SLICESECTION, observer, isKeepToken);
          },
          (error: HttpErrorResponse) => {
            this.pushFileMessage(observer, 'error', error);
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
  coverUpload(file: File, fileId: string, bucketName?: string, dirId?: string, isKeepToken?: boolean): Observable<any> {
    bucketName = bucketName || this.defaultBucketName;
    dirId = dirId || this.defaultDirId;
    isKeepToken = (typeof isKeepToken === 'boolean') ? isKeepToken : false;

    const reader = new FileReader(); // 閱讀器

    return Observable.create((observer: any) => {
      if (typeof file !== 'object') {
        this.pushFileMessage(observer, 'error', '上傳文件不能為空!');
        return;
      }

      if (!fileId) {
        this.pushFileMessage(observer, 'error', '文件ID不能為空!');
        return;
      }

      this.pushFileMessage(observer, 'ongoing', 0);
      if (file.size <= this.SLICESECTION) {
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
  uploadAndShare(file: File, bucketName?: string, dirId?: string): Observable<any> {

    bucketName = bucketName || this.defaultBucketName;
    dirId = dirId || this.defaultDirId;
    let fileId = '';

    return Observable.create((observer: any) => {
      if (typeof file !== 'object') {
        this.pushFileMessage(observer, 'error', '上傳文件不能為空!');
        return;
      }

      this.upload(file, bucketName, dirId, true).pipe(
        filter(data => {
          return data.hasOwnProperty('fileId') && data.fileId;
        }),
        switchMap(
          (ret) => {
            fileId = ret.fileId;
            this.pushFileMessage(observer, 'shareToAll', 50, fileId);
            return this.dmcRepository.shareToAll(bucketName, [fileId]);
          }
        )
      ).subscribe(
        (success) => {
          this.pushFileMessage(observer, 'success', 100, fileId, success[0]);
          observer.complete();
        },
        (error: HttpErrorResponse) => {
          this.pushFileMessage(observer, 'error', error);
        }
      );

    });

  }


  /**
   * 用於啟動讀取指定的 Blob 或 File 內容
   *
   * param {FileReader} reader: 閱讀器
   * param {File} file: File object
   *
   */
  readAsArrayBuffer(reader: FileReader, file: File | Blob): Observable<ArrayBuffer> {
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
  protected entireUpload(reader: FileReader, file: File, bucketName: string, dirId: string, observer: any, isKeepToken: boolean): void {
    this.readAsArrayBuffer(reader, file).pipe(
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
      (success) => {
        this.pushFileMessage(observer, 'success', 100, success['id']);
        observer.complete();
      },
      (error: HttpErrorResponse) => {
        this.pushFileMessage(observer, 'error', error);
      }
    );

  }

  /**
   * 上傳圖片
   *
   * param {FileReader} reader: 閱讀器
   * param {File} file: File object
   * param {string} bucketName: 儲存區
   * param {string} dirId: 目錄 ID
   * param {*} observer: 調用端的 observer
   * param {boolean} isKeepToken: 是否保留 userToken(在連續多次的request中需要保留)
   *
   */
  public imageUpload(file: File, bucketName: string,
    dirId: string, params: { [param: string]: string | string[] }, isKeepToken: boolean = false): Observable<any> {
    return Observable.create((observer: any) => {
      const reader = new FileReader(); // 閱讀器
      this.readAsArrayBuffer(reader, file).pipe(
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
        (res) => {
          // this.pushFileMessage(observer, 'success', res);
          observer.next({
            status: 'success',
            data: 100,
            originUrl: res.data.originUrl,
            shrinkUrl: res.data.shrinkUrl,
            fileId: res.data.fileId
          });
          observer.complete();
        },
        (error: HttpErrorResponse) => {
          this.pushFileMessage(observer, 'error', error);
        }
      );
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
  protected entireCoverUpload(reader: FileReader, file: File, fileId: string, bucketName: string,
    observer: any, isKeepToken: boolean): void {

      this.readAsArrayBuffer(reader, file).pipe(
        switchMap(
          (buffer: ArrayBuffer) => {
            return this.dmcRepository.coverUploadEntireFile(isKeepToken, bucketName, fileId, buffer);
        })
      ).subscribe(
        (success) => {
          this.pushFileMessage(observer, 'success', 100, success['id']);
          observer.complete();
        },
        (error: HttpErrorResponse) => {
          this.pushFileMessage(observer, 'error', error);
        }
      );
  }


  /**
   * 創建分段上傳的空文件
   *
   * param {File} file: File object
   * param {string} bucketName: 儲存區
   * param {string} dirId: 目錄 ID
   *
   */
  newEmptyFile(file: File, bucketName: string, dirId: string): Observable<any> {
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
   protected sliceUpload(reader: FileReader, file: File, fileId: string, bucketName: string, dirId: string,
    from: number, to: number, observer: any, isKeepToken: boolean, cover?: boolean): void {

      const blob: Blob = file.slice(from, to);  // 分割 file
      cover = cover || false;
      let keepRun = true; // 分段上傳, 直到檔案上傳完畢, 再決定是否釋放 userToken.

      this.readAsArrayBuffer(reader, blob).pipe(
        switchMap((buffer: ArrayBuffer) => {
          if (to === file.size && isKeepToken === false) {
            keepRun = isKeepToken;
          }
          return this.dmcRepository.pieceUploadFile(keepRun, bucketName, fileId, from, (to - 1),
            file.size, buffer, cover);

        })
      ).subscribe(
        (success) => {
          if (to === file.size) {
            this.pushFileMessage(observer, 'success', 100, success['id']);
            observer.complete();
            return;
          }

          this.pushFileMessage(observer, 'ongoing', (100 * to / file.size));

          const nextFrom = from + this.SLICESECTION;
          const nextTo = ((to + this.SLICESECTION) > file.size) ? file.size : (to + this.SLICESECTION);

          this.sliceUpload(reader, file, fileId, bucketName, dirId, nextFrom, nextTo, observer, isKeepToken, cover);
        },
        (error: HttpErrorResponse) => {
          this.pushFileMessage(observer, 'error', error);
        }
      );
  }


  /**
   * 下載文件, 整個下載, 適合小文件
   *
   * param {string} fileId : 文件 ID
   * param {string} fileName: 文件檔名
   * param {string} bucketName: 儲存區
   *
   */
  download(fileId: string, fileName: string, bucketName?: string): Observable<any> {
    bucketName = bucketName || this.defaultBucketName;

    return Observable.create((observer: any) => {
      if (!fileId || !fileName) {
        this.pushFileMessage(observer, 'error', '文件 ID與檔名不得為空');
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
          this.pushFileMessage(observer, 'success', 100);
          observer.complete();
        },
        (error: HttpErrorResponse) => {
          this.pushFileMessage(observer, 'error', error);
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
  deleteFile(fileIds: Array<string> = [], bucketName?: string, dirIds: Array<string> = []): Observable<any> {
    bucketName = bucketName || this.defaultBucketName;

    return Observable.create((observer: any) => {
      if (fileIds.length === 0) {
        this.pushFileMessage(observer, 'error', '刪除數組不能為空!');
        return;
      }

      this.dmcRepository.batchDelete(fileIds, bucketName, dirIds).subscribe(
        (success) => {
          this.pushFileMessage(observer, 'success', '删除成功');
          observer.complete();
        },
        (error: HttpErrorResponse) => {
          this.pushFileMessage(observer, 'error', error);
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
  protected getFileExtension(fileName: string): string {
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
  protected pushFileMessage(observer: any, status: string, data: any, fileId?: string, shareUrl?: string): void {

      const message: IDWUploadMessage = {
        status: status,
        data: data
      };

      if (fileId) {
        message.fileId = fileId;
      }

      if (shareUrl) {
        message.shareUrl = shareUrl;
      }

      if (status === 'error') {
        observer.error(message);
      } else {
        observer.next(message);
      }

  }
}
