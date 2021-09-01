import { fakeAsync, inject, ComponentFixture, TestBed } from '@angular/core/testing';


import { advance, createRoot, RootCmp, TestModule } from '../../test.mocks';
import { DwAnalyticsKissmetrics } from './analytics-kissmetrics';
import { DwAnalytics } from '../../core/analytics';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 5000;
declare var window: any;

describe('DwAnalyticsKissmetrics', () => {
  let _kmq: Array<any>;
  let fixture: ComponentFixture<any>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestModule],
      providers: [DwAnalyticsKissmetrics],
    });

    window._kmq = _kmq = [];
  });

  it('should track pages',
    fakeAsync(inject([DwAnalytics, DwAnalyticsKissmetrics],
      (dwAnalytics: DwAnalytics, dwAnalyticsKissmetrics: DwAnalyticsKissmetrics) => {
        fixture = createRoot(RootCmp);
        dwAnalytics.pageTrack.next({ path: '/abc' });
        advance(fixture);
        expect(_kmq).toContain(['record', 'Pageview', { 'Page': '/abc' }]);
      }),
    ),
  );

  it('should track events',
    fakeAsync(inject([DwAnalytics, DwAnalyticsKissmetrics],
      (dwAnalytics: DwAnalytics, dwAnalyticsKissmetrics: DwAnalyticsKissmetrics) => {
        fixture = createRoot(RootCmp);
        dwAnalytics.eventTrack.next({ action: 'do', properties: { category: 'cat' } });
        advance(fixture);
        expect(_kmq).toContain(['record', 'do', { category: 'cat' }]);
      }),
    ),
  );

  it('should set username',
    fakeAsync(inject([DwAnalytics, DwAnalyticsKissmetrics],
      (dwAnalytics: DwAnalytics, dwAnalyticsKissmetrics: DwAnalyticsKissmetrics) => {
        fixture = createRoot(RootCmp);
        dwAnalytics.setUserId.next('testUser');
        advance(fixture);
        expect(_kmq).toContain(['identify', 'testUser']);
      }),
    ),
  );

  it('should set user properties',
    fakeAsync(inject([DwAnalytics, DwAnalyticsKissmetrics],
      (dwAnalytics: DwAnalytics, dwAnalyticsKissmetrics: DwAnalyticsKissmetrics) => {
        fixture = createRoot(RootCmp);
        dwAnalytics.setUserProperties.next({ userId: '1', firstName: 'John', lastName: 'Doe' });
        advance(fixture);
        expect(_kmq).toContain(['set', { userId: '1', firstName: 'John', lastName: 'Doe' }]);
      }),
    ),
  );

});
