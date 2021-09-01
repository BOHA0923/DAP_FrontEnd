import { fakeAsync, inject, ComponentFixture, TestBed } from '@angular/core/testing';

import { DwAnalytics } from '../../core/analytics';
import { advance, createRoot, RootCmp, TestModule } from '../../test.mocks';
import { DwAnalyticsGoogleTagManager } from './analytics-gtm';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 5000;
declare var window: any;

describe('DwAnalyticsGoogleTagManager', () => {
  let dataLayer: any;
  let fixture: ComponentFixture<any>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestModule],
      providers: [DwAnalyticsGoogleTagManager],
    });

    window.dataLayer = dataLayer = [];
  });

  it('should track pages',
    fakeAsync(inject([DwAnalytics, DwAnalyticsGoogleTagManager],
      (dwAnalytics: DwAnalytics, dwAnalyticsGoogleTagManager: DwAnalyticsGoogleTagManager) => {
        fixture = createRoot(RootCmp);
        dwAnalytics.pageTrack.next({ path: '/abc' });
        advance(fixture);
        expect(dataLayer).toContain({
          event: 'Page View',
          'content-name': '/abc',
          userId: null,
        });
      },
    )),
  );

  it('should track events',
    fakeAsync(inject([DwAnalytics, DwAnalyticsGoogleTagManager],
      (dwAnalytics: DwAnalytics, dwAnalyticsGoogleTagManager: DwAnalyticsGoogleTagManager) => {
        fixture = createRoot(RootCmp);
        dwAnalytics.eventTrack.next({ action: 'do', properties: { category: 'cat', gtmCustom: { customKey: 'customValue' } } });
        advance(fixture);
        expect(dataLayer).toContain({
          event: 'interaction',
          target: 'cat',
          action: 'do',
          customKey: 'customValue',
          label: undefined,
          value: undefined,
          interactionType: undefined,
          userId: null,
        });
      }
    )),
  );

  it('should track exceptions',
    fakeAsync(inject([DwAnalytics, DwAnalyticsGoogleTagManager],
      (dwAnalytics: DwAnalytics, dwAnalyticsGoogleTagManager: DwAnalyticsGoogleTagManager) => {
        fixture = createRoot(RootCmp);
        dwAnalytics.exceptionTrack.next({ appId: 'app', appName: 'Test App', appVersion: '0.1' });
        advance(fixture);
        expect(dataLayer).toContain({
          event: 'interaction',
          target: 'Exception',
          action: 'Exception thrown for Test App <app@0.1>',
          label: undefined,
          value: undefined,
          interactionType: undefined,
          userId: null,
        });
      }
    )),
  );

  it('should set username',
    fakeAsync(inject([DwAnalytics, DwAnalyticsGoogleTagManager],
      (dwAnalytics: DwAnalytics, dwAnalyticsGoogleTagManager: DwAnalyticsGoogleTagManager) => {
        fixture = createRoot(RootCmp);
        dwAnalytics.setUserId.next('testuser');
        advance(fixture);
        expect(dwAnalytics.settings.gtm.userId).toBe('testuser');
      }
    )),
  );

});
