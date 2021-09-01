import {
  fakeAsync,
  inject,
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';

import { DwAnalytics } from '../../core/analytics';
import { advance, createRoot, RootCmp, TestModule } from '../../test.mocks';
import { DwAnalyticsIntercom } from './analytics-intercom';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 5000;
declare var window: any;

describe('DwAnalyticsIntercom', () => {
  let fixture: ComponentFixture<any>;
  let Intercom: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TestModule,
      ],
      providers: [
        DwAnalyticsIntercom,
      ]
    });

    window.Intercom = Intercom = jasmine.createSpy('Intercom');
  });

  it('should track pages',
    fakeAsync(inject([DwAnalytics, DwAnalyticsIntercom],
      (dwAnalytics: DwAnalytics, dwAnalyticsIntercom: DwAnalyticsIntercom) => {
        fixture = createRoot(RootCmp);
        dwAnalytics.pageTrack.next({ path: '/abc' });
        advance(fixture);
        expect(Intercom).toHaveBeenCalledWith('trackEvent', 'Pageview', { url: '/abc' });
      }),
    ),
  );

  it('should track events',
    fakeAsync(inject([DwAnalytics, DwAnalyticsIntercom],
      (dwAnalytics: DwAnalytics, dwAnalyticsIntercom: DwAnalyticsIntercom) => {
        fixture = createRoot(RootCmp);
        dwAnalytics.eventTrack.next({ action: 'do', properties: { category: 'cat' } });
        advance(fixture);
        expect(Intercom).toHaveBeenCalledWith('trackEvent', 'do', { category: 'cat' });
      }),
    ),
  );

  it('should set user properties',
    fakeAsync(inject([DwAnalytics, DwAnalyticsIntercom],
      (dwAnalytics: DwAnalytics, dwAnalyticsIntercom: DwAnalyticsIntercom) => {
        fixture = createRoot(RootCmp);
        dwAnalytics.setUserProperties.next({ userId: '1', firstName: 'John', lastName: 'Doe' });
        advance(fixture);
        expect(Intercom).toHaveBeenCalledWith('boot', {
          userId: '1',
          user_id: '1',
          firstName: 'John',
          lastName: 'Doe',
        });
      }),
    ),
  );

  it('should set user properties if no userId present',
    fakeAsync(inject([DwAnalytics, DwAnalyticsIntercom],
      (dwAnalytics: DwAnalytics, dwAnalyticsIntercom: DwAnalyticsIntercom) => {
        fixture = createRoot(RootCmp);
        dwAnalytics.setUserProperties.next({ firstName: 'John', lastName: 'Doe' });
        advance(fixture);
        expect(Intercom).toHaveBeenCalledWith('boot', {
          firstName: 'John',
          lastName: 'Doe',
        });
      }),
    ),
  );

  it('should set user properties once',
    fakeAsync(inject([DwAnalytics, DwAnalyticsIntercom],
      (dwAnalytics: DwAnalytics, dwAnalyticsIntercom: DwAnalyticsIntercom) => {
        fixture = createRoot(RootCmp);
        dwAnalytics.setUserPropertiesOnce.next({
          userId: '1',
          firstName: 'John',
          lastName: 'Doe',
        });
        advance(fixture);
        expect(Intercom).toHaveBeenCalledWith('boot', {
          userId: '1',
          user_id: '1',
          firstName: 'John',
          lastName: 'Doe',
        });
      }),
    ),
  );

  it('should set user properties once if no userId present',
    fakeAsync(inject([DwAnalytics, DwAnalyticsIntercom],
      (dwAnalytics: DwAnalytics, dwAnalyticsIntercom: DwAnalyticsIntercom) => {
        fixture = createRoot(RootCmp);
        dwAnalytics.setUserPropertiesOnce.next({
          firstName: 'John',
          lastName: 'Doe',
        });
        advance(fixture);
        expect(Intercom).toHaveBeenCalledWith('boot', {
          firstName: 'John',
          lastName: 'Doe',
        });
      }),
    ),
  );
});
