import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DwAnnouncementModalComponent } from './announcement-modal.component';
import { DebugElement, Component, ViewChild } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { DwModalRef } from 'ng-quicksilver/modal';
import { Observable, of } from 'rxjs';
import { setDefaultTimeoutInterval } from '@webdpt/framework/sharedTest/default_timeout.spec';
import { shareTestModules } from '@webdpt/framework/sharedTest/shareTestModule';
import {} from 'jasmine';

@Component({
  template: `<dw-announcement-modal [description]="description"></dw-announcement-modal>`
})
class TestComponent {
  @ViewChild(DwAnnouncementModalComponent, { static: true }) comp: DwAnnouncementModalComponent;
  description: string = '';
}
describe('DwAnnouncementModalComponent', () => {
  let fixture: ComponentFixture<TestComponent>;
  let component: TestComponent;
  let el: HTMLElement;
  let de: DebugElement;
  let spySanitizer: jasmine.Spy;
  let spyModalDestory: jasmine.Spy;
  // let component: DwAnnouncementModalComponent;
  // let fixture: ComponentFixture<DwAnnouncementModalComponent>;
  setDefaultTimeoutInterval();
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DwAnnouncementModalComponent, TestComponent],
      imports: [
        ...shareTestModules
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

  it('DwAnnouncementModalComponent description需透過bypassSecurityTrustHtml消毒過', () => {
    expect(component).toBeTruthy();
    expect(spySanitizer).toHaveBeenCalled();
    expect(component.comp.description).toEqual('<div>test</div>-hasSanitized');
  });
  it('DwAnnouncementModalComponent.close 需透過modalSubject傳值', () => {
    component.comp.close();
    expect(spyModalDestory).toHaveBeenCalled();
    expect(spyModalDestory.calls.argsFor(0)[0]).toEqual(component.comp.isIgnore);
  });
});
