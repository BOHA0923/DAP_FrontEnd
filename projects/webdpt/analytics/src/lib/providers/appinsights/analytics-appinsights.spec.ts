import { fakeAsync, inject, ComponentFixture, TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';

import { DwAnalytics } from '../../core/analytics';
import { advance, createRoot, RootCmp, TestModule } from '../../test.mocks';
import { DwAnalyticsAppInsights } from './analytics-appinsights';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 5000;
declare let window: any;

describe('DwAnalyticsAppInsights', () => {
  let appInsights: Microsoft.ApplicationInsights.IAppInsights;
  let fixture: ComponentFixture<any>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TestModule,
        RouterTestingModule,
      ],
      providers: [
        Title,
        DwAnalyticsAppInsights,
      ],
    });

    window.appInsights = appInsights = jasmine.createSpyObj(
      'appInsights', [
        'trackPageView',
        'trackEvent',
        'trackException',
        'setAuthenticatedUserContext',
      ]);
    });

  it('should track pages',
    fakeAsync(inject([DwAnalytics, DwAnalyticsAppInsights, Title],
      (dwAnalytics: DwAnalytics, dwAnalyticsAppInsights: DwAnalyticsAppInsights, title: Title) => {
        fixture = createRoot(RootCmp);
        const metrics = {};
        const dimensions = {};
        const loadTime = 123;
        spyOn(title, 'getTitle').and.returnValue('the title');
        dwAnalyticsAppInsights.metrics = metrics;
        dwAnalyticsAppInsights.dimensions = dimensions;
        dwAnalyticsAppInsights.loadTime = loadTime;
        dwAnalytics.pageTrack.next({ path: '/abc' });
        advance(fixture);
        expect(appInsights.trackPageView).toHaveBeenCalledWith('the title', '/abc', metrics, dimensions, loadTime);
      }),
    ),
  );

  it('should track events',
    fakeAsync(inject([DwAnalytics, DwAnalyticsAppInsights],
      (dwAnalytics: DwAnalytics, dwAnalyticsAppInsights: DwAnalyticsAppInsights) => {
        fixture = createRoot(RootCmp);
        const action = 'the action';
        const properties = {};
        const measurements = {};
        dwAnalyticsAppInsights.measurements = measurements;
        dwAnalytics.eventTrack.next({
          action, properties
        });
        advance(fixture);
        expect(appInsights.trackEvent).toHaveBeenCalledWith(action, properties, measurements);
      }),
    ),
  );

  it('should track exceptions (string)',
    fakeAsync(inject([DwAnalytics, DwAnalyticsAppInsights],
      (dwAnalytics: DwAnalytics, dwAnalyticsAppInsights: DwAnalyticsAppInsights) => {
        fixture = createRoot(RootCmp);
        const str = 'test string';
        dwAnalytics.exceptionTrack.next(str);
        advance(fixture);
        expect(appInsights.trackException).toHaveBeenCalledWith(str);
      }),
    ),
  );

  it('should track exceptions (event)',
    fakeAsync(inject([DwAnalytics, DwAnalyticsAppInsights],
      (dwAnalytics: DwAnalytics, dwAnalyticsAppInsights: DwAnalyticsAppInsights) => {
        fixture = createRoot(RootCmp);
        const event = { 'event': true };
        dwAnalytics.exceptionTrack.next({ event });
        advance(fixture);
        expect(appInsights.trackException).toHaveBeenCalledWith(event);
      }),
    ),
  );

  it('should track exceptions (description)',
    fakeAsync(inject([DwAnalytics, DwAnalyticsAppInsights],
      (dwAnalytics: DwAnalytics, dwAnalyticsAppInsights: DwAnalyticsAppInsights) => {
        fixture = createRoot(RootCmp);
        const description = 'test description';
        dwAnalytics.exceptionTrack.next({ description });
        advance(fixture);
        expect(appInsights.trackException).toHaveBeenCalledWith(description);
      }),
    ),
  );

  it('should set userId in setAuthenticatedUserContext',
    fakeAsync(inject([DwAnalytics, DwAnalyticsAppInsights],
      (dwAnalytics: DwAnalytics, dwAnalyticsAppInsights: DwAnalyticsAppInsights) => {
        fixture = createRoot(RootCmp);
        const userId = 'test_userId';
        dwAnalyticsAppInsights.setUserId(userId);
        advance(fixture);
        expect(dwAnalytics.settings.appInsights.userId).toBe(userId);
        expect(appInsights.setAuthenticatedUserContext).toHaveBeenCalledWith(userId);
      }),
    ),
  );

  it('should set userId and accountId in setAuthenticatedUserContext',
    fakeAsync(inject([DwAnalytics, DwAnalyticsAppInsights],
      (dwAnalytics: DwAnalytics, dwAnalyticsAppInsights: DwAnalyticsAppInsights) => {
        fixture = createRoot(RootCmp);
        const userId = 'test_userId';
        const accountId = 'test_accountId';
        dwAnalyticsAppInsights.setUserProperties({ userId, accountId });
        advance(fixture);
        expect(dwAnalytics.settings.appInsights.userId).toBe(userId);
        expect(appInsights.setAuthenticatedUserContext).toHaveBeenCalledWith(userId, accountId);
      }),
    ),
  );


  it('should user existing userId and set accountId in setAuthenticatedUserContext',
    fakeAsync(inject([DwAnalytics, DwAnalyticsAppInsights],
      (dwAnalytics: DwAnalytics, dwAnalyticsAppInsights: DwAnalyticsAppInsights) => {
        fixture = createRoot(RootCmp);
        const userId = 'test_userId';
        const accountId = 'test_accountId';
        dwAnalyticsAppInsights.setUserId(userId);
        advance(fixture);
        expect(dwAnalytics.settings.appInsights.userId).toBe(userId);
        dwAnalyticsAppInsights.setUserProperties({ accountId });
        advance(fixture);
        expect(appInsights.setAuthenticatedUserContext).toHaveBeenCalledWith(userId, accountId);
      }),
    ),
  );

  it('should set the start time on start',
    fakeAsync(inject([DwAnalytics, DwAnalyticsAppInsights],
      (dwAnalytics: DwAnalytics, dwAnalyticsAppInsights: DwAnalyticsAppInsights) => {
        dwAnalyticsAppInsights.startTimer();
        expect(dwAnalyticsAppInsights.loadStartTime).toBeLessThanOrEqual(Date.now());
        expect(dwAnalyticsAppInsights.loadTime).toBe(null);
      }),
    ),
  );

  it('should set the total time on stop',
    fakeAsync(inject([DwAnalytics, DwAnalyticsAppInsights],
      (dwAnalytics: DwAnalytics, dwAnalyticsAppInsights: DwAnalyticsAppInsights) => {
        dwAnalyticsAppInsights.loadStartTime = Date.now() - 1000;
        dwAnalyticsAppInsights.stopTimer();
        // 50ms time difference for testing to ensure timing is correct
        expect(dwAnalyticsAppInsights.loadTime).toBeLessThanOrEqual(1150);
        expect(dwAnalyticsAppInsights.loadTime).toBeGreaterThanOrEqual(1000);
        expect(dwAnalyticsAppInsights.loadStartTime).toBe(null);
      }),
    ),
  );
});
