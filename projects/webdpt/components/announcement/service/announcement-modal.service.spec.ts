import { TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { DwAnnouncementModalService } from './announcement-modal.service';
import { DwModalService } from 'ng-quicksilver/modal';
import { DwModalRef } from 'ng-quicksilver/modal';
import { DwAnnouncementService } from './announcement.service';
import { Observable, of } from 'rxjs';
import { setDefaultTimeoutInterval } from '@webdpt/framework/sharedTest/default_timeout.spec';
import { DwAnnouncementServiceTest } from '../testing';


describe('Service: DwAnnouncementModalService', () => {
  describe(`with the TestBed`, () => {
    let srv: DwAnnouncementModalService;
    let modalService: DwModalService;
    let announcementService: DwAnnouncementService;
    let spyGetAnnouncement: jasmine.Spy;
    let spyCreate: jasmine.Spy;
    const dwModalRef: DwModalRef = {
      afterOpen: of(null),
      afterClose: of(true),
      open: (): any => { },
      close: (): any => { },
      destroy: (): any => { },
      triggerOk: (): any => { },
      triggerCancel: (): any => { },
      getContentComponent: (): any => { },
      getElement: (): any => { },
      getInstance: (): any => { }
    };
    // const mockData: any = {
    //   id: '2020020045',
    //   pageId: 65,
    //   subject: '公告藍色',
    //   createDate: '2020/02/15 09:35:57',
    //   startDate: '2020/02/15 09:35:28',
    //   endDate: '2020/03/26 09:35:34',
    //   description: 'description-test'
    // };
    setDefaultTimeoutInterval();
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          DwAnnouncementModalService,
          {
            provide: DwModalService, useValue: {
              create: (announcement: any): any => dwModalRef
            }
          },
          {
            provide: DwAnnouncementService, useClass: DwAnnouncementServiceTest
          }
        ]
      });
      srv = TestBed.get(DwAnnouncementModalService);
      modalService = TestBed.get(DwModalService);
      announcementService = TestBed.get(DwAnnouncementService);
    });


    it('#displayAnnouncement 有公告應該返回true, 開啟公告要觸發,setIgnore要觸發 (fakeAsync)', fakeAsync((done: DoneFn) => {
      spyGetAnnouncement = spyOn(announcementService, 'getAnnouncement').and.callThrough();
      dwModalRef.afterClose = of(true);
      spyCreate = spyOn(modalService, 'create').and.
        returnValue(dwModalRef);
      spyOn(announcementService, 'setIgnore');
      srv.displayAnnouncement('release').subscribe(res => {
        expect(res).not.toBeNull();
        expect(res).toBe(true);
      });
      tick();
      expect(spyGetAnnouncement.calls.allArgs()).toEqual([['release']]);
      expect(spyGetAnnouncement).toHaveBeenCalled();
      expect(spyCreate.calls.argsFor(0)[0].dwComponentParams.description).toEqual('description-test');
      expect(spyCreate).toHaveBeenCalled();
      expect(announcementService.setIgnore).toHaveBeenCalled();
    }));
    it('#displayAnnouncement 有公告應該返回true, 開啟公告要觸發,setIgnore不要觸發 (fakeAsync)', fakeAsync((done: DoneFn) => {
      spyGetAnnouncement = spyOn(announcementService, 'getAnnouncement').and.callThrough();
      dwModalRef.afterClose = of(false);
      spyCreate = spyOn(modalService, 'create').and.
        returnValue(dwModalRef);
      spyOn(announcementService, 'setIgnore');
      srv.displayAnnouncement('release').subscribe(res => {
        expect(res).not.toBeNull();
        expect(res).toBe(true);
      });
      tick();
      expect(spyGetAnnouncement.calls.allArgs()).toEqual([['release']]);
      expect(spyGetAnnouncement).toHaveBeenCalled();
      expect(spyCreate.calls.argsFor(0)[0].dwComponentParams.description).toEqual('description-test');
      expect(spyCreate).toHaveBeenCalled();
      expect(announcementService.setIgnore).not.toHaveBeenCalled();
    }));
    it('#displayAnnouncement 沒有公告應該返回true, 開啟公告不觸發,setIgnore不觸發 (fakeAsync)', fakeAsync((done: DoneFn) => {
      spyGetAnnouncement = spyOn(announcementService, 'getAnnouncement').and.
        returnValue(of(null)); // 假設沒有公告資料
      dwModalRef.afterClose = of(true);
      spyCreate = spyOn(modalService, 'create').and.
        returnValue(dwModalRef);
      spyOn(announcementService, 'setIgnore');
      srv.displayAnnouncement('release').subscribe(res => {
        expect(res).not.toBeNull();
        expect(res).toBe(true);
      });
      tick();
      expect(spyGetAnnouncement.calls.allArgs()).toEqual([['release']]);
      expect(spyGetAnnouncement).toHaveBeenCalled();
      expect(spyCreate).not.toHaveBeenCalled();
      expect(announcementService.setIgnore).not.toHaveBeenCalled();
    }));
  });
});
