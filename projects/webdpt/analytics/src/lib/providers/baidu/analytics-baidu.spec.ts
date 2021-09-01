import {
  fakeAsync,
  inject,
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';

import { advance, createRoot, RootCmp, TestModule } from '../../test.mocks';

import { DwAnalytics } from '../../core/analytics';
import { DwAnalyticsBaiduTongji } from './analytics-baidu';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 5000;
declare var window: any;

describe('DwAnalyticsBaiduTongji', () => {
  let _hmt: Array<any>;
  let fixture: ComponentFixture<any>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [TestModule],
        providers: [DwAnalyticsBaiduTongji],
      });

      window._hmt = _hmt = [];
    });

  it('should track pages',
    fakeAsync(inject([DwAnalytics, DwAnalyticsBaiduTongji],
      (dwAnalytics: DwAnalytics, dwAnalyticsBaiduAnalytics: DwAnalyticsBaiduTongji) => {
        fixture = createRoot(RootCmp);
        dwAnalytics.pageTrack.next({ path: '/abc' });
        advance(fixture);
        expect(_hmt).toContain(['_trackPageview', '/abc']);
      }),
    ),
  );

  it('should track events',
    fakeAsync(inject([DwAnalytics, DwAnalyticsBaiduTongji],
      (dwAnalytics: DwAnalytics, dwAnalyticsBaiduAnalytics: DwAnalyticsBaiduTongji) => {
        fixture = createRoot(RootCmp);
        dwAnalytics.eventTrack.next({
          action: 'do',
          properties: {
            category: 'cat',
            opt_label: 'label',
            opt_value: 'value',
          },
        });
        advance(fixture);
        expect(_hmt).toContain(['_trackEvent', 'cat', 'do', 'label', 'value']);
      }),
    ),
  );

  it('should set username',
    fakeAsync(inject([DwAnalytics, DwAnalyticsBaiduTongji],
      (dwAnalytics: DwAnalytics, dwAnalyticsBaiduAnalytics: DwAnalyticsBaiduTongji) => {
        fixture = createRoot(RootCmp);
        dwAnalytics.setUserId.next('testUser');
        advance(fixture);
        expect(_hmt).toContain(['_setCustomVar', 1, 'identity', 'testUser']);
      }),
    ),
  );

  it('should set user properties',
    fakeAsync(inject([DwAnalytics, DwAnalyticsBaiduTongji],
      (dwAnalytics: DwAnalytics, dwAnalyticsBaiduAnalytics: DwAnalyticsBaiduTongji) => {
        fixture = createRoot(RootCmp);
        dwAnalytics.setUserProperties.next({
          userId: '1',
          firstName: 'John',
          lastName: 'Doe',
        });
        advance(fixture);
        expect(_hmt).toContain([
          '_setCustomVar',
          2,
          'user',
          '{"userId":"1","firstName":"John","lastName":"Doe"}',
        ]);
      }),
    ),
  );

});
