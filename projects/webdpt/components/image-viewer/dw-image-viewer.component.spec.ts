// TODO: #20200623
// 1.extensionToMime改用imageViewerFileService.filenameToMimeType
// 2.用type即可，移除nowFileExtension、videoMimeType

import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { DwImageViewerComponent } from './dw-image-viewer.component';
import { DwImageViewerFileIconComponent } from './dw-image-viewer-file-icon.component';

import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { DebugElement, Component, ViewChild, ElementRef } from '@angular/core';
import { setDefaultTimeoutInterval } from '@webdpt/framework/sharedTest/default_timeout.spec';

import { DwImageViewerService } from './dw-image-viewer.service';
import { DwImageViewerFileService } from './dw-image-viewer-file.service';
import { DwMimeTypeService, IkeyValue } from './dw-mime-type.service'; // TODO: #20200623
import { TranslateTestingModule } from '@webdpt/framework/sharedTest/translateTesting.module';


import { Observable, of } from 'rxjs';
import { IDwImageViewerAction } from './interface/dw-image-viewer-file.interface';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IconDefinition } from '@ant-design/icons-angular';
import * as AllIcons from '@ant-design/icons-angular/icons';
// import { LeftOutline, RightOutline, ZoomInOutline, ZoomOutOutline, RedoOutline, UndoOutline, ColumnWidthOutline, FullscreenOutline,
// EditFill, DownloadOutline } from '@ant-design/icons-angular/icons';
import { DwIconModule, DW_ICONS } from 'ng-quicksilver/icon';

// const icons: IconDefinition[] = [
//   LeftOutline, RightOutline, ZoomInOutline, ZoomOutOutline, RedoOutline, UndoOutline, ColumnWidthOutline, FullscreenOutline,
//   EditFill, DownloadOutline ];

// html 裡用到的 <i dw-icon> 的值
const antDesignIcons = AllIcons as {
  [key: string]: IconDefinition;
};
const icons: IconDefinition[] = Object.keys(antDesignIcons).map(key => {
  const i = antDesignIcons[key];
  return i;
});


describe('DwImageViewerComponent', () => {
  let component: DwImageViewerComponent;
  let fixture: ComponentFixture<DwImageViewerComponent>;
  let imageViewerService: DwImageViewerService;
  let imageViewerFileService: DwImageViewerFileService;
  let mimeTypeService: DwMimeTypeService; // TODO: #20200623
  setDefaultTimeoutInterval();
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        BrowserAnimationsModule,
        // TranslateModule,
        DwIconModule,
        TranslateTestingModule,
        HttpClientModule,
      ],
      declarations: [DwImageViewerComponent, DwImageViewerFileIconComponent],
      providers: [
        {
          provide: DW_ICONS,
          useValue: icons
        }
      ] // ***重要:DwImageViewerService在是DwImageViewerComponent私有service,要用overrideComponent設定,test才讀取得到
    })
      .overrideComponent(DwImageViewerComponent, {
        set: {
          providers: [
            {
              provide: DwImageViewerService, useValue: {
                inicializarImageViewer: (imageContainer: any, options: any): Observable<boolean> => {
                  return of(true);
                },
                showImage: (imageSrc: string): void => { },
                isImage: (info: string): boolean => true,
                getImageExtensionByString: (info: string): string | null => null,
                zoomIn: (): void => { },
                zoomOut: (): void => { },
                fullScreen: (imageSrc: any, options: any): void => { },
                showOriginSize: (): void => { },
                resetarZoom: (): void => { },
                rotateRight: (): void => { },
                rotateLeft: (): void => { },
                destroy: (): void => { },
                hideViewer: (): void => { },
                showViewer: (): void => { },
                viewerActionDefault: (): IDwImageViewerAction => {
                  // 下面的屬性都要給defaultValue,不然會出undefined or null cannot convert to object錯
                  const defaultValue = {
                    show: true,
                    title: '',
                    disabled: false
                  };
                  const action = {
                    dwPrevious: Object.assign({}, defaultValue),
                    dwNext: Object.assign({}, defaultValue),
                    dwFullScreen: Object.assign({}, defaultValue),
                    dwZoomIn: Object.assign({}, defaultValue),
                    dwZoomOut: Object.assign({}, defaultValue),
                    dwResetZoom: Object.assign({}, defaultValue),
                    dwOriginalSize: Object.assign({}, defaultValue),
                    dwRotateRight: Object.assign({}, defaultValue),
                    dwRotateLeft: Object.assign({}, defaultValue),
                    dwDownload: Object.assign({}, defaultValue),
                  };
                  Object.keys(action).forEach(name => {
                    action[name].title = name;
                  });
                  return action;
                },
              }
            },
            {
              provide: DwMimeTypeService, useValue: {
                extensionToMime: { jpg: 'image/jpeg', mp4: 'video/mp4' }, // TODO: #20200623
                mimeToExtension: { 'image/jpeg': 'jpg', 'video/mp4': 'mp4' }
                // get extensionToMime(): IkeyValue {
                //   return { jpg: 'image/jpeg',  mp4: 'video/mp4' };
                // },
                // get mimeToExtension(): IkeyValue {
                //   return { 'image/jpeg': 'jpg', 'video/mp4': 'mp4'};
                // }

                // extensionToMime: (): IkeyValue => {
                //   return { jpg: 'image/jpeg',  mp4: 'video/mp4' };
                // },
                //  mimeToExtension: (): IkeyValue => {
                //   return { 'image/jpeg': 'jpg', 'video/mp4': 'mp4'};
                // }

                // _extensionToMime: { jpg: 'image/jpeg',  mp4: 'video/mp4' },
                // _mimeToExtension: { 'image/jpeg': 'jpg', 'video/mp4': 'mp4'},
                // get extensionToMime(): IkeyValue {
                //   return this._extensionToMime;
                // },
                // get mimeToExtension(): IkeyValue {
                //   return this._mimeToExtension;
                // }
              }
            },
            {
              provide: DwImageViewerFileService, useValue: {
                downLoad: (fileSrc: File | string, type: string, imageName?: string): Observable<boolean> => {
                  return of(true);
                },
                getFileExtension: (type: string): string => '',
                getFileExtensionByName: (name: string): string | null => null,
                filenameToMimeType: (filename: string): string => ''
              }
            }
          ]
        }
      })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(DwImageViewerComponent);
        component = fixture.componentInstance;
        imageViewerService = fixture.debugElement.injector.get(DwImageViewerService);
        imageViewerFileService = fixture.debugElement.injector.get(DwImageViewerFileService);
        mimeTypeService = fixture.debugElement.injector.get(DwMimeTypeService); // TODO: #20200623
        fixture.detectChanges();
      });
  }));


  it('DwImageViewerComponent should create', () => {
    expect(component).toBeTruthy();
  });
  it('ngAfterViewInit測試.........', fakeAsync(() => {
    component.fileSrc = 'abc.jpg';
    const spyInicializarImageViewer = spyOn(imageViewerService, 'inicializarImageViewer').and.callThrough();
    const spyOnShowImage = spyOn(component, 'showImage');
    component.ngAfterViewInit();
    tick();
    expect(spyInicializarImageViewer).toHaveBeenCalled();
    expect(spyOnShowImage).toHaveBeenCalled();
  }));
  describe('DwImageViewerComponent showImage測試.........', () => {
    let spyShowViewer: jasmine.Spy;
    let spyGetImageExtensionByString: jasmine.Spy;
    let spyBlobtoDataURL: jasmine.Spy;
    let spySrvShowImage: jasmine.Spy;
    beforeEach(() => {
      spyShowViewer = spyOn(imageViewerService, 'showViewer');
      spyGetImageExtensionByString = spyOn(imageViewerService, 'getImageExtensionByString');
      spySrvShowImage = spyOn(imageViewerService, 'showImage');
      spyBlobtoDataURL = spyOn(component, 'blobtoDataURL');
    });
    it('如果!fileSrc return', () => {
      component.fileSrc = null;
      component.showImage();
      expect(spyShowViewer).not.toHaveBeenCalled();
    });
    describe('如果fileSrc instanceof Blob', () => {
      it('不是圖片檔案!imageType', () => {
        const debug = { hello: 'world' };
        component.fileSrc = new Blob([JSON.stringify(debug, null, 2)], { type: 'application/json' }) as File;
        component.showImage();
        expect(spyShowViewer).toHaveBeenCalled();
        expect(spyBlobtoDataURL).toHaveBeenCalled();
      });
    });
    describe('如果有fileSrc 判斷檔案格式優先序:type>url>name', () => {
      it('有type且為jpg|png|gif|jpeg|bmp', () => {
        // set 給值方式
        const spyType = spyOnProperty(component, 'type').and.returnValue(
          'jpg'
        );
        component.fileSrc = 'http://xxxx/anyone';
        component.name = null;
        spyGetImageExtensionByString.and.returnValues(null, null); // getImageTypeByName>null, getImageTypeByUrl>null
        component.showImage();
        expect(spyShowViewer).toHaveBeenCalled();
        expect(spyGetImageExtensionByString).toHaveBeenCalled();
        expect(spySrvShowImage).toHaveBeenCalled();
      });
      it('url有副檔名jpg|png|gif|jpeg|bmp', () => {
        // set 給值方式
        const spyType = spyOnProperty(component, 'type').and.returnValue(
          null
        );
        component.fileSrc = 'http://xxxx/anyone.jpg';
        component.name = null;
        spyGetImageExtensionByString.and.returnValues(null, 'jpg'); // getImageTypeByName>null, getImageTypeByUrl>jpg
        component.showImage();
        expect(spyShowViewer).toHaveBeenCalled();
        expect(spyGetImageExtensionByString).toHaveBeenCalled();
        expect(spySrvShowImage).toHaveBeenCalled();
        expect(spySrvShowImage.calls.argsFor(0)[0]).toEqual('http://xxxx/anyone.jpg');
      });
      it('name有副檔名jpg|png|gif|jpeg|bmp', () => {
        // set 給值方式
        const spyType = spyOnProperty(component, 'type').and.returnValue(
          null
        );
        component.fileSrc = 'http://picture/anyone';
        component.name = 'picture.jpg';
        spyGetImageExtensionByString.and.returnValues('jpg', null); // getImageTypeByName>jpg, getImageTypeByUrl>null
        component.showImage();
        expect(spyShowViewer).toHaveBeenCalled();
        expect(spyGetImageExtensionByString).toHaveBeenCalled();
        expect(spySrvShowImage).toHaveBeenCalled();
        expect(spySrvShowImage.calls.argsFor(0)[0]).toEqual('http://picture/anyone');
      });
      it('非圖檔跑_handleNotImageFile', () => {
        const spyHandleNotImageFile = spyOn(component, '_handleNotImageFile');
        // set 給值方式
        const spyType = spyOnProperty(component, 'type').and.returnValue(
          null
        );
        component.fileSrc = 'http://picture/anyone';
        component.name = '我不知道我是誰';
        spyGetImageExtensionByString.and.returnValues(null, null); // getImageTypeByName>null, getImageTypeByUrl>null
        component.showImage();
        expect(spyShowViewer).toHaveBeenCalled();
        expect(spyGetImageExtensionByString).toHaveBeenCalled();
        expect(spyHandleNotImageFile).toHaveBeenCalled();
      });
    });
    describe('_handleNotImageFile(非圖檔) 判斷檔案格式優先序type>url>name', () => {

      it('名稱有副檔名', () => {
        const spyHideViewer = spyOn(imageViewerService, 'hideViewer');
        // set 給值方式
        const spyType = spyOnProperty(component, 'type').and.returnValue(
          null
        );
        component.fileSrc = 'http://not-picture-file/anyone';
        component.name = '名稱有副檔名.pdf';
        component._handleNotImageFile(); // 執行測試
        expect(spyHideViewer).toHaveBeenCalled();
        // expect(component.nowFileExtension).toEqual('pdf'); // TODO: #20200623
      });
      it('名稱有副檔名, url也有副檔名', () => {
        const spyHideViewer = spyOn(imageViewerService, 'hideViewer');
        // set 給值方式
        const spyType = spyOnProperty(component, 'type').and.returnValue(
          null
        );
        component.fileSrc = 'http://not-picture-file/anyone.pdf';
        component.name = '名稱有副檔名.json';
        component._handleNotImageFile(); // 執行測試
        expect(spyHideViewer).toHaveBeenCalled();
        // expect(component.nowFileExtension).toEqual('pdf'); // TODO: #20200623
      });
      it('影音檔mp4|webm|ogg|ogv', () => {
        const spyHideViewer = spyOn(imageViewerService, 'hideViewer');
        // const spyextensionToMime = spyOnProperty(mimeTypeService, 'extensionToMime', 'get').and.returnValue({ mp4: 'video/mp4' });
        // const spyextensionToMime = spyOnProperty(mimeTypeService, 'extensionToMime').and.returnValue({ mp4: 'video/mp4' });
        // const spyextensionToMime = spyOn(mimeTypeService as any, 'extensionToMime').and.callFake(() => {
        //   return { mp4: 'video/mp4' };
        // });
        // (mimeTypeService as any).activePropertyChanged = { mp4: 'video/mp4' };
        // const spyMimeTypeService = spyOnAllFunctions(mimeTypeService);
        // component.nowFileExtension = 'mp4'; // TODO: #20200623
        component.fileSrc = 'http://not-picture-file/anyone.pdf';
        component.name = '名稱有副檔名.json';
        component._handleNotImageFile(); // 執行測試
        expect(spyHideViewer).toHaveBeenCalled();
        // expect(component.nowFileExtension).toEqual('mp4'); // TODO: #20200623
        // expect(spyextensionToMime).toHaveBeenCalled();
        // expect(mimeTypeService.extensionToMime).toEqual({ jpg: 'image/jpeg', mp4: 'video/mp4' }); // TODO: #20200623
        expect(component.type).toEqual('video/mp4'); // TODO: #20200623
      });

    });
  });
  describe('按鈕測試.........', () => {
    beforeEach(() => {
      spyOnProperty(component, 'type').and.returnValue(
        'jpg'
      );
      component.fileSrc = 'http://xxxx/anyone';
      component.name = 'test.jpg';
    });
    it('dwPrevious', () => {
      const spyClick = spyOn(component, 'previous');
      fixture.detectChanges();
      fixture.debugElement.nativeElement.querySelector('a[title="dwPrevious"]').click();
      expect(spyClick).toHaveBeenCalled();
    });
    it('dwNext', () => {
      const spyClick = spyOn(component, 'next');
      fixture.detectChanges();
      fixture.debugElement.nativeElement.querySelector('a[title="dwNext"]').click();
      expect(spyClick).toHaveBeenCalled();
    });
    it('dwZoomIn', () => {
      const spyClick = spyOn(component, 'zoomIn');
      fixture.detectChanges();
      fixture.debugElement.nativeElement.querySelector('a[title="dwZoomIn"]').click();
      expect(spyClick).toHaveBeenCalled();
    });
    it('dwZoomOut', () => {
      const spyClick = spyOn(component, 'zoomOut');
      fixture.detectChanges();
      fixture.debugElement.nativeElement.querySelector('a[title="dwZoomOut"]').click();
      expect(spyClick).toHaveBeenCalled();
    });
    it('dwRotateRight', () => {
      const spyClick = spyOn(component, 'rotateRight');
      fixture.detectChanges();
      fixture.debugElement.nativeElement.querySelector('a[title="dwRotateRight"]').click();
      expect(spyClick).toHaveBeenCalled();
    });
    it('dwRotateLeft', () => {
      const spyClick = spyOn(component, 'rotateLeft');
      fixture.detectChanges();
      fixture.debugElement.nativeElement.querySelector('a[title="dwRotateLeft"]').click();
      expect(spyClick).toHaveBeenCalled();
    });
    it('dwResetZoom', () => {
      const spyClick = spyOn(component, 'resetZoom');
      fixture.detectChanges();
      fixture.debugElement.nativeElement.querySelector('a[title="dwResetZoom"]').click();
      expect(spyClick).toHaveBeenCalled();
    });
    it('dwOriginalSize', () => {
      const spyClick = spyOn(component, 'originalSize');
      fixture.detectChanges();
      fixture.debugElement.nativeElement.querySelector('a[title="dwOriginalSize"]').click();
      expect(spyClick).toHaveBeenCalled();
    });
    it('dwFullScreen', () => {
      const spyClick = spyOn(component, 'fullScreen');
      fixture.detectChanges();
      fixture.debugElement.nativeElement.querySelector('a[title="dwFullScreen"]').click();
      expect(spyClick).toHaveBeenCalled();
    });
    it('dwDownload', () => {
      const spyClick = spyOn(component, 'download');
      fixture.detectChanges();
      fixture.debugElement.nativeElement.querySelector('a[title="dwDownload"]').click();
      expect(spyClick).toHaveBeenCalled();
    });
  });
  describe('按鈕function測試.........', () => {

    it('dwPrevious', fakeAsync(() => {
      const spyOnReSetInfo = spyOn(component, 'reSetInfo');
      const spyOnShowImage = spyOn(component, 'showImage');
      component.onPrevious = (): Observable<any> => {
        return of({
          fileSrc: 'http:abc/123.jpg',
          uid: '123',
          name: '',
          type: '',
        });
      };
      component.previous();
      tick();
      expect(spyOnReSetInfo.calls.argsFor(0)[0].fileSrc).toEqual('http:abc/123.jpg');
      expect(spyOnReSetInfo).toHaveBeenCalled();
      expect(spyOnShowImage).toHaveBeenCalled();
    }));
    it('dwNext', fakeAsync(() => {
      const spyOnReSetInfo = spyOn(component, 'reSetInfo');
      const spyOnShowImage = spyOn(component, 'showImage');
      component.onNext = (): Observable<any> => {
        return of({
          fileSrc: 'http:abc/123.jpg',
          uid: '123',
          name: '',
          type: '',
        });
      };
      component.next();
      tick();
      expect(spyOnReSetInfo.calls.argsFor(0)[0].fileSrc).toEqual('http:abc/123.jpg');
      expect(spyOnReSetInfo).toHaveBeenCalled();
      expect(spyOnShowImage).toHaveBeenCalled();
    }));
    it('dwZoomIn', () => {
      const spyZoomin = spyOn(imageViewerService, 'zoomIn');
      component.zoomIn();
      expect(spyZoomin).toHaveBeenCalled();
    });
    it('dwZoomOut', () => {
      const spyZoomOut = spyOn(imageViewerService, 'zoomOut');
      component.zoomOut();
      expect(spyZoomOut).toHaveBeenCalled();
    });
    it('dwRotateRight', () => {
      const spyRotateRight = spyOn(imageViewerService, 'rotateRight');
      component.rotateRight();
      expect(spyRotateRight).toHaveBeenCalled();
    });
    it('dwRotateLeft', () => {
      const spyRotateLeft = spyOn(imageViewerService, 'rotateLeft');
      component.rotateLeft();
      expect(spyRotateLeft).toHaveBeenCalled();
    });
    it('dwResetZoom', () => {
      const spyResetZoom = spyOn(imageViewerService, 'resetZoom');
      component.resetZoom();
      expect(spyResetZoom).toHaveBeenCalled();
    });
    it('dwOriginalSize', () => {
      const spyShowOriginSize = spyOn(imageViewerService, 'originalSize');
      component.originalSize();
      expect(spyShowOriginSize).toHaveBeenCalled();
    });
    it('dwFullScreen', () => {
      const spyFullScreen = spyOn(imageViewerService, 'fullScreen');
      component.fullScreen();
      expect(spyFullScreen).toHaveBeenCalled();
    });
    it('dwDownload', () => {
      const spyDownload = spyOn(imageViewerFileService, 'downLoad').and.callThrough();
      component.download();
      expect(spyDownload).toHaveBeenCalled();
    });
  });
});
