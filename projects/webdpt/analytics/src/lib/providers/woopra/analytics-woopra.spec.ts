import {
  fakeAsync,
  inject,
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';

import { DwAnalytics } from '../../core/analytics';
import { advance, createRoot, RootCmp, TestModule } from '../../test.mocks';
import { DwAnalyticsWoopra } from './analytics-woopra';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 5000;
declare var window: any;

describe('DwAnalyticsWoopra', () => {
  let fixture: ComponentFixture<any>;
  let woopra: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestModule],
      providers: [DwAnalyticsWoopra],
    });

    window.woopra = woopra = {
      track: jasmine.createSpy('track'),
      identify: jasmine.createSpy('identify'),
    };
  });

  it('should track pages',
    fakeAsync(inject([DwAnalytics, DwAnalyticsWoopra],
      (dwAnalytics: DwAnalytics, dwAnalyticsWoopra: DwAnalyticsWoopra) => {
        fixture = createRoot(RootCmp);
        dwAnalytics.pageTrack.next({path: '/abc' });
        advance(fixture);
        expect(woopra.track).toHaveBeenCalledWith('pv', {url: '/abc'});
      }),
    ),
  );

  it('should track events',
    fakeAsync(inject([DwAnalytics, DwAnalyticsWoopra],
      (dwAnalytics: DwAnalytics, dwAnalyticsWoopra: DwAnalyticsWoopra) => {
        fixture = createRoot(RootCmp);
        dwAnalytics.eventTrack.next({
          action: 'payment',
          properties: {
            amount: '49.95',
            currency: 'USD',
          },
        });
        advance(fixture);
        expect(woopra.track).toHaveBeenCalledWith('payment', {
          amount: '49.95',
          currency: 'USD',
        });
      }),
    ),
  );

  it('should set user properties',
    fakeAsync(inject([DwAnalytics, DwAnalyticsWoopra],
      (dwAnalytics: DwAnalytics, dwAnalyticsWoopra: DwAnalyticsWoopra) => {
        fixture = createRoot(RootCmp);
        dwAnalytics.setUserProperties.next({email: 'test@test.com', name: 'John Doe', company: 'Test Co'});
        advance(fixture);
        expect(woopra.identify).toHaveBeenCalledWith({
          email: 'test@test.com',
          name: 'John Doe',
          company: 'Test Co'
        });
      }),
    ),
  );
});
