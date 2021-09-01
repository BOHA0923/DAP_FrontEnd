import { fakeAsync, inject, ComponentFixture, TestBed } from '@angular/core/testing';

import { DwAnalytics } from '../../core/analytics';
import { advance, createRoot, RootCmp, TestModule } from '../../test.mocks';
import { DwAnalyticsAmplitude } from './analytics-amplitude';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 5000;
declare var window: any;

describe('DwAnalyticsAmplitude', () => {
  let fixture: ComponentFixture<any>;
  let amplitudeMock: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TestModule,
      ],
      providers: [
        DwAnalyticsAmplitude,
      ]
    });

    amplitudeMock = {
      logEvent: jasmine.createSpy('Amplitude.logEvent'),
      setUserProperties: jasmine.createSpy('Amplitude.setUserProperties'),
      setUserId: jasmine.createSpy('Amplitude.setUserId')
    };

    window.amplitude = {
      getInstance() {
        return amplitudeMock;
      }
    };
  });

  it('should track pages',
    fakeAsync(inject([DwAnalytics, DwAnalyticsAmplitude],
      (dwAnalytics: DwAnalytics, dwAnalyticsAmplitude: DwAnalyticsAmplitude) => {
        fixture = createRoot(RootCmp);
        dwAnalytics.pageTrack.next({ path: '/abc' });
        advance(fixture);
        expect(amplitudeMock.logEvent).toHaveBeenCalledWith('Pageview', { url: '/abc' });
      }),
    ),
  );

  it('should track events',
    fakeAsync(inject([DwAnalytics, DwAnalyticsAmplitude],
      (dwAnalytics: DwAnalytics, dwAnalyticsAmplitude: DwAnalyticsAmplitude) => {
        fixture = createRoot(RootCmp);
        dwAnalytics.eventTrack.next({ action: 'do', properties: { category: 'cat' } });
        advance(fixture);
        expect(amplitudeMock.logEvent).toHaveBeenCalledWith('do', { category: 'cat' });
      }),
    ),
  );

  it('should set user properties',
    fakeAsync(inject([DwAnalytics, DwAnalyticsAmplitude],
      (dwAnalytics: DwAnalytics, dwAnalyticsAmplitude: DwAnalyticsAmplitude) => {
        fixture = createRoot(RootCmp);
        dwAnalytics.setUserProperties.next({ userId: '1', firstName: 'John', lastName: 'Doe' });
        advance(fixture);
        expect(amplitudeMock.setUserProperties).toHaveBeenCalledWith({
          userId: '1',
          firstName: 'John',
          lastName: 'Doe',
        });
      }),
    ),
  );

  it('should set user properties once',
    fakeAsync(inject([DwAnalytics, DwAnalyticsAmplitude],
      (dwAnalytics: DwAnalytics, dwAnalyticsAmplitude: DwAnalyticsAmplitude) => {
        fixture = createRoot(RootCmp);
        dwAnalytics.setUserPropertiesOnce.next({ userId: '1', firstName: 'John', lastName: 'Doe' });
        advance(fixture);
        expect(amplitudeMock.setUserProperties).toHaveBeenCalledWith({
          userId: '1',
          firstName: 'John',
          lastName: 'Doe',
        });
      }),
    ),
  );

  it('should set user name',
    fakeAsync(inject([DwAnalytics, DwAnalyticsAmplitude],
      (dwAnalytics: DwAnalytics, dwAnalyticsAmplitude: DwAnalyticsAmplitude) => {
        fixture = createRoot(RootCmp);
        dwAnalytics.setUserId.next('John');
        advance(fixture);
        expect(amplitudeMock.setUserId).toHaveBeenCalledWith('John');
      }),
    ),
  );
});
