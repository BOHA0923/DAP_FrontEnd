import { Injectable, ElementRef, Renderer2, RendererFactory2, NgZone } from '@angular/core';
import { Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

import ImageViewer from '@webdpt/iv-viewer';
import { IDwImageViewerAction } from './interface/dw-image-viewer-file.interface';
import { DwImageViewerFileService } from './dw-image-viewer-file.service';

@Injectable()
export class DwImageViewerService {
  viewer: any;
  viewerFullscreen: any;
  zoomPercent = 100; // 放大基數

  ROTACAO_PADRAO_GRAUS = 90; // 旋轉角度

  rotacaoImagemAtual: number; // 已旋轉角度
  isImagemVertical: boolean; // 是否已旋轉
  imageContainer: ElementRef; // 圖片顯示element
  initIntervalId: any;
  imageDimIntervalId: any;
  fitWidth: number; // 計算後的寬度
  fitHeight: number; // 計算後的高度
  originWidth: number; // 圖檔原始寬度
  originHeight: number; // 圖檔原始高度
  nowScale: number; // 現在的縮放比
  validImageExtension: string = 'jpg|jpeg|png|gif|bmp|webp|svg|ico'; // 可以秀的圖檔類型
  private renderer: Renderer2;

  constructor(
    private zone: NgZone,

    private rendererFactory: RendererFactory2,
    private translateService: TranslateService,
    private dwImageViewerFileService: DwImageViewerFileService
  ) {
    this.renderer = this.rendererFactory.createRenderer(null, null);
  }

  /**
   * 初始化圖片檢視舞台
   *
   * param {ElementRef} imageContainer
   * param {*} [options={ maxZoom: 800 }]
   * returns {Observable<boolean>}
   */
  inicializarImageViewer(imageContainer: ElementRef, options: any = { maxZoom: 800 }): Observable<boolean> {
    return Observable.create(observer => {
      this.zone.runOutsideAngular(() => {
        options.snapView = false; // 小圖框不適用,強制關閉
        this.viewer = new ImageViewer(imageContainer.nativeElement, options);
        this.imageContainer = imageContainer;
        this.initIntervalId = setInterval(() => {
          // console.log('imageContainer width:' + window.getComputedStyle(this.imageContainer.nativeElement).width);
          // 通知imageContainer載入完畢,表示iv-viewer可以依照container計算對應寬高
          if (!!window.getComputedStyle(this.imageContainer.nativeElement).width) {
            clearInterval(this.initIntervalId);
            observer.next(true);
          }
        }, 100);
      });
    });
  }

  /**
   * 在舞台秀出圖片
   * param {string} imageSrc 圖片連結或dataUrl
   */
  showImage(imageSrc: string): void {
    this.zone.runOutsideAngular(() => {
      if (!this.isImage(imageSrc)) {
        return;
      }
      this.initImageSetting();
      this.viewer.load(imageSrc); // 一個參數只產生iv-small-image 第二個參數會再撈高解析，產生iv-large-image，移除iv-small-image(目前不用這樣,會有問題)

      this.imageDimIntervalId = setInterval(() => {
        //  console.log('imageDim:' + JSON.stringify(this.viewer._state));
        // viewer image loaded完畢
        if (this.viewer._state.imageDim && this.viewer._state.imageDim.w &&
          this.viewer._elements.image && this.viewer._elements.image.naturalWidth) {
          this.fitWidth = this.viewer._state.imageDim.w;
          this.fitHeight = this.viewer._state.imageDim.h;
          this.originWidth = this.viewer._elements.image.naturalWidth;
          this.originHeight = this.viewer._elements.image.naturalHeight;
          // console.log(this.fitWidth);
          // console.log(this.originWidth);
          clearInterval(this.imageDimIntervalId);
        }
      }, 50);
    });
  }

  /**
   * dataUrl或圖片連結返回true
   *
   * param {string} info 傳入要判斷的資料
   * returns {boolean}
   */
  private isImage(info: string): boolean {
    // const regex = RegExp('^(data:image|(https|http|www\.))|(.jpg|.JPG|.jpeg|.JPEG|.png|.gif)$', 'g');
    // data:image非tiff檔
    const regex = RegExp(`^(data:image\/(?!tiff)|(https|http|www\.))|\.(${this.validImageExtension})$`, 'gi');
    return regex.test(info);
  }

  // /**
  //  *  傳入dataUrl或副檔名string,返回圖片副檔名,返回null表示非圖片
  //  *
  //  * param {string} info
  //  * returns {(string | null)}
  //  */
  // getImageExtensionByString(info: string): string | null {
  //   const imageRegx = new RegExp(`^data:image\/(.*);|\.(${this.validImageExtension})$`, 'i'); // 忽略大小寫
  //   let extension = null;
  //   if (!info) {
  //     return extension;
  //   }
  //   const match = info.match(imageRegx);
  //   if (match) {
  //     if (match[1]) {
  //       // extension = this.mimeTypeService.mimeToExtension[`image/${match[1]}`]; // data:image\/(.*) 抓取的值
  //       const type = 'image/' + match[1];
  //       extension = this.dwImageViewerFileService.getFileExtension(type);
  //     } else {
  //       extension = match[2].toLowerCase(); // (jpg|jpeg|png|gif) 抓取的值
  //     }
  //   }
  //   return extension;
  // }

  private initImageSetting(): void {
    this.nowScale = 1;
    this.rotacaoImagemAtual = 0;
    this.isImagemVertical = false;
  }

  /**
   * 縮小
   */
  zoomIn(): void {
    this.zone.runOutsideAngular(() => {
      this.zoomPercent += 10;
      this.viewer.zoom(this.zoomPercent);
    });
  }

  /**
   * 放大
   */
  zoomOut(): void {
    this.zone.runOutsideAngular(() => {
      if (this.zoomPercent === 100) {
        return;
      }
      this.zoomPercent -= 10;
      if (this.zoomPercent < 0) {
        this.zoomPercent = 0;
      }
      this.viewer.zoom(this.zoomPercent);
    });
  }

  /**
   * 全螢幕顯示
   *
   * param {*} imageSrc  圖檔資料
   * param {*} [options]
   * returns {void}
   */
  fullScreen(imageSrc: string, options: any = { snapView: false }): void {
    if (!this.isImage(imageSrc)) {
      return;
    }
    this.zone.runOutsideAngular(() => {
      const timeout = this.resetZoom();

      setTimeout(() => {
        this.viewerFullscreen = new ImageViewer.FullScreenViewer(options);
        this.initImageSetting();
        this.viewerFullscreen.show(imageSrc);
        this.atualizarRotacao(false);
      }, timeout);
    });
  }

  /**
   * 原尺寸
   */
  originalSize(): void {
    this.zone.runOutsideAngular(() => {
      const widthResize = this.originWidth;
      // let heightResize = this.originHeight;
      const fitWidthResize = this.fitWidth;
      let zoom = widthResize / fitWidthResize;

      if (this.nowScale !== 1) {
        // widthResize = widthResize / this.nowScale;
        // // heightResize = heightResize / this.nowScale;
        // fitWidthResize = fitWidthResize / this.nowScale;
        zoom = zoom / this.nowScale;
      }

      this.viewer.zoom(zoom * 100);
    });
  }

  /**
   * 重回舞台大小置中
   */
  resetZoom(): number {
    let timeout = 800;
    this.zone.runOutsideAngular(() => {
      this.zoomPercent = 100;
      this.viewer.zoom(this.zoomPercent);
      if (this.viewer._state.zoomValue === this.zoomPercent) {
        timeout = 0;
      }
    });
    return timeout;
  }

  /**
   * 右旋
   */
  rotateRight(): void {
    this.zone.runOutsideAngular(() => {
      const timeout = this.resetZoom();
      setTimeout(() => {
        this.rotacaoImagemAtual += this.ROTACAO_PADRAO_GRAUS;
        this.isImagemVertical = !this.isImagemVertical;
        this.setRotateStyle();
        // this.atualizarRotacao();
      }, timeout);
    });
  }

  /**
   * 左旋
   */
  rotateLeft(): void {
    this.zone.runOutsideAngular(() => {
      const timeout = this.resetZoom();
      setTimeout(() => {
        this.rotacaoImagemAtual -= this.ROTACAO_PADRAO_GRAUS;
        this.isImagemVertical = !this.isImagemVertical;
        this.setRotateStyle();
        // this.atualizarRotacao();
      }, timeout);
    });
  }

  // 替換atualizarRotacao, 更精準呈現適合舞台大小的scale
  private setRotateStyle(): void {
    this.zone.runOutsideAngular(() => {
      let scale = 1;
      const containerElement = this.imageContainer.nativeElement;
      // const ivLargeImageElement = containerElement.getElementsByClassName('iv-small-image').item(0);
      let difference = 0;
      const isWider: boolean = this.fitWidth >= this.fitHeight;
      const isTransAddNumber = (Math.abs(this.rotacaoImagemAtual) / 90) % 2 === 1;

      if (isTransAddNumber) { // -270 -90 90 270 450 ....
        if (isWider) { // 寬形
          difference = this.fitWidth - containerElement.clientHeight;
          if (difference > 0) {
            scale = ((this.fitWidth - difference) / this.fitWidth);
          } else if (difference < 0) {
            scale = ((this.fitWidth + Math.abs(difference)) / this.fitWidth);
          }
        } else { // 長形
          difference = this.fitHeight - containerElement.clientWidth;
          if (difference > 0) {
            scale = ((this.fitHeight - difference) / this.fitHeight);
          } else if (difference < 0) {
            scale = ((this.fitHeight + Math.abs(difference)) / this.fitHeight);
          }
          const newWidth = this.fitWidth * scale;
          if (newWidth > containerElement.clientHeight) {
            difference = this.fitWidth - containerElement.clientHeight;
            scale = (this.fitWidth - difference) / this.fitWidth;
          }
        }

      }

      this.nowScale = scale;
      const novaRotacao = `rotate(${this.rotacaoImagemAtual}deg)`; // 變形
      this.carregarImagem(novaRotacao, `scale(${scale})`, true);
    });
  }

  private atualizarRotacao(isAnimacao: boolean = true): void {
    this.zone.runOutsideAngular(() => {
      let scale = '';
      if (this.isImagemVertical && this.isImagemSobrepondoNaVertical()) {
        scale = `scale(${this.getScale()})`; // 縮放
      }
      const novaRotacao = `rotate(${this.rotacaoImagemAtual}deg)`; // 變形
      this.carregarImagem(novaRotacao, scale, isAnimacao);
    });
  }

  // 旋轉時計算縮放大小在框裏完整顯示
  private getScale(): any {
    // // 旋轉固定不變大小
    // return 1;
    const containerElement = this.imageContainer.nativeElement;
    const ivLargeImageElement = containerElement.getElementsByClassName('iv-small-image').item(0);
    const diferencaTamanhoImagem = ivLargeImageElement.clientWidth - containerElement.clientHeight;

    if (diferencaTamanhoImagem >= 250 && diferencaTamanhoImagem < 300) {

      return (ivLargeImageElement.clientWidth - containerElement.clientHeight) / (containerElement.clientHeight) - 0.1;
    } else if (diferencaTamanhoImagem >= 300 && diferencaTamanhoImagem < 400) {

      return ((ivLargeImageElement.clientWidth - containerElement.clientHeight) / (containerElement.clientHeight)) - 0.15;
    } else if (diferencaTamanhoImagem >= 400) {

      return ((ivLargeImageElement.clientWidth - containerElement.clientHeight) / (containerElement.clientHeight)) - 0.32;
    }

    return 0.6;
  }

  private isImagemSobrepondoNaVertical(): any {
    const margemErro = 5;
    const containerElement: Element = this.imageContainer.nativeElement;
    const ivLargeImageElement: Element = containerElement.getElementsByClassName('iv-small-image').item(0);

    return containerElement.clientHeight < ivLargeImageElement.clientWidth + margemErro;
  }

  private carregarImagem(novaRotacao: string, scale: string, isAnimacao: boolean = true): void {
    this.zone.runOutsideAngular(() => {
      if (isAnimacao) {
        this.adicionarAnimacao('iv-snap-image');
        this.adicionarAnimacao('iv-small-image');
      }
      this.adicionarRotacao('iv-snap-image', novaRotacao, scale);
      this.adicionarRotacao('iv-small-image', novaRotacao, scale);
      setTimeout(() => {
        if (isAnimacao) {
          this.retirarAnimacao('iv-snap-image');
          this.retirarAnimacao('iv-small-image');
        }
      }, 501);
    });
  }

  // transform css
  private adicionarRotacao(componente: string, novaRotacao: string, scale: string): void {
    this.zone.runOutsideAngular(() => {
      this.setStyleClass(componente, 'transform', `${novaRotacao} ${scale}`);
    });
  }

  // 動畫平順效果
  private retirarAnimacao(componente: string): void {
    this.zone.runOutsideAngular(() => {
      this.setStyleClass(componente, 'transition', 'auto');
    });
  }

  // 動畫平順效果
  private adicionarAnimacao(componente: string): void {
    this.zone.runOutsideAngular(() => {
      this.setStyleClass(componente, 'transition', `0.5s linear`);
    });
  }

  private setStyleClass(nomeClasse: string, nomeStyle: string, cor: string): void {
    this.zone.runOutsideAngular(() => {
      const listaElementos = this.imageContainer.nativeElement.getElementsByClassName(nomeClasse);
      for (let cont = 0; cont < listaElementos.length; cont++) {
        this.renderer.setStyle(listaElementos.item(cont), nomeStyle, cor);
      }
    });
  }

  destroy(): void {
    this.viewer.destroy();
  }

  /**
   * 隱藏iv-wrap
   */
  hideViewer(): void {
    this.zone.runOutsideAngular(() => {
      this.setStyleClass('iv-wrap', 'display', 'none');
    });
  }

  /**
   * 開啟iv-wrap
   */
  showViewer(): void {
    this.zone.runOutsideAngular(() => {
      this.setStyleClass('iv-wrap', 'display', 'block');
    });
  }

  /**
   * 圖片瀏覽預設功能
   */
  public viewerActionDefault(): IDwImageViewerAction {
    const action: IDwImageViewerAction = {
      dwPrevious: { // 前一個：預設顯示
        show: true, // 是否顯示
        title: this.translateService.instant('dw-image-viewer-previous'), // 多語言
        disabled: false // 禁用
      },
      dwNext: { // 下一個：預設顯示
        show: true,
        title: this.translateService.instant('dw-image-viewer-next'),
        disabled: false
      },
      dwFullScreen: { // 全螢幕：預設顯示
        show: true,
        title: this.translateService.instant('dw-image-viewer-full-screen'),
        disabled: false
      },
      dwZoomIn: { // 放大：預設顯示
        show: true,
        title: this.translateService.instant('dw-image-viewer-zoom-in'),
        disabled: false
      },
      dwZoomOut: { // 縮小：預設顯示
        show: true,
        title: this.translateService.instant('dw-image-viewer-zoom-out'),
        disabled: false
      },
      dwResetZoom: { // 重設大小：預設顯示
        show: true,
        title: this.translateService.instant('dw-image-viewer-reset-zoom'),
        disabled: false
      },
      dwOriginalSize: { // 實際大小：預設顯示
        show: true,
        title: this.translateService.instant('dw-image-viewer-originSize'),
        disabled: false
      },
      dwRotateRight: { // 右旋轉：預設顯示
        show: true,
        title: this.translateService.instant('dw-image-viewer-rotate-right'),
        disabled: false
      },
      dwRotateLeft: { // 左旋轉：預設顯示
        show: true,
        title: this.translateService.instant('dw-image-viewer-rotate-left'),
        disabled: false
      },
      dwDownload: { // 下載：預設顯示
        show: true,
        title: this.translateService.instant('dw-image-viewer-download'),
        disabled: false
      },
    };

    return action;
  }
}
