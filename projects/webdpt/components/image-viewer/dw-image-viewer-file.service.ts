import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class DwImageViewerFileService {
  constructor() {
  }

  /**
   * 從網址讀取檔案轉成Blob
   *
   * @see 公開網址才能取得
   * @param fileUrl 檔案網址，或DataURL(base64 編碼)
   * @returns blobFile Blob 檔案。 範例：{size: 20468, type: "image/gif"}
   */
  private urlToBlob(fileUrl: string): Observable<any> {
    return Observable.create(
      (observer: any) => {
        fetch(fileUrl)
          .then(
            (response: any) => {
              // HTTP Status 404, 500 時會使用 resolve 但會將 status 的值從 ok 變為 false
              if (response.ok) {
                return response.blob(); // Gets the response and returns it as a blob
              } else {
                // throw new Error(response.statusText);
                observer.error(response.statusText);
              }
            }
          )
          .then(
            (blobFile: any) => {
              observer.next(blobFile);
              observer.complete();
            }
          )
          .catch(
            (error: any) => {
              // "TypeError: Failed to fetch" 例如：1.網路中斷 2.Server不允許跨源請求
              console.error(error);
              observer.error(error);
            }
          );
      }
    );
  }

  /**
   * 依屬性取得MIME Type
   *
   * @see 優先順序為：檔案的實際類型，檔案類型入參，檔案名稱，檔案網址(檔案網址若沒副檔名，才從網址讀取檔案轉Blob，取Blob.type，轉換成本較高)
   * @param [file] 檔案
   * @param [mimeType] 檔案類型
   * @param [name] 檔案名稱
   * @param [url] 檔案網址
   * @returns mimeType 檔案類型MIME Type
   */
  public getTypeByProperty(file?: File, mimeType?: string, name?: string, url?: string): Observable<any> {
    return Observable.create(
      (observer: any) => {
        const result = {
          mimeType: null,
          blobFile: null
        };

        if (file instanceof File) {
          mimeType = file.type;
        }

        if (!mimeType) {
          if (name) {
            mimeType = this.filenameToMimeType(name);
          }

          if (!mimeType) {
            if (url) {
              mimeType = this.filenameToMimeType(url);
            }
          }
        }

        if (mimeType) {
          result.mimeType = mimeType;
          observer.next(result);
        } else {
          this.urlToBlob(url).subscribe(
            (blobFile: any) => {
              result.mimeType = blobFile.type;
              result.blobFile = blobFile;
              observer.next(result);
              observer.complete();
            },
            (error: any) => {
              observer.next(result);
              observer.complete();
            }
          );
        }
      }
    );
  }

  /**
   * 下載檔案
   *
   * @see 1.下載檔案以原始檔案為主，可節省從URL轉成檔案的成本。2.由調用方主導顯示訊息
   * @param fileSrc 檔案或檔案路徑
   * @param [newFilename] 下載時的新檔名
   * @returns result 執行結果 { success: boolean; message: string }
   */
  public downLoad(fileSrc: File | string, newFilename?: string): Observable<{ success: boolean; message: string }> {
    const result = { // 執行結果
      success: false, // 是否成功
      message: '' // 訊息
    };

    const autoName = 'downLoad_' + (new Date()).getTime().toString();
    let name = null;
    if (newFilename) {
      name = newFilename;
    }

    return Observable.create((observer: any) => {
      if (fileSrc instanceof Blob) {
        fileSrc = <File>fileSrc;

        if (!name) {
          if (fileSrc.name) {
            name = fileSrc.name;
          } else if (this.mimeToExtension(fileSrc.type)) {
            name = autoName + '.' + this.mimeToExtension(fileSrc.type);
          }
        }

        this.saveData(fileSrc, name);
        result.success = true;
        observer.next(result);
        observer.complete();
      } else {
        // 從網址讀取檔案轉成Blob，再下載
        this.urlToBlob(fileSrc).subscribe(
          (blobFile: any) => {
            if (!name) {
              if (this.mimeToExtension(blobFile.type)) {
                name = autoName + '.' + this.mimeToExtension(blobFile.type);
              }
            }

            this.saveData(blobFile, name);
            result.success = true;
            observer.next(result);
            observer.complete();
          },
          (error: any) => {
            result.success = false;
            result.message = error;
            observer.next(result);
            observer.complete();
          }
        );
        // fileSrc = <string>fileSrc;
        // let extension = this.mimeToExtension(type); // 取extension
        // if (!extension) { // 沒有extension,改用fileSrc再取一次
        //   extension = this.getImageFileExtensionByString(fileSrc);
        // }
        // if (!extension) { // 沒有extension,改用newFilename再取一次
        //   extension = this.getImageFileExtensionByString(newFilename);
        // }
        // const regex = new RegExp(/^data:image/);
        // const downloadImageRegx = new RegExp('jpg|png|jpeg', 'i'); // 可以直接download的類型,其餘另開窗

        // if (extension && regex.test(fileSrc)) { // dataUrl直接轉存
        //   this.dataUrlToDownload(fileSrc, extension, newFilename);
        //   observer.next(true);
        //   observer.complete();
        // } else if (extension && extension.match(downloadImageRegx)) { // 是可以download圖檔extension
        //   const callback = (dataUrl: any): void => {
        //     this.dataUrlToDownload(dataUrl, extension, newFilename);
        //     observer.next(true);
        //     observer.complete();
        //   };
        //   this.getBase64Image(fileSrc, extension, callback);
        // } else {
        //   //  console.log(extension);
        //   // console.log(fileSrc);
        //   this.openBlank(fileSrc);
        //   observer.next(true);
        //   observer.complete();
        // }
      }
    });
  }

  /**
   * 是否為圖片瀏覽支援的圖片類型
   *
   * @param mimeType MIME Type
   * @returns 是否支援
   */
  public isViewImageType(mimeType: string): boolean {
    if (mimeType && mimeType.indexOf('image/') !== -1) {
      if (mimeType === 'image/tiff') { // 瀏覽器無法顯示image/tiff
        return false;
      } else {
        return true;
      }
    } else {
      return false;
    }
  }

  // /**
  //  * 取副檔名
  //  *
  //  * param {string} type
  //  * returns {string}
  //  */
  // public getFileExtension(type: string): string {
  //   if (this.extensionToMime(type)) {
  //     return this.mimeToExtension(this.extensionToMime(type));
  //   }
  //   if (this.mimeToExtension(type)) {
  //     return this.mimeToExtension(type);
  //   }
  //   return type;
  // }

  // private getImageFileExtensionByString(fileSrc: string): string | null {
  //   let extension = null;
  //   const match = fileSrc.match(/^data:image\/(.*);|\.(jpg|jpeg|png)$/i);
  //   if (match) {
  //     if (match[1]) {
  //       extension = match[1].toLowerCase(); // data:image\/(.*) 抓取的值
  //     } else {
  //       extension = match[2].toLowerCase(); // (jpg|jpeg|png|gif) 抓取的值
  //     }
  //   }
  //   return extension;
  // }

  // /**
  //  * 依名稱或連結取副檔名
  //  * param {string} name
  //  * returns {(string | null)}
  //  */
  // public getFileExtensionByName(name: string): string | null {
  //   let type = null;
  //   if (name) {
  //     const splits = name.split('.');
  //     type = splits.length > 1 ? splits[splits.length - 1] : null;
  //   }
  //   return type;
  // }

  /**
   * 以檔案名稱取對應mimeType
   *
   * @param filename 檔案名稱，或含有副檔名的網址，或DataURL(base64 編碼)
   * @returns mimeType
   */
  public filenameToMimeType(filename: string): string {
    let mimeType = null;

    if (filename.indexOf(';base64,') !== -1) { // DataURL
      const base64Arr = filename.split(';base64,');
      if (base64Arr.length > 1) {
        mimeType = base64Arr[0].replace('data:', '');
      }
    } else if (filename.indexOf('.') !== -1) { // 檔案名稱，或含有副檔名的網址
      const nameArr = filename.split('.');
      if (nameArr.length > 1) {
        const extension = nameArr[nameArr.length - 1];
        mimeType = this.extensionToMime(extension);
      }
    }

    return mimeType;
  }

  private editImageName(imageName: string, type: string): string {
    const imagetype = imageName.split('.').pop().toLocaleLowerCase();
    type = type.toLocaleLowerCase();
    if (imagetype !== type) {
      if ((imagetype === 'jpg' || imagetype === 'jpeg') && (type === 'jpg' || type === 'jpeg')) {
        return imageName;
      } else {
        return imageName += '.' + type;
      }
    } else {
      return imageName;
    }
  }

  // private dataUrlToDownload(dataUrl: any, type: string, imageName: string = (new Date()).getTime().toString()): void {
  //   let blob;
  //   blob = this.base64ToBlob(dataUrl);
  //   // type = blob.type.split('/')[1];
  //   imageName = this.editImageName(imageName, type);
  //   this.saveData(blob, imageName);
  // }

  // private getBase64Image(imgUrl: string, type: string, callback: Function): void {
  //   // if (type === 'gif') { // gif或不是圖檔,不轉直接開_blank窗
  //   //   this.openBlank(imgUrl);
  //   //   return;
  //   // }
  //   const img = new Image();
  //   let dataURL: any;
  //   img.onload = (): void => {
  //     const canvas = document.createElement('canvas');
  //     canvas.width = img.width;
  //     canvas.height = img.height;
  //     const ctx = canvas.getContext('2d');
  //     ctx.drawImage(img, 0, 0);
  //     if (type === 'jpg' || type === 'jpeg') {
  //       dataURL = canvas.toDataURL('image/jpg', 0.8);
  //     } else {
  //       dataURL = canvas.toDataURL('image/png');
  //     }
  //     // dataURL = dataURL.replace(/^data:image\/(png|jpg);base64,/, '');
  //     callback(dataURL); // the base64 string
  //   };
  //   img.onerror = (err): void => {
  //     // Access-Control-Allow-Origin錯誤直接另開窗
  //     this.openBlank(imgUrl);
  //   };
  //   // set attributes and src
  //   img.setAttribute('crossOrigin', 'anonymous');
  //   img.src = imgUrl;
  // }

  // private base64ToBlob(data: any): any {
  //   const rImageType = /data:(image\/.+);base64,/;
  //   let mimeString = '';
  //   let raw, uInt8Array, i, rawLength;

  //   raw = data.replace(rImageType, (header, imageType) => {
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

  private saveData = ((): any => {
    const a: any = document.createElement('a');
    document.body.appendChild(a);
    a.style = 'display: none';
    return (blob: any, fileName: any): void => {
      const url = window.URL.createObjectURL(blob);
      a.href = url;
      a.download = fileName;
      a.click();
      window.URL.revokeObjectURL(url);
    };
  })();

  private openBlank(url: string): void {
    const a: any = document.createElement('a');
    document.body.appendChild(a);
    a.style = 'display: none';
    a.href = url;
    a.target = '_blank';
    a.click();
    window.URL.revokeObjectURL(url);
  }

  public mimeToIcon(mimeType: string): string {
    const list = this.getMimeTypeList();
    let icon = 'file';

    if (list[mimeType] && list[mimeType].hasOwnProperty('icon')) {
      icon = list[mimeType].icon;
    }

    return icon;
  }

  private extensionToMime(extension: string): string {
    extension = extension.toLocaleLowerCase();
    let mimeType = null;
    const list = this.getMimeTypeList();

    Object.keys(list).forEach(
      (mimeTypeKey: any) => {
        if (list[mimeTypeKey].hasOwnProperty('extension')) {
          list[mimeTypeKey].extension.forEach(
            (element: any) => {
              if (element === extension) {
                mimeType = mimeTypeKey;
              }
            }
          );
        }
      }
    );

    return mimeType;
  }

  private mimeToExtension(mimeType: string): string {
    const list = this.getMimeTypeList();
    let extension = null;

    if (list[mimeType] && list[mimeType].hasOwnProperty('extension')) {
      extension = list[mimeType].extension[0];
    }

    return extension;
  }

  private getMimeTypeList(): any {
    return {
      'image/jpeg': { 'extension': ['jpg', 'jpeg'], 'icon': 'file-image' },
      'image/png': { 'extension': ['png'], 'icon': 'file-image' },
      'image/gif': { 'extension': ['gif'], 'icon': 'file-image' },
      'image/tiff': { 'extension': ['tif', 'tiff'], 'icon': 'file-image' },
      'image/x-icon': { 'extension': ['ico', 'cur'], 'icon': 'file-image' },
      'image/vnd.microsoft.icon': { 'extension': ['ico'], 'icon': 'file-image' },
      'image/bmp': { 'extension': ['bmp'], 'icon': 'file-image' },
      'image/svg+xml': { 'extension': ['svg'], 'icon': 'file-image' },
      'image/webp': { 'extension': ['webp'], 'icon': 'file-image' },
      'video/mp4': { 'extension': ['mp4'], 'icon': 'video-camera' },
      'video/mpeg': { 'extension': ['mpeg'], 'icon': 'video-camera' },
      'video/webm': { 'extension': ['webm'], 'icon': 'video-camera' },
      'video/ogg': { 'extension': ['ogg', 'ogv'], 'icon': 'video-camera' },
      'video/avi': { 'extension': ['avi'], 'icon': 'video-camera' },
      'video/mp2t': { 'extension': ['ts'], 'icon': 'video-camera' },
      'video/3gpp': { 'extension': ['3gp'], 'icon': 'video-camera' },
      'video/3gpp2': { 'extension': ['3gp2'], 'icon': 'video-camera' },
      'video/x-ms-wmv': { 'extension': ['wmv'], 'icon': 'video-camera' },
      'audio/mpeg': { 'extension': ['mp3'], 'icon': 'customer-service' },
      'audio/ogg': { 'extension': ['oga'], 'icon': 'customer-service' },
      'application/pdf': { 'extension': ['pdf'], 'icon': 'file-pdf' },
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': { 'extension': ['docx'], 'icon': 'file-word' },
      'application/msword': { 'extension': ['doc'], 'icon': 'file-word' },
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': { 'extension': ['xlsx'], 'icon': 'file-excel' },
      'application/vnd.ms-excel': { 'extension': ['xls', 'xlt'], 'icon': 'file-excel' },
      'application/vnd.ms-excel.sheet.macroEnabled.12': { 'extension': ['xlsm'], 'icon': 'file-excel' },
      'application/vnd.openxmlformats-officedocument.spreadsheetml.template': { 'extension': ['xltx'], 'icon': 'file-excel' },
      'application/vnd.ms-excel.template.macroEnabled.12': { 'extension': ['xltm'], 'icon': 'file-excel' },
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': { 'extension': ['pptx'], 'icon': 'file-ppt' },
      'application/vnd.ms-powerpoint': { 'extension': ['ppt'], 'icon': 'file-ppt' },
      'application/zip': { 'extension': ['zip'], 'icon': 'file-zip' },
      'application/x-zip-compressed': { 'extension': ['zip'], 'icon': 'file-zip' },
      'application/x-7z-compressed': { 'extension': ['7z'], 'icon': 'file-zip' },
      'application/gzip': { 'extension': ['gz'], 'icon': 'file-zip' },
      'application/x-tar': { 'extension': ['tar'], 'icon': '' },
      'application/json': { 'extension': ['json'], 'icon': '' },
      'application/ld+json': { 'extension': ['jsonld'], 'icon': '' },
      'application/java-archive': { 'extension': ['jar'], 'icon': '' },
      'text/css': { 'extension': ['css'], 'icon': 'file-text' },
      'text/csv': { 'extension': ['csv'], 'icon': 'file-text' },
      'text/html': { 'extension': ['html', 'htm'], 'icon': 'file-text' },
      'text/calendar': { 'extension': ['ics'], 'icon': 'file-text' },
      'text/javascript': { 'extension': ['js'], 'icon': 'file-text' },
      'text/plain': { 'extension': ['txt'], 'icon': 'file-text' },
      'text/xml': { 'extension': ['xml'], 'icon': 'file-text' }
    };
  }
}
