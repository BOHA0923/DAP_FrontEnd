import { Injectable, Inject } from '@angular/core';
import { HttpEventType, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, switchMap, tap, catchError, filter } from 'rxjs/operators';
import * as crypto from 'crypto-js';

import { DwDmcHttpClient } from './dmc-http-client';
import { IDWDmcUserInfo, DW_DMC_USERINFO } from '@webdpt/framework/config';
import { DwHttpModule, DwHttpClientOptionsService, IDwRequestOptions } from '@webdpt/framework/http';
import { DwLoginDmcRepository } from './login-dmc-repository';


/**
 * auth-token-intercept.ts 會自動從 DwDapAuthService.getTokenHeaders() 抓取 header,
 * 這樣會造成多後端的 setThrowawayHeader() 不能設置 { headers: {token: token} }, token 會有衝突.
 */
@Injectable({
  providedIn: DwHttpModule
})
export class DwDmcRepository {
  private userToken: string = null; // DMC 的 userToken, 有效期為一天, 使用完後釋放.

  constructor(
    public dwDapLoginDmcRepository: DwLoginDmcRepository,
    private http: DwDmcHttpClient,
    private dwHttpClientOptionsService: DwHttpClientOptionsService,
    @Inject(DW_DMC_USERINFO) private dwDmcUserInfo: IDWDmcUserInfo,
  ) {
  }

  /**
    * DMC 文檔中心登錄
    */
  login(): Observable<any> {
    // 有取得後端提供的dmcUserToken，或前端曾登入過
    if (this.userToken) {
      return Observable.create((observer: any) => {
        observer.next(this.userToken);
        observer.complete();
      });
    } else {
      return this.dwDapLoginDmcRepository.loginDmc().pipe(
        switchMap(
          (dmcUserToken: string) => {
            // 取得後端提供的dmcUserToken
            if (dmcUserToken) {
              return Observable.create((observer: any) => {
                observer.next(dmcUserToken);
                observer.complete();
              });
            } else {
              // 前端登入文檔中心
              if (!this.dwDmcUserInfo.username || !this.dwDmcUserInfo.password) {
                return Observable.create((observer: any) => {
                  observer.error('未配置DMC用戶名密碼或者不完整！');
                  observer.complete();
                });
              } else {
                const encryptOnce = crypto.SHA256(this.dwDmcUserInfo.password);
                const encryptTwice = crypto.SHA256(encryptOnce);
                const encryptThird = crypto.enc.Base64.stringify(encryptTwice);

                return this.http.post('api/dmc/v1/auth/login', {
                  username: this.dwDmcUserInfo.username,
                  pwdhash: encryptThird
                }).pipe(
                  map(result => {
                    return result['userToken'];
                  })
                );
              }
            }
          }
        ),
        map(
          (dmcUserToken: string) => {
            this.userToken = dmcUserToken;
            return dmcUserToken;
          }
        ),
        catchError(
          (error: any) => {
            this.userToken = null;
            return throwError(error);
          }
        )
      );
    }
  }

  private mapEvent(event: any): any {
    if (event.type === HttpEventType.UploadProgress) { /// 上傳中
      event.data = {};
      event.status = 'ongoing';
      const percent = Math.round(event.loaded * 100 / event.total);
      event.data.percent = percent === 100 ? 99 : percent;
    } else if (event.type === HttpEventType.ResponseHeader) { // HttpHeaderResponse 上傳成功。這裏event不能加自定義property,否則會出錯

    } else if (event.type === HttpEventType.DownloadProgress) { // before HttpResponse。這裏event不能加自定義property,否則會出錯

    } else if (event.type === HttpEventType.Response) { // HttpResponse, 回傳上傳成功後的response。這裏event不能加自定義property,否則會出錯
    } else {
      event.status = 'ongoing';
      event.data = {};
      event.data.percent = 0;
    }
    return event;
  }
  private getfilterFn(percent: number): (event: any) => boolean {
    return (event: any): boolean => {
       //// 加step,整數除盡才返回true, ex:step=5 ,會返回5, 10, 15...
      // if (percent !== event.data.percent && event.data.percent % step === 0) {
      if (percent !== event.data.percent) { // 避免重覆返回同樣的數字
        return true;
      } else {
        return false;
      }
    };
  }
  /**
  * 上傳檔案(不分段)
  *
  * param {boolean} isKeepToken: 是否保留 userToken(在連續多次的request中需要保留)
  * param {any} params: header參數
  * param {string} bucketName: 儲存區
  * param {ArrayBuffer} buffer: 二進位流
  */
  uploadEntireFile(isKeepToken: boolean, header: any, bucketName: string, buffer: ArrayBuffer): Observable<any> {
    return this.login().pipe(
      switchMap((dmcUserToken: string) => {
        let nowPercent = -1;

        this.http.setThrowawayHeader({
          'digi-middleware-auth-user': dmcUserToken,
          'digi-middleware-drive-arg': encodeURI(JSON.stringify(header))
        });

        let options: IDwRequestOptions = {
          reportProgress: true,
          observe: 'events'
        };
        options = this.dwHttpClientOptionsService.setLoadMaskCfg(options, false);

        return this.http.post(`api/dmc/v1/buckets/${bucketName}/files`, buffer, options).pipe(
          map((event: any) => {
            return this.mapEvent(event);
          }),
          filter((event) => {
            if (event.type === HttpEventType.UploadProgress) {
              const eventfilterFn = this.getfilterFn(nowPercent);
              const result = eventfilterFn(event);
              nowPercent = result ? event.data.percent : nowPercent;
              return result;
            }
            return true;
          }),
          tap((event) => {
            if (isKeepToken === false && event.type === HttpEventType.Response) {
              this.userToken = null;
            }
          }),
          catchError(
            (error: any) => {
              this.userToken = null;
              return throwError(error);
            }
          )
        );
      })
    );
  }

  /**
  * 上傳圖片(不分段)
  *
  * param {boolean} isKeepToken: 是否保留 userToken(在連續多次的request中需要保留)
  * param {any} header參數
  * param {string} bucketName: 儲存區
  * param {ArrayBuffer} buffer: 二進位流
  * param {{
  *  shrink:string, ('0'-获取原图、'1'-获取压缩图)
  *  width?: string, 图片宽度（高度未设置是，按比例缩小
  *  height?: string 图片高度（宽度未设置是，按比例缩小）
  *  }}
  */

  imageUpload(isKeepToken: boolean, header: any, bucketName: string, buffer: ArrayBuffer,
    params: { shrink?: string, width?: string, height?: string }): Observable<any> {
    return this.login().pipe(
      switchMap((dmcUserToken: string) => {
        let nowPercent = -1;
        this.http.setThrowawayHeader({
          'digi-middleware-auth-user': dmcUserToken,
          'digi-middleware-drive-arg': encodeURI(JSON.stringify(header))
        });

        let options: IDwRequestOptions = {
          reportProgress: true,
          observe: 'events',
          params: new HttpParams({ fromObject: params })
        };
        options = this.dwHttpClientOptionsService.setLoadMaskCfg(options, false);

        return this.http.post(`api/dmc/v1/buckets/${bucketName}/images/upload`, buffer, options).pipe(
          map((event: any) => {
            return this.mapEvent(event);
          }),
          filter((event) => {
            if (event.type === HttpEventType.UploadProgress) {
              const eventfilterFn = this.getfilterFn(nowPercent);
              const result = eventfilterFn(event);
              nowPercent = result ? event.data.percent : nowPercent;
              return result;
            }
            return true;
          }),
          tap((event) => {
            if (isKeepToken === false && event.type === HttpEventType.Response) {
              this.userToken = null;
            }
          }),
          catchError(
            (error: any) => {
              this.userToken = null;
              return throwError(error);
            }
          )
        );
      })
    );
  }

  /**
   * 依照fileId压缩图片後返回已壓縮的url
   *
   * @param bucketName 儲存區
   * @param fileId 檔案編號
   * @param params 壓縮圖片寬高
   * {{
   *  width?: string, 图片宽度（高度未设置是，按比例缩小
   *  height?: string 图片高度（宽度未设置是，按比例缩小）
   * }}
   */
  shrinkImageByFileId(bucketName: string, fileId: string, params: { width?: string, height?: string }): Observable<any> {
    return this.login().pipe(
      switchMap((dmcUserToken: string) => {
        this.http.setThrowawayHeader({
          'digi-middleware-auth-user': dmcUserToken,
          'Content-Type': 'application/octet-stream'
        });

        return this.http.get(`api/dmc/v1/buckets/${bucketName}/images/${fileId}`, { 'params': params }).pipe(
          tap(() => {
            this.userToken = null;
          }),
          catchError(
            (error: any) => {
              this.userToken = null;
              return throwError(error);
            }
          )
        );

      })
    );
  }
  // shrinkImageByFileId(bucketName: string, fileId: string, params: { width?: string, height?: string }): Observable<any> {
  //   return this.login().pipe(
  //     switchMap((dmcUserToken: string) => {
  //       const req = new HttpRequest('get', `${this.api}/api/dmc/v1/buckets/${bucketName}/images/${fileId}`, null, {
  //         params: new HttpParams({ fromObject: params }),
  //         reportProgress: true,
  //         headers: new HttpHeaders({
  //           'digi-middleware-auth-user': dmcUserToken,
  //           'Content-Type': 'application/octet-stream'
  //         })
  //       });
  //       return this.httpClient.request(req).pipe(
  //         map((event: any) => {
  //           return this.mapEvent(event);
  //         }),
  //         tap((event) => {
  //           if (event.type === HttpEventType.Response) {
  //             this.userToken = null;
  //           }
  //         }, err => {
  //           if (err.error && err.error.message) {
  //             this.dmcHttpError.handlerError(err);
  //           }
  //         }),
  //         catchError(
  //           (error: any) => {
  //             this.userToken = null;
  //             return throwError(error);
  //           }
  //         )
  //       );
  //     })
  //   );
  // }

  /**
   *依照fileId获取上傳的原始图片或压缩图片
   *
   * param {string} bucketName 儲存區
   * param {string} fileId
   * param {string} shrink ('0'-获取原图、'1'-获取压缩图)
   * returns {Observable<any>}
   */
  getShrinkImageByFileId(bucketName: string, fileId: string, shrink: string): Observable<any> {
    return this.login().pipe(
      switchMap((dmcUserToken: string) => {
        this.http.setThrowawayHeader({
          'digi-middleware-auth-user': dmcUserToken,
          'Content-Type': 'application/octet-stream'
        });

        return this.http.get(`api/dmc/v1/buckets/${bucketName}/images/${fileId}/${shrink}`).pipe(
          tap(() => {
            this.userToken = null;
          }),
          catchError(
            (error: any) => {
              this.userToken = null;
              return throwError(error);
            }
          )
        );

      })
    );
  }

  /**
    * 上傳檔(覆蓋上傳，不分段)
    *
    * param {boolean} isKeepToken: 是否保留 userToken(在連續多次的request中需要保留)
    * param {string} bucketName: 儲存區
    * param {string} fileId: 文件 ID
    * param {ArrayBuffer} body 二進位流
    *
    */
  coverUploadEntireFile(isKeepToken: boolean, bucketName: string, fileId: string, body: ArrayBuffer): Observable<any> {
    return this.login().pipe(
      switchMap((dmcUserToken: string) => {
        let nowPercent = -1;

        this.http.setThrowawayHeader({
          'digi-middleware-auth-user': dmcUserToken
        });

        let options: IDwRequestOptions = {
          reportProgress: true,
          observe: 'events'
        };
        options = this.dwHttpClientOptionsService.setLoadMaskCfg(options, false);

        return this.http.post(`api/dmc/v1/buckets/${bucketName}/files/${fileId}/cover`, body, options).pipe(
          map((event: any) => {
            return this.mapEvent(event);
          }),
          filter((event) => {
            if (event.type === HttpEventType.UploadProgress) {
              const eventfilterFn = this.getfilterFn(nowPercent);
              const result = eventfilterFn(event);
              nowPercent = result ? event.data.percent : nowPercent;
              return result;
            }
            return true;
            // if (event.type === HttpEventType.UploadProgress) {
            //   if (nowPercent !== event.data.percent) {
            //     nowPercent = event.data.percent;
            //     return true;
            //   } else {
            //     return false;
            //   }
            // }
            // return true;
          }),
          tap((event) => {
            if (isKeepToken === false && event.type === HttpEventType.Response) {
              this.userToken = null;
            }
          }),
          catchError(
            (error: any) => {
              this.userToken = null;
              return throwError(error);
            }
          )
        );
      })
    );
  }

  /**
    * 創建空文件 （分段上傳需上傳空文件）
    *
    * param {string} bucketName: 儲存區
    * param {*} params: body 參數
    *
    */
  createEmptyFile(bucketName: string, body: any): Observable<any> {
    return this.login().pipe(
      switchMap((dmcUserToken: string) => {
        this.http.setThrowawayHeader({
          'digi-middleware-auth-user': dmcUserToken
        });

        return this.http.post(`api/dmc/v1/buckets/${bucketName}/files/segment`, body).pipe(
          catchError(
            (error: any) => {
              this.userToken = null;
              return throwError(error);
            }
          )
        );
      })
    );

  }

  /**
    * 分段上傳檔 （cover字段表示是否覆蓋上傳）
    *
    * param {boolean} isKeepToken: 是否保留 userToken(在連續多次的request中需要保留)
    * param {string} bucketName: 儲存區
    * param {string} fileId:  文件 ID
    * param {number} from: 開始位置
    * param {number} to: 結束位置
    * param {number} total: 總長度
    * param {ArrayBuffer} body: 二進位
    * param {boolean} cover: 是否覆蓋
    *
    */
  pieceUploadFile(isKeepToken: boolean, bucketName: string, fileId: string, from: number, to: number,
    total: number, body: ArrayBuffer, cover: boolean): Observable<any> {

    return this.login().pipe(
      switchMap((dmcUserToken: string) => {
        let url = `api/dmc/v1/buckets/${bucketName}/files/${fileId}/${from}/${to}/${total}`;
        if (cover) {
          url = `api/dmc/v1/buckets/${bucketName}/files/${fileId}/${from}/${to}/${total}/cover`;
        }

        let nowPercent = -1;

        this.http.setThrowawayHeader({
          'digi-middleware-auth-user': dmcUserToken
        });

        let options: IDwRequestOptions = {
          reportProgress: true,
          observe: 'events'
        };
        options = this.dwHttpClientOptionsService.setLoadMaskCfg(options, false);

        return this.http.post(url, body, options).pipe(
          map((event: any) => {
            return this.mapEvent(event);
          }),
          filter((event) => { // 重覆的%數不用回傳
            if (event.type === HttpEventType.UploadProgress) {
              const eventfilterFn = this.getfilterFn(nowPercent);
              const result = eventfilterFn(event);
              nowPercent = result ? event.data.percent : nowPercent;
              return result;
            }
            return true;
            // if (event.type === HttpEventType.UploadProgress) {
            //   if (nowPercent !== event.data.percent) {
            //     nowPercent = event.data.percent;
            //     return true;
            //   } else {
            //     return false;
            //   }
            // }
            // return true;
          }),
          tap((event) => {
            if (isKeepToken === false && event.type === HttpEventType.Response) {
              this.userToken = null;
            }
          }),
          catchError(
            (error: any) => {
              this.userToken = null;
              return throwError(error);
            }
          )
        );
      })
    );
  }

  // pieceUploadFile(isKeepToken: boolean, bucketName: string, fileId: string, from: number, to: number,
  //   total: number, body: ArrayBuffer, cover: boolean): Observable<any> {

  //   return this.login().pipe(
  //     switchMap((dmcUserToken: string) => {
  //       this.http.setThrowawayHeader({
  //         'digi-middleware-auth-user': dmcUserToken
  //       });

  //       let url = `api/dmc/v1/buckets/${bucketName}/files/${fileId}/${from}/${to}/${total}`;
  //       if (cover) {
  //         url = `api/dmc/v1/buckets/${bucketName}/files/${fileId}/${from}/${to}/${total}/cover`;
  //       }

  //       return this.http.post(url, body).pipe(
  //         tap(() => {
  //           if (isKeepToken === false) {
  //             this.userToken = null;
  //           }
  //         }),
  //         catchError(
  //           (error: any) => {
  //             this.userToken = null;
  //             return throwError(error);
  //           }
  //         )
  //       );
  //     })
  //   );

  // }

  /**
    * 下載檔案
    *
    * param {string} bucketName: 儲存區
    * param {string} fileId: 文件 ID
    *
    */
  download(bucketName: string, fileId: string): Observable<any> {
    return this.login().pipe(
      switchMap((dmcUserToken: string) => {
        this.http.setThrowawayHeader({
          'digi-middleware-auth-user': dmcUserToken,
          'Content-Type': 'application/octet-stream'
        });

        return this.http.get(`api/dmc/v1/buckets/${bucketName}/files/${fileId}`, {
          responseType: 'blob'
        }).pipe(
          tap(() => {
            this.userToken = null;
          }),
          catchError(
            (error: any) => {
              this.userToken = null;
              return throwError(error);
            }
          )
        );

      })
    );

  }

  /**
    * 分享給所有人
    *
    * param {string} bucketName: 儲存區
    * param {Array<string>} fileList 文件 ID 數組
    *
    */
  shareToAll(bucketName: string, fileList: Array<string>): Observable<any> {
    return this.login().pipe(
      switchMap((dmcUserToken: string) => {
        this.http.setThrowawayHeader({
          'digi-middleware-auth-user': dmcUserToken
        });

        return this.http.post(`api/dmc/v1/buckets/${bucketName}/ShareFiles`, fileList).pipe(
          tap(() => {
            this.userToken = null;
          }),
          catchError(
            (error: any) => {
              this.userToken = null;
              return throwError(error);
            }
          )
        );

      })
    );
  }

  /**
    * 批量刪除檔
    *
    * param {Array<string>} fileIds: 文件 ID 數組
    * param {string} bucketName: 儲存區
    * param {Array<string>} dirIds: 目錄 ID 數組
    *
    */
  batchDelete(fileIds: Array<string>, bucketName: string, dirIds: Array<string>): Observable<any> {
    return this.login().pipe(
      switchMap((dmcUserToken: string) => {
        this.http.setThrowawayHeader({
          'digi-middleware-auth-user': dmcUserToken
        });

        const body = {
          'fileIds': fileIds,
          'dirIds': dirIds
        };

        return this.http.post(`api/dmc/v1/buckets/${bucketName}/files/delete/batch`, body).pipe(
          tap(() => {
            this.userToken = null;
          }),
          catchError(
            (error: any) => {
              this.userToken = null;
              return throwError(error);
            }
          )
        );
      })
    );
  }

  /**
   * 建立新資料夾
   *
   * @param bucketName 儲存區
   * @param parentId 父資料夾編號
   * @param name 資料夾名稱
   */
  newDirectorys(bucketName: string, parentId: string, name: string): Observable<any> {
    return this.login().pipe(
      switchMap((dmcUserToken: string) => {
        this.http.setThrowawayHeader({
          'digi-middleware-auth-user': dmcUserToken
        });

        const param = {
          parentId: parentId,
          name: name
        };

        return this.http.post(`api/dmc/v1/buckets/${bucketName}/directorys`, param).pipe(
          tap(() => {
            this.userToken = null;
          }),
          catchError(
            (error: any) => {
              this.userToken = null;
              return throwError(error);
            }
          )
        );
      })
    );
  }

  /**
   * 取得資料夾資訊
   *
   * @param bucketName 儲存區
   * @param dirId 資料夾編號
   */
  getDirectorys(bucketName: string, dirId: string): Observable<any> {
    return this.login().pipe(
      switchMap((dmcUserToken: string) => {
        this.http.setThrowawayHeader({
          'digi-middleware-auth-user': dmcUserToken
        });

        return this.http.get(`api/dmc/v1/buckets/${bucketName}/directorys/${dirId}/list`).pipe(
          tap(() => {
            this.userToken = null;
          }),
          catchError(
            (error: any) => {
              this.userToken = null;
              return throwError(error);
            }
          )
        );
      })
    );
  }
}
