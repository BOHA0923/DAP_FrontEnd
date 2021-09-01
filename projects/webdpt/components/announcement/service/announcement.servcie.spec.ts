import {fakeAsync, TestBed, tick} from '@angular/core/testing';
import {DwAnnouncementService} from './announcement.service';
import {Observable, of, throwError} from 'rxjs';
import {setDefaultTimeoutInterval} from '@webdpt/framework/sharedTest/default_timeout.spec';
import { LocalStorage } from '@webdpt/framework/storage';
import {DwAnnouncementRepository} from '../repository/announcement-repository';
import {DwAnnouncementRepositoryTest} from '../testing/announcement-repository.test';
import {DwSystemConfigService} from '@webdpt/framework/config';

describe('Service: DwAnnouncementService', () => {
  describe(`with the TestBed`, () => {
    let srv: DwAnnouncementService;
    let announcementRepository: DwAnnouncementRepository;
    let localStorage: LocalStorage;
    let systemConfigService: DwSystemConfigService;
    let spyGetConfig: jasmine.Spy;
    let spyGetActiveAnnouncement: jasmine.Spy;
    let spyGetIgnoreList: jasmine.Spy;
    let spyGetLocalStorage: jasmine.Spy;
    let spySetLocalStorage: jasmine.Spy;
    const mockData: any = {
      data: [{
        id: '2020020045',
        pageId: 65,
        subject: '公告藍色',
        createDate: '2020/02/15 09:35:57',
        startDate: '2020/02/15 09:35:28',
        endDate: '2020/03/26 09:35:34',
        description: 'description-test'
      }]
    };

    setDefaultTimeoutInterval();
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          DwAnnouncementService,
          {
            provide: DwSystemConfigService, useValue: {
              get: (key: any): Observable<any> => {
                return of('');
              }
            }
          },
          {
            provide: LocalStorage, useValue: {
              get: (name: any): any => null,
              set: (name: any, ignores: string): void => {

              }
            }
          },
          {
            provide: DwAnnouncementRepository, useClass: DwAnnouncementRepositoryTest
          }
        ]
      });
      srv = TestBed.get(DwAnnouncementService);
      localStorage = TestBed.get(LocalStorage);
      systemConfigService = TestBed.get(DwSystemConfigService);
      announcementRepository = TestBed.get(DwAnnouncementRepository);
    });


    it('#getAnnouncement multiTenant為true,getIgnoreList比對不符,應該返回有效公告資料 (fakeAsync)', fakeAsync((done: DoneFn) => {
      spyGetConfig = spyOn(systemConfigService, 'get').and.returnValue(of(true));
      spyGetActiveAnnouncement = spyOn(announcementRepository, 'getActiveAnnouncement').and.callThrough();
      spyGetIgnoreList = spyOn(srv, 'getIgnoreList').and.returnValue([]);
      srv.getAnnouncement('release').subscribe(res => {
        expect(res).not.toBeNull();
        expect(res.id).toEqual('2020020045');
      });
      tick();
      expect(spyGetIgnoreList).toHaveBeenCalled();
      expect(spyGetActiveAnnouncement.calls.allArgs()).toEqual([['release']]);
      expect(spyGetActiveAnnouncement).toHaveBeenCalled();
      expect(spyGetConfig.calls.allArgs()).toEqual([['multiTenant']]);
      expect(spyGetConfig).toHaveBeenCalled();
    }));
    it('#getAnnouncement multiTenant為true,但getIgnoreList比對相符,應該返回null (fakeAsync)', fakeAsync((done: DoneFn) => {
      spyGetConfig = spyOn(systemConfigService, 'get').and.returnValue(of(true));
      spyGetActiveAnnouncement = spyOn(announcementRepository, 'getActiveAnnouncement').and.callThrough();
      spyGetIgnoreList = spyOn(srv, 'getIgnoreList').and.returnValue([{
        'displayId': 'release',
        'id': '2020020045',
        'expires': '2020/02/28'
      }]);
      srv.getAnnouncement('release').subscribe(res => {
        expect(res).toBeNull();
      });
      tick();
      expect(spyGetConfig.calls.allArgs()).toEqual([['multiTenant']]);
      expect(spyGetConfig).toHaveBeenCalled();
      expect(spyGetActiveAnnouncement).toHaveBeenCalled();
      expect(spyGetIgnoreList).toHaveBeenCalled();
    }));
    it('#getAnnouncement multiTenant為false,應該返回null (fakeAsync)', fakeAsync((done: DoneFn) => {
      spyGetConfig = spyOn(systemConfigService, 'get').and.returnValue(of(false));
      spyGetActiveAnnouncement = spyOn(announcementRepository, 'getActiveAnnouncement').and.callThrough();
      spyGetIgnoreList = spyOn(srv, 'getIgnoreList').and.returnValue([]);
      srv.getAnnouncement('release').subscribe(res => {
        expect(res).toBeNull();
      });
      tick();
      expect(spyGetConfig.calls.allArgs()).toEqual([['multiTenant']]);
      expect(spyGetConfig).toHaveBeenCalled();
      expect(spyGetActiveAnnouncement).not.toHaveBeenCalled();
      expect(spyGetIgnoreList).not.toHaveBeenCalled();
    }));
    it('#getAnnouncement systemConfigService取值error,應該返回null (fakeAsync)', fakeAsync((done: DoneFn) => {
      spyGetConfig = spyOn(systemConfigService, 'get').and.returnValue(throwError({ status: 404 }));
      spyGetActiveAnnouncement = spyOn(announcementRepository, 'getActiveAnnouncement').and.callThrough();
      spyGetIgnoreList = spyOn(srv, 'getIgnoreList').and.returnValue([]);
      srv.getAnnouncement('release').subscribe(res => {
        expect(res).toBeNull();
      });
      tick();
      expect(spyGetConfig.calls.allArgs()).toEqual([['multiTenant']]);
      expect(spyGetConfig).toHaveBeenCalled();
      expect(spyGetActiveAnnouncement).not.toHaveBeenCalled();
      expect(spyGetIgnoreList).not.toHaveBeenCalled();
    }));

    it('#getIgnoreList 返回值應該為Array', () => {
      spyGetLocalStorage = spyOn(localStorage, 'get').and.returnValue(JSON.stringify([{
        'displayId': 'release',
        'id': '2020020045',
        'expires': '2020/02/28'
      }]));
      const returnVal = srv.getIgnoreList();
      expect(returnVal.length).toBe(1);
      expect(returnVal[0].id).toEqual('2020020045');
      expect(spyGetLocalStorage).toHaveBeenCalled();
      expect(spyGetLocalStorage.calls.allArgs()).toEqual([['dwAnnouncementIgnore']]);
    });
    it('#getIgnoreList localstorage為null返回值應該為[]', () => {
      spyGetLocalStorage = spyOn(localStorage, 'get').and.returnValue(null);
      const returnVal = srv.getIgnoreList();
      expect(returnVal.length).toBe(0);
      expect(spyGetLocalStorage).toHaveBeenCalled();
      expect(spyGetLocalStorage.calls.allArgs()).toEqual([['dwAnnouncementIgnore']]);
    });
    it('#setIgnore 新增不顯示公告資料', () => {
      spyGetIgnoreList = spyOn(srv, 'getIgnoreList').and.returnValue([{
        'displayId': 'release',
        'id': '2020020045',
        'expires': '2100/02/28'
      }]);
      spySetLocalStorage = spyOn(localStorage, 'set');
      srv.setIgnore({
        'displayId': 'index',
        'id': '12345678',
        'expires': '2100/02/28'
      });
      expect(spyGetIgnoreList).toHaveBeenCalled();
      expect(spySetLocalStorage).toHaveBeenCalled();
      expect(JSON.parse(spySetLocalStorage.calls.argsFor(0)[1]).length).toEqual(2);
    });
    it('#setIgnore displayId存在要覆蓋原有資料', () => {
      spyGetIgnoreList = spyOn(srv, 'getIgnoreList').and.returnValue([{
        'displayId': 'release',
        'id': '2020020045',
        'expires': '2100/02/28'
      }]);
      spySetLocalStorage = spyOn(localStorage, 'set');
      srv.setIgnore({
        'displayId': 'release',
        'id': '12345678',
        'expires': '2100/02/28'
      });
      expect(spyGetIgnoreList).toHaveBeenCalled();
      expect(spySetLocalStorage).toHaveBeenCalled();
      expect(JSON.parse(spySetLocalStorage.calls.argsFor(0)[1])[0].id).toEqual('12345678');
      // console.log(spySetLocalStorage.calls.allArgs());
    });
    it('#setIgnore 要刪除過期資料', () => {
      spyGetIgnoreList = spyOn(srv, 'getIgnoreList').and.returnValue([{
        'displayId': 'release1',
        'id': '2020020045',
        'expires': '2010/02/28'
      }]);
      spySetLocalStorage = spyOn(localStorage, 'set');
      srv.setIgnore({
        'displayId': 'release',
        'id': '12345678',
        'expires': '2100/02/28'
      });
      expect(spyGetIgnoreList).toHaveBeenCalled();
      expect(spySetLocalStorage).toHaveBeenCalled();
      expect(JSON.parse(spySetLocalStorage.calls.argsFor(0)[1]).findIndex(d => d.displayId === 'release1')).toEqual(-1);
      // console.log(JSON.parse(spySetLocalStorage.calls.argsFor(0)[1]));
    });
  });
});
