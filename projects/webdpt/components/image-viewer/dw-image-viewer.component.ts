import { Component, OnInit, Input, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { DwMessageService } from 'ng-quicksilver/message';

import { DwImageViewerService } from './dw-image-viewer.service';
import { DwImageViewerFileService } from './dw-image-viewer-file.service';
// import { DwMimeTypeService } from './dw-mime-type.service';
import { IDwImageViewerAction, IDwImageViewerChangeData } from './interface/dw-image-viewer-file.interface';

@Component({
  selector: 'dw-image-viewer',
  templateUrl: './dw-image-viewer.component.html',
  styleUrls: ['./dw-image-viewer.component.less'],
  providers: [DwImageViewerService] // 每個DwImageViewerComponent使用獨立servcie
})
export class DwImageViewerComponent implements OnInit, AfterViewInit {
  @ViewChild('viewContainer') viewContainer: ElementRef;

  @Input() uid: string; // 檔案唯一識別碼
  @Input() fileSrc: string | File = ''; // 檔案來源。檔案URL或原始檔案
  @Input() name: string; // 檔名

  private _type: string;
  @Input()
  set type(val: string) { // 檔案類型
    this._type = val;
    // this.nowFileExtension = val;
    // if (val) {
    //   this._type = this.imageViewerFileService.getFileExtension(val); // 轉換為副檔名
    //   this.nowFileExtension = this._type;
    // }
  }
  get type(): string {
    return this._type;
  }

  // nowFileExtension: string;
  imageRegx: RegExp; // image viewer可以秀的圖檔類型(但只有jpg|png|gif|jpeg|bmp可透過dmc服務壓縮)
  isImage: boolean = true;
  isVideo: boolean = false; // 僅顯視html5 video 支援格示檔案mp4,webm,ogg(ogv)
  // videoMimeType: string;
  private _originViewerAction: IDwImageViewerAction = this.imageViewerService.viewerActionDefault();
  private _viewerAction: IDwImageViewerAction = this.imageViewerService.viewerActionDefault();

  @Input()
  set viewerAction(options: IDwImageViewerAction) { // 圖片瀏覽功能
    Object.keys(options).forEach(name => {
      this._viewerAction[name] = Object.assign(this._viewerAction[name], options[name]);
    });
  }
  get viewerAction(): IDwImageViewerAction {
    return this._viewerAction;
  }

  @Input() title: string; // 檔案標題

  public dwContainerStyle = { // 瀏覽容器樣式
    'background-color': '#222222',
    'height': '450px'
  };

  @Input()
  set containerStyle(containerStyle: { [klass: string]: any; }) { // 瀏覽容器樣式
    if (containerStyle) {
      Object.keys(containerStyle).forEach(
        (key: string) => {
          this.dwContainerStyle[key] = containerStyle[key];
        }
      );
    }
  }

  @Input() toolbarStyle: { [klass: string]: any; }; // 工具列樣式
  @Input() titleStyle: { [klass: string]: any; }; // 標題樣式
  @Input() fileIconColor: string = '#ffffff'; // 檔案圖示顏色
  @Input() onPrevious: (uid: string) => Observable<IDwImageViewerChangeData>;
  @Input() onNext: (uid: string) => Observable<IDwImageViewerChangeData>;

  isDownLoad: boolean = false;
  public fileSrcDataUrl = '';

  constructor(
    private imageViewerService: DwImageViewerService,
    private imageViewerFileService: DwImageViewerFileService,
    private translateService: TranslateService,
    private dwMessageService: DwMessageService,
  ) {
    // image viewer可以秀的圖檔類型(但只有jpg|png|gif|jpeg|bmp可透過dmc服務壓縮)
    this.imageRegx = new RegExp(this.imageViewerService.validImageExtension, 'i');
  }
  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    if (!this.fileSrc) {
      return;
    }
    Object.keys(this.viewerAction).forEach(name => {
      this._originViewerAction[name] = Object.assign({}, this.viewerAction[name]);
    });
    this.imageViewerService.inicializarImageViewer(this.viewContainer).subscribe(loaded => {
      this.showImage();
    });
  }

  showImage(): void {
    // type>name>url
    if (!this.fileSrc) {
      return;
    }

    this.imageViewerService.showViewer();

    let originFileObj = null;
    let url = null;

    if (this.fileSrc instanceof File) {
      originFileObj = this.fileSrc;
    } else {
      url = this.fileSrc;
    }

    this.imageViewerFileService.getTypeByProperty(originFileObj, this.type, this.name, url).subscribe(
      (result: any) => {
        this.type = result.mimeType;
        this.isImage = this.imageViewerFileService.isViewImageType(this.type);

        if (this.fileSrc instanceof File) { // 檔案格式
          // blobtoDataURL後的處理BEGIN######
          const callback = (dataUrl: string): void => {
            this.fileSrcDataUrl = dataUrl;

            if (this.isImage) { // 瀏覽器無法顯示image/tiff
              this.imageViewerService.showImage(this.fileSrcDataUrl);
            } else {
              this._handleNotImageFile();
            }
            // .match(/^data:image\/(.*);|\.(jpg|jpeg|png|gif)$/i)
            // const imageExtension = this.imageViewerService.getImageExtensionByString(dataUrl);
            // if (imageExtension) {
            // this.imageViewerService.showViewer();
            // this.nowFileExtension = imageExtension;
            // } else {
            // this._handleNotImageFile();
            // }
          };
          // blobtoDataURL後的處理END#####
          this.blobtoDataURL(this.fileSrc, callback); // 檔案轉dataUrl
        } else {
          this.fileSrcDataUrl = this.fileSrc;

          if (this.isImage) {
            this.imageViewerService.showImage(this.fileSrcDataUrl);
          } else {
            this._handleNotImageFile();
          }
          // 檔案名判斷優先序:type>url>name
          // const getImageExtensionByName = this.imageViewerService.getImageExtensionByString(this.name);
          // const getImageExtensionByUrl = this.imageViewerService.getImageExtensionByString(this.fileSrc);
          // if (this.type && this.type.match(this.imageRegx)) { // 文檔中心分享檔案,http://...fileIdxxx//toAnyOne
          //   // this.nowFileExtension = this.type;
          //   this.imageViewerService.showImage(this.fileSrc);
          // } else if (getImageExtensionByUrl) { // fileSrc.match(/^data:image\/(.*);|\.(jpg|jpeg|png|gif)$/i)
          //   // this.nowFileExtension = getImageExtensionByUrl;
          //   this.imageViewerService.showImage(this.fileSrc);
          // } else if (getImageExtensionByName) { // name.match(/^data:image\/(.*);|\.(jpg|jpeg|png|gif)$/i)
          //   // this.nowFileExtension = getImageExtensionByName;
          //   this.imageViewerService.showImage(this.fileSrc);
          // } else {
          //   this._handleNotImageFile();
          // }
        }
      }
    );
  }

  _handleNotImageFile(): void {
    this.imageViewerService.hideViewer();
    this.viewerAction['dwFullScreen'].disabled = true;
    this.viewerAction['dwZoomIn'].disabled = true;
    this.viewerAction['dwZoomOut'].disabled = true;
    this.viewerAction['dwResetZoom'].disabled = true;
    this.viewerAction['dwOriginalSize'].disabled = true;
    this.viewerAction['dwRotateRight'].disabled = true;
    this.viewerAction['dwRotateLeft'].disabled = true;

    if (this.type === 'video/mp4' || this.type === 'video/webm' || this.type === 'video/ogg') {
      this.isVideo = true;
    } else {
      this.isVideo = false;
    }
    // if (!this.nowFileExtension) {
    //   let fileSrc = '';
    //   if (typeof this.fileSrc === 'string') {
    //     fileSrc = this.fileSrc;
    //   }

    //   const splitUrlInfo = fileSrc ? fileSrc.split('.') : [];
    //   const splitNameInfo = this.name ? this.name.split('.') : [];
    //   this.nowFileExtension = this.nowFileExtension ? this.nowFileExtension : 'unKnownFileType';
    //   if (splitNameInfo.length > 1) {
    //     this.nowFileExtension = splitNameInfo[splitNameInfo.length - 1].toLowerCase();
    //   }
    //   if (splitUrlInfo.length > 1) {
    //     this.nowFileExtension = splitUrlInfo[splitUrlInfo.length - 1].toLowerCase();
    //   }
    // }
    // this.isVideo = (this.nowFileExtension === 'mp4' || this.nowFileExtension === 'webm'
    //   || this.nowFileExtension === 'ogg' || this.nowFileExtension === 'ogv') ? true : false;
    // if (this.isVideo) {
    //   this.videoMimeType = this.imageViewerFileService.filenameToMimeType(this.nowFileExtension);
    // }
  }
  blobtoDataURL(blob: any, callback: Function): void {
    const fr = new FileReader();
    fr.onload = (e: any): void => {
      callback(e.target.result);
    };
    fr.readAsDataURL(blob);
  }
  download(): void {
    this.isDownLoad = true;
    let downloadFile = null;

    if (this.fileSrc instanceof File) {
      downloadFile = this.fileSrc;
    } else {
      downloadFile = this.fileSrcDataUrl;
    }

    this.imageViewerFileService.downLoad(downloadFile, this.name).subscribe((result) => {
      this.isDownLoad = false;
      if (!result.success) {
        const msg = this.translateService.instant('dw-downLoad-err');
        this.dwMessageService.create('loading', msg);
      }
    });
  }
  fullScreen(): void {
    this.imageViewerService.fullScreen(this.fileSrcDataUrl);
  }
  originalSize(): void {
    this.imageViewerService.originalSize();
  }
  resetZoom(): void {
    this.imageViewerService.resetZoom();
  }
  zoomIn(): void {
    this.imageViewerService.zoomIn();
  }

  zoomOut(): void {
    this.imageViewerService.zoomOut();
  }
  rotateRight(): void {
    this.imageViewerService.rotateRight();
  }
  rotateLeft(): void {
    this.imageViewerService.rotateLeft();
  }
  reSetInfo(newInfo: IDwImageViewerChangeData): void {
    this.viewerAction = this._originViewerAction;
    this.isImage = true;
    this.type = null;
    this.fileSrc = null;
    this.uid = null;
    this.name = null;
    this.isVideo = false;
    // this.videoMimeType = null;
    this.title = null;
    // this.nowFileExtension = null;
    Object.keys(newInfo).forEach(name => {
      this[name] = newInfo[name];
    });
  }

  next(): void {
    this.onNext(this.uid).subscribe(
      (val: IDwImageViewerChangeData) => {
        if (val.fileSrc) {
          this.reSetInfo(val);
          this.showImage();
        }
      }
    );
  }

  previous(): void {
    this.onPrevious(this.uid).subscribe(
      (val: IDwImageViewerChangeData) => {
        if (val.fileSrc) {
          this.reSetInfo(val);
          this.showImage();
        }
      }
    );
  }
}

