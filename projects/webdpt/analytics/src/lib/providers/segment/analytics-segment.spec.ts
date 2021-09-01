import {
  fakeAsync,
  inject,
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';

import { DwAnalytics } from '../../core/analytics';
import { advance, createRoot, RootCmp, TestModule } from '../../test.mocks';
import { DwAnalyticsSegment } from './analytics-segment';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 5000;
declare var window: any;

describe('DwAnalyticsSegment', () => {

  let fixture: ComponentFixture<any>;
  let analytics: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestModule],
      providers: [DwAnalyticsSegment],
    });

    window.analytics = analytics = {
      page: jasmine.createSpy('page'),
      track: jasmine.createSpy('track'),
      identify: jasmine.createSpy('identify'),
      alias: jasmine.createSpy('alias')
    };
  });

  it('should track pages',
    fakeAsync(inject([DwAnalytics, DwAnalyticsSegment],
      (dwAnalytics: DwAnalytics, dwAnalyticsSegment: DwAnalyticsSegment) => {
        fixture = createRoot(RootCmp);
        dwAnalytics.pageTrack.next({ path: '/abc' });
        advance(fixture);
        expect(analytics.page).toHaveBeenCalledWith('/abc');
      }),
    ),
  );

  it('should track events',
    fakeAsync(inject([DwAnalytics, DwAnalyticsSegment],
      (dwAnalytics: DwAnalytics, dwAnalyticsSegment: DwAnalyticsSegment) => {
        fixture = createRoot(RootCmp);
        dwAnalytics.eventTrack.next({ action: 'do', properties: { category: 'cat' } });
        advance(fixture);
        expect(analytics.track).toHaveBeenCalledWith('do', {
          category: 'cat',
        });
      }),
    ),
  );

  it('should set user properties',
    fakeAsync(inject([DwAnalytics, DwAnalyticsSegment],
      (dwAnalytics: DwAnalytics, dwAnalyticsSegment: DwAnalyticsSegment) => {
        fixture = createRoot(RootCmp);
        dwAnalytics.setUserProperties.next({ userId: '1', firstName: 'John', lastName: 'Doe' });
        advance(fixture);
        expect(analytics.identify).toHaveBeenCalledWith('1', {
          userId: '1',
          firstName: 'John',
          lastName: 'Doe',
        });
      }),
    ),
  );

  it('should set user properties once',
    fakeAsync(inject([DwAnalytics, DwAnalyticsSegment],
      (dwAnalytics: DwAnalytics, dwAnalyticsSegment: DwAnalyticsSegment) => {
        fixture = createRoot(RootCmp);
        dwAnalytics.setUserPropertiesOnce.next({ userId: '1', firstName: 'John', lastName: 'Doe' });
        advance(fixture);
        expect(analytics.identify).toHaveBeenCalledWith('1', {
          userId: '1',
          firstName: 'John',
          lastName: 'Doe',
        });
      }),
    ),
  );

  it('should set alias',
    fakeAsync(inject([DwAnalytics, DwAnalyticsSegment],
      (dwAnalytics: DwAnalytics, dwAnalyticsSegment: DwAnalyticsSegment) => {
        fixture = createRoot(RootCmp);
        dwAnalytics.setAlias.next('testAlias');
        advance(fixture);
        expect(analytics.alias).toHaveBeenCalledWith('testAlias');
      }),
    ),
  );

});
