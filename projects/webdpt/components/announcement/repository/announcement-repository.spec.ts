import { TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
// import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { DwAnnouncementRepository } from './announcement-repository';
import { Observable, of } from 'rxjs';
import { setDefaultTimeoutInterval } from '@webdpt/framework/sharedTest/default_timeout.spec';
import { DwOmHttpClient } from '@webdpt/framework/om';
import { DwOmHttpClientTest } from '@webdpt/framework/om/om-http-client.test';
import { DW_APP_ID } from '@webdpt/framework/config';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';


describe('Service: DwAnnouncementRepository', () => {
  describe(`with the TestBed`, () => {
    let srv: DwAnnouncementRepository;
    let httpMocker: HttpTestingController;
    let httpMock: DwOmHttpClient;
    let spyOmHttpClient: jasmine.Spy;
    setDefaultTimeoutInterval();
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [
          DwAnnouncementRepository,
          { provide: DW_APP_ID, useValue: 'sampleApp1' },
          {
            provide: DwOmHttpClient, useClass: DwOmHttpClientTest
          }
        ]
      });
      srv = TestBed.get(DwAnnouncementRepository);
      httpMock = TestBed.get(DwOmHttpClient);
      httpMocker = TestBed.get(HttpTestingController);
    });
    afterEach(() => {
      // After every test, assert that there are no more pending requests.
       httpMocker.verify();
    });

    it('DwAnnouncementRepository.getActiveAnnouncement呼叫>>驗證服數url及帶入appId (spy fakeAsync)', fakeAsync((done: DoneFn) => {
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
      spyOmHttpClient = spyOn(httpMock, 'get').and.
        returnValue(of(mockData));
      srv.getActiveAnnouncement('release').subscribe(res => {
        expect(res.data.length).toBe(1);
        expect(res.data[0].id).toEqual('2020020045');
      });
      tick();
      expect(spyOmHttpClient).toHaveBeenCalled();
      expect(spyOmHttpClient.calls.argsFor(0)[0]).toEqual('restful/service/DWSysManagement/Announcement/ActiveAnnouncement');
      expect(spyOmHttpClient.calls.argsFor(0)[1].params.goodsCode).toEqual('sampleApp1');
    }));

    it('DwAnnouncementRepository.getActiveAnnouncement呼叫>>驗證服數url及帶入appId (HttpTestingController)', () => {
      const mockData: any = {
        data: [{
          id: '20200200456',
          pageId: 65,
          subject: '公告藍色',
          createDate: '2020/02/15 09:35:57',
          startDate: '2020/02/15 09:35:28',
          endDate: '2020/03/26 09:35:34',
          description: 'description-test'
        }]
      };
      // srv.testabc();
      srv.getActiveAnnouncement('release').subscribe(res => {
        expect(res.data.length).toBe(1);
        expect(res.data[0].id).toEqual('20200200456');
      });
      const request = httpMocker.expectOne('restful/service/DWSysManagement/Announcement/ActiveAnnouncement?goodsCode=sampleApp1&displayId=release');
      expect(request.request.method).toBe('GET');
      request.flush(mockData);
      // const request1 = httpMocker.expectOne('restful/service/DWSysManagement/Announcement/abc');
      // request1.flush(mockData);
    });
    it('DwAnnouncementRepository.getActiveAnnouncement呼叫>>驗證error (HttpTestingController error)', () => {

      let errResponse: any;
      const mockErrorResponse = { status: 400, statusText: 'Bad Request' };
      const error = 'Mock Invalid request parameters';
      srv.getActiveAnnouncement('release').subscribe(res => {
        console.log(res.data[0].id);
      }, err => {
        console.log(err);
        errResponse = err;
      });
      const request = httpMocker.expectOne('restful/service/DWSysManagement/Announcement/ActiveAnnouncement?goodsCode=sampleApp1&displayId=release');
      expect(request.request.method).toBe('GET');
      request.flush(error, mockErrorResponse);
      expect(errResponse.error).toBe(error);
    });

    // it('DwAnnouncementRepository.testabc>>驗證服數url及帶入appId (HttpTestingController)', () => {
    //   const mockData: any = {
    //     data: [{
    //       id: '999999',
    //       pageId: 65,
    //       subject: '公告藍色',
    //       createDate: '2020/02/15 09:35:57',
    //       startDate: '2020/02/15 09:35:28',
    //       endDate: '2020/03/26 09:35:34',
    //       description: 'description-test'
    //     }]
    //   };
    //   srv.testabc();
    //   const request = httpMocker.expectOne('restful/service/DWSysManagement/Announcement/ActiveAnnouncement');
    //   expect(request.request.method).toBe('GET');
    //   request.flush(mockData);
    //   expect(srv.res.data[0].id).toEqual('999999');
    // });
    // it('DwAnnouncementRepository.testabc>>驗證error (HttpTestingController error)', () => {
    //   const mockErrorResponse = { status: 400, statusText: 'Bad Request' };
    //   const error = 'Mock Invalid request parameters';
    //   srv.testabc();
    //   console.log(srv.err);
    //   const request = httpMocker.expectOne('restful/service/DWSysManagement/Announcement/ActiveAnnouncement');
    //   expect(request.request.method).toBe('GET');
    //   request.flush(error, mockErrorResponse);
    //   console.log(srv.err);
    //   expect(srv.err.error).toBe(error);
    // });
  });
});
