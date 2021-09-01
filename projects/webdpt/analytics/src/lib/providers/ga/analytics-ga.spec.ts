import { fakeAsync, inject, ComponentFixture, TestBed } from '@angular/core/testing';

import { advance, createRoot, RootCmp, TestModule } from '../../test.mocks';

import { DwAnalytics } from '../../core/analytics';
import { DwAnalyticsGoogleAnalytics } from './analytics-ga';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 5000;
declare var window: any;

describe('DwAnalyticsGoogleAnalytics', () => {
  let ga: any;
  let _gaq: Array<any>;
  let fixture: ComponentFixture<any>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestModule],
      providers: [
        DwAnalyticsGoogleAnalytics
      ]
    });
    window.ga = ga = jasmine.createSpy('ga');
    window._gaq = _gaq = [];
  });

  it('should track pages',
    fakeAsync(inject([DwAnalytics, DwAnalyticsGoogleAnalytics],
      (dwAnalytics: DwAnalytics, dwAnalyticsGoogleAnalytics: DwAnalyticsGoogleAnalytics) => {
        fixture = createRoot(RootCmp);
        dwAnalytics.pageTrack.next({ path: '/abc' });
        advance(fixture);
        expect(ga).toHaveBeenCalledWith('send', 'pageview', '/abc');
      }),
    ),
  );

  it('should track events',
    fakeAsync(inject([DwAnalytics, DwAnalyticsGoogleAnalytics],
      (dwAnalytics: DwAnalytics, dwAnalyticsGoogleAnalytics: DwAnalyticsGoogleAnalytics) => {
        fixture = createRoot(RootCmp);
        dwAnalytics.settings.ga.additionalAccountNames.push('additionalAccountName');
        dwAnalytics.eventTrack.next({ action: 'do', properties: { category: 'cat' } });
        advance(fixture);
        expect(ga).toHaveBeenCalledWith('send', 'event', {
          eventCategory: 'cat',
          eventAction: 'do',
          eventLabel: undefined,
          eventValue: undefined,
          nonInteraction: undefined,
          page: '/',
          userId: null,
          hitCallback: undefined,
        });
        expect(ga).toHaveBeenCalledWith(
          'additionalAccountName.send',
          'event',
          {
            eventCategory: 'cat',
            eventAction: 'do',
            eventLabel: undefined,
            eventValue: undefined,
            nonInteraction: undefined,
            page: '/',
            userId: null,
            hitCallback: undefined,
          },
        );
      },
    )),
  );

  it('should track events with hitCallback',
    fakeAsync(inject([DwAnalytics, DwAnalyticsGoogleAnalytics],
      (dwAnalytics: DwAnalytics, dwAnalyticsGoogleAnalytics: DwAnalyticsGoogleAnalytics) => {
        dwAnalytics.settings.ga.additionalAccountNames.push('additionalAccountName');

        fixture = createRoot(RootCmp);
        const callback = function() { };
        dwAnalytics.eventTrack.next({ action: 'do', properties: { category: 'cat', hitCallback: callback } });
        advance(fixture);
        expect(ga).toHaveBeenCalledWith('send', 'event', {
          eventCategory: 'cat',
          eventAction: 'do',
          eventLabel: undefined,
          eventValue: undefined,
          nonInteraction: undefined,
          page: '/',
          userId: null,
          hitCallback: callback,
        });
        expect(ga).toHaveBeenCalledWith(
          'additionalAccountName.send',
          'event',
          {
            eventCategory: 'cat',
            eventAction: 'do',
            eventLabel: undefined,
            eventValue: undefined,
            nonInteraction: undefined,
            page: '/',
            userId: null,
            hitCallback: callback,
          },
        );
      }
    ))
  );

  it('should track exceptions',
    fakeAsync(inject([DwAnalytics, DwAnalyticsGoogleAnalytics],
        (dwAnalytics: DwAnalytics, dwAnalyticsGoogleAnalytics: DwAnalyticsGoogleAnalytics) => {
          dwAnalytics.settings.ga.additionalAccountNames.push('additionalAccountName');

          fixture = createRoot(RootCmp);
          dwAnalytics.exceptionTrack.next({ fatal: true, description: 'test' });
          advance(fixture);
          expect(ga).toHaveBeenCalledWith('send', 'exception', { exFatal: true, exDescription: 'test' });
          expect(ga).toHaveBeenCalledWith('additionalAccountName.send', 'exception', { exFatal: true, exDescription: 'test' });
      })));

  it('should set username',
    fakeAsync(inject([DwAnalytics, DwAnalyticsGoogleAnalytics],
        (dwAnalytics: DwAnalytics, dwAnalyticsGoogleAnalytics: DwAnalyticsGoogleAnalytics) => {
          fixture = createRoot(RootCmp);
          dwAnalytics.setUserId.next('testuser');
          advance(fixture);
          expect(dwAnalytics.settings.ga.userId).toBe('testuser');
      }),
    ),
  );

  it('should set user properties',
    fakeAsync(inject([DwAnalytics, DwAnalyticsGoogleAnalytics],
      (dwAnalytics: DwAnalytics, dwAnalyticsGoogleAnalytics: DwAnalyticsGoogleAnalytics) => {
        fixture = createRoot(RootCmp);
        dwAnalytics.setUserProperties.next({ dimension1: 'test' });
        advance(fixture);
        expect(ga).toHaveBeenCalledWith('set', 'dimension1', 'test');
        dwAnalytics.setUserProperties.next({ metric1: 'test' });
        advance(fixture);
        expect(ga).toHaveBeenCalledWith('set', 'metric1', 'test');
      }),
    ),
  );

    it('should set user properties on all account names',
      fakeAsync(inject([DwAnalytics, DwAnalyticsGoogleAnalytics],
        (dwAnalytics: DwAnalytics, dwAnalyticsGoogleAnalytics: DwAnalyticsGoogleAnalytics) => {
          fixture = createRoot(RootCmp);
          dwAnalytics.settings.ga.additionalAccountNames.push('additionalAccountName');
          dwAnalytics.settings.ga.additionalAccountNames.push('additionalAccountNameTwo');
          dwAnalytics.setUserProperties.next({ dimension1: 'test' });
          advance(fixture);
          expect(ga).toHaveBeenCalledWith('set', 'dimension1', 'test');
          expect(ga).toHaveBeenCalledWith('additionalAccountName.set', 'dimension1', 'test');
          expect(ga).toHaveBeenCalledWith('additionalAccountNameTwo.set', 'dimension1', 'test');
          dwAnalytics.setUserProperties.next({ metric1: 'test' });
          advance(fixture);
          expect(ga).toHaveBeenCalledWith('set', 'metric1', 'test');
          expect(ga).toHaveBeenCalledWith('additionalAccountName.set', 'metric1', 'test');
          expect(ga).toHaveBeenCalledWith('additionalAccountNameTwo.set', 'metric1', 'test');
        }),
      ),
    );

  it('should track user timings',
    fakeAsync(inject([DwAnalytics, DwAnalyticsGoogleAnalytics],
      (dwAnalytics: DwAnalytics, dwAnalyticsGoogleAnalytics: DwAnalyticsGoogleAnalytics) => {
        fixture = createRoot(RootCmp);
        dwAnalytics.settings.ga.additionalAccountNames.push('additionalAccountName');
        dwAnalytics.userTimings.next({ timingCategory: 'cat', timingVar: 'var', timingValue: 100 });
        advance(fixture);
        expect(ga).toHaveBeenCalledWith('send', 'timing', { timingCategory: 'cat', timingVar: 'var', timingValue: 100 });
        expect(ga).toHaveBeenCalledWith(
          'additionalAccountName.send',
          'timing',
          {
            timingCategory: 'cat',
            timingVar: 'var',
            timingValue: 100,
          },
        );
      },
    )),
  );

});
