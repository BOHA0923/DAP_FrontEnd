import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { shareTestNoUiModules } from '@webdpt/framework/sharedTest';
import { setDefaultTimeoutInterval } from '@webdpt/framework/sharedTest/default_timeout.spec';
import { DebugElement, Component, ViewChild } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { DwModalRef } from 'ng-quicksilver/modal';

import { DwLoginBlockModalComponent } from './login-block-modal.component';
@Component({
  template: `<dw-login-block-modal [description]="description"></dw-login-block-modal>`
})
class TestComponent {
  @ViewChild(DwLoginBlockModalComponent, { static: true }) comp: DwLoginBlockModalComponent;
  description: string = '';
}

describe('DwLoginBlockModalComponent', () => {
  let fixture: ComponentFixture<TestComponent>;
  let component: TestComponent;
  let el: HTMLElement;
  let de: DebugElement;
  let spySanitizer: jasmine.Spy;
  let spyModalDestory: jasmine.Spy;
  setDefaultTimeoutInterval();
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DwLoginBlockModalComponent, TestComponent],
      imports: [
       ...shareTestNoUiModules
      ],
      providers: [
        {
          provide: DomSanitizer, useValue: {
            sanitize: (val: any): any => val,
            bypassSecurityTrustHtml: (val: any): any => {
              return val + '-hasSanitized'; }
          }
        },
        {
          provide: DwModalRef, useValue: {
            destroy: (val: any): void => { }
          }
        }
      ]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(TestComponent);
        component = fixture.componentInstance;
        component.description = '<div>test</div>';
        const sanitizer = fixture.debugElement.injector.get(DomSanitizer);
        const modalSubject = fixture.debugElement.injector.get(DwModalRef);
        spySanitizer = spyOn(sanitizer, 'bypassSecurityTrustHtml').and.callThrough();
        spyModalDestory = spyOn(modalSubject, 'destroy');

        el = fixture.nativeElement;
        de = fixture.debugElement;
        fixture.detectChanges();
      });
  }));

  it('DwLoginBlockModalComponent description需透過bypassSecurityTrustHtml消毒過', () => {
    expect(component).toBeTruthy();
    expect(spySanitizer).toHaveBeenCalled();
    expect(component.comp.description).toEqual('<div>test</div>-hasSanitized');
  });
  it('DwLoginBlockModalComponent.close 需透過modalSubject傳值', () => {
    component.comp.close();
    expect(spyModalDestory).toHaveBeenCalled();
    expect(spyModalDestory.calls.argsFor(0)[0]).toEqual(true);
  });
});
