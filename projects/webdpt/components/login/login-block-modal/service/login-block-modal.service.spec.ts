import { TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { setDefaultTimeoutInterval } from '@webdpt/framework/sharedTest/default_timeout.spec';
import { DwLoginBlockModalService } from './login-block-modal.service';
import { DwModalRef } from 'ng-quicksilver/modal';
import { DwModalService } from 'ng-quicksilver/modal';
import { Observable, of } from 'rxjs';

describe('DwLoginBlockModalService', () => {
  let srv: DwLoginBlockModalService;
  let modalService: DwModalService;
  let spyCreateModal: jasmine.Spy;
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
  setDefaultTimeoutInterval();
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DwLoginBlockModalService,
        {
          provide: DwModalService, useValue: {
            create: (params: any): any => {
              return {
                afterClose: of(true)
              };
            }
          }
        }
      ]
    });
    srv = TestBed.get(DwLoginBlockModalService);
    modalService = TestBed.get(DwModalService);
  });

  it('DwLoginBlockModalService should be created', () => {
    expect(srv).toBeTruthy();
  });
  it('#showWarning afterClose返回true (fakeAsync)', fakeAsync((done: DoneFn) => {
    spyCreateModal = spyOn(modalService, 'create').and.callThrough(); // 模擬按下按鈕
    const subsc = srv.showWarning({
      description: 'this is description',
      btnTitle: '了解'
    }).subscribe(res => {
      expect(res).not.toBeNull();
      expect(res).toBe(true);
    });
    tick();
    expect(subsc.closed).toBeTruthy(); // 訂閱已關閉
    expect(spyCreateModal.calls.argsFor(0)[0].dwComponentParams.description).toEqual('this is description');
    expect(spyCreateModal.calls.argsFor(0)[0].dwComponentParams.btnTitle).toEqual('了解');
    expect(spyCreateModal).toHaveBeenCalled();
  }));
  it('#showWarning afterClose返回null (fakeAsync)', fakeAsync((done: DoneFn) => {
    dwModalRef.afterClose = of(null);
    spyCreateModal = spyOn(modalService, 'create').and.
      returnValue(dwModalRef);
    const subsc = srv.showWarning({
      description: 'this is description',
      btnTitle: '了解'
    }).subscribe(res => {
      console.log('有顯示這個conosle表示測試錯誤');
      expect(1).toEqual(2); // 不應該跑這裏
    },
      err => { },
      () => { console.log('completed'); }
    );
    tick();
    expect(subsc.closed).toBeTruthy(); // 訂閱已關閉
    expect(spyCreateModal.calls.argsFor(0)[0].dwComponentParams.description).toEqual('this is description');
    expect(spyCreateModal.calls.argsFor(0)[0].dwComponentParams.btnTitle).toEqual('了解');
    expect(spyCreateModal).toHaveBeenCalled();
  }));
});
