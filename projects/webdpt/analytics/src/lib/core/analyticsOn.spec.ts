import { CommonModule, Location } from '@angular/common';
import { SpyLocation } from '@angular/common/testing';
import { Component, Directive, Injectable } from '@angular/core';
import { fakeAsync, inject, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { advance, createRoot } from '../test.mocks';
import { DwAnalytics } from './analytics';
import { DwAnalyticsModule } from './analytics.module';
import { DwAnalyticsOn } from './analyticsOn';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 5000;

@Injectable()
export class DummyProvider {
  // tslint:disable-next-line:no-unused-variable
  constructor(private dwAnalytics: DwAnalytics) {}
}

@Component({
  selector: 'root-comp',
  template: `
    <a dwAnalyticsOn="click"
      angularticsAction="InitiateSearch">
    </a>
  `,
})
class RootCmp {
  name: string;
}

@Component({
  selector: 'root-comp',
  template: `
    <button (click)="triggerEvent($event)">Greet</button>
    <a dwAnalyticsOn
      (customEvent)="eventTrack($event)"
      angularticsAction="InitiateSearch">
    </a>
  `,
})
class RootCmp1 {
  name: string;
}

@Component({
  selector: 'root-comp',
  template: `
    <div
      [dwAnalyticsOn]="'click'"
      angularticsAction="InitiateSearch"
      angularticsLabel="custom-label"
      angularticsValue="custom-value"
      [angularticsCategory]="angularticsCategory">
    </div>
  `,
})
class RootCmp2 {
  name: string;
  angularticsCategory = 'Search';
}

@Component({
  selector: 'root-comp',
  template: `
    <a dwAnalyticsOn="click" angularticsCategory="Search">
      InitiateSearch
    </a>
  `,
})
class RootCmp3 {
  name: string;
}

describe('dwAnalyticsOn', () => {
  let fixture: ComponentFixture<any>;
  let compiled: any;
  let EventSpy: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        RouterTestingModule,
        DwAnalyticsModule.forRoot([DummyProvider]),
      ],
      declarations: [RootCmp, RootCmp1, RootCmp2, RootCmp3],
      providers: [{ provide: Location, useClass: SpyLocation }],
    });

    EventSpy = jasmine.createSpy('EventSpy');
  });

  it('should subscribe to element events',
    fakeAsync(
      inject([DwAnalytics], (dwAnalytics: DwAnalytics) => {
        fixture = createRoot(RootCmp);
        expect(EventSpy).not.toHaveBeenCalled();
        dwAnalytics.eventTrack.subscribe((x) => EventSpy(x));
        compiled = fixture.debugElement.nativeElement.children[0];
        compiled.click();
        advance(fixture);
        expect(EventSpy).toHaveBeenCalledWith({
          action: 'InitiateSearch',
          properties: { eventType: 'click' },
        });
      }),
    ),
  );

  // WIP: trying to implement a way to subscribe to custom event types
  xit('should subscribe to custom eventemiter',
    fakeAsync(
      inject([DwAnalytics], (dwAnalytics: DwAnalytics) => {
        fixture = createRoot(RootCmp1);
        expect(EventSpy).not.toHaveBeenCalled();
        dwAnalytics.eventTrack.subscribe((x) => EventSpy(x));
        compiled = fixture.debugElement.nativeElement.children[0];
        compiled.click();
        advance(fixture);
        expect(EventSpy).toHaveBeenCalledWith({
          action: 'InitiateSearch',
          properties: { eventType: undefined },
        });
      }),
    ),
  );

  it('should not send on and event fields to the eventTrack function',
    fakeAsync(
      inject([DwAnalytics], (dwAnalytics: DwAnalytics) => {
        fixture = createRoot(RootCmp2);
        expect(EventSpy).not.toHaveBeenCalled();
        dwAnalytics.eventTrack.subscribe((x) => EventSpy(x));
        compiled = fixture.debugElement.nativeElement.children[0];
        compiled.click();
        advance(fixture);
        expect(EventSpy).toHaveBeenCalledWith({
          action: 'InitiateSearch',
          properties: {
            category: 'Search',
            eventType: 'click',
            label: 'custom-label',
            value: 'custom-value',
          },
        });
      }),
    ),
  );

  // Need refactor or maybe just remove functionality as it might break in other platforms other than web browsers.
  xit('should infer event',
    fakeAsync(
      inject([DwAnalytics], (dwAnalytics: DwAnalytics) => {
        fixture = createRoot(RootCmp3);
        expect(EventSpy).not.toHaveBeenCalled();
        dwAnalytics.eventTrack.subscribe((x) => EventSpy(x));
        compiled = fixture.debugElement.nativeElement.children[0];
        compiled.click();
        advance(fixture);
        expect(EventSpy).toHaveBeenCalledWith({
          action: 'InitiateSearch',
          properties: { category: 'Search', eventType: 'click' },
        });
      }),
    ),
  );

  describe('running on server', () => {
    @Injectable()
    @Directive({
      selector: '[dwAnalyticsOn]',
    })
    class NgxAnalyticsOnStub extends DwAnalyticsOn {
      isBrowser() {
        return false;
      }
    }

    beforeEach(() => {
      TestBed.overrideModule(DwAnalyticsModule, {
        set: {
          declarations: [NgxAnalyticsOnStub],
          exports: [NgxAnalyticsOnStub],
        },
      });
    });
  });
});
