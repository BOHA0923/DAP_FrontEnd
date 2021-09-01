import { fakeAsync, inject, ComponentFixture, TestBed } from '@angular/core/testing';

import { DwAnalytics } from '../../core/analytics';
import { advance, createRoot, RootCmp, TestModule } from '../../test.mocks';
import { DwAnalyticsFacebook } from './analytics-facebook';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 5000;
declare var window: any;

describe('DwAnalyticsFacebook', () => {
  let fbq: any;
  let fixture: ComponentFixture<any>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestModule],
      providers: [DwAnalyticsFacebook],
    });

    window.fbq = fbq = jasmine.createSpy('fbq');
  });

  it('should track events',
    fakeAsync(inject([DwAnalytics, DwAnalyticsFacebook],
      (dwAnalytics: DwAnalytics, dwAnalyticsFacebook: DwAnalyticsFacebook) => {
        fixture = createRoot(RootCmp);
        dwAnalytics.eventTrack.next({
          action: 'ViewContent',
          properties: { category: 'cat' },
        });
        advance(fixture);
        expect(fbq).toHaveBeenCalledWith('track', 'ViewContent', { category: 'cat' });
      }),
    ),
  );

  it('should track custom events',
    fakeAsync(inject([DwAnalytics, DwAnalyticsFacebook],
      (dwAnalytics: DwAnalytics, dwAnalyticsFacebook: DwAnalyticsFacebook) => {
        fixture = createRoot(RootCmp);
        dwAnalytics.eventTrack.next({
          action: 'do',
          properties: { category: 'cat' },
        });
        advance(fixture);
        expect(fbq).toHaveBeenCalledWith('trackCustom', 'do', { category: 'cat' });
      }),
    ),
  );

});
