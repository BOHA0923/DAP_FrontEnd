import { fakeAsync, inject, ComponentFixture, TestBed } from '@angular/core/testing';

import { advance, createRoot, RootCmp, TestModule } from '../../test.mocks';

import { DwAnalytics } from '../../core/analytics';
import { DwAnalyticsMixpanel } from './analytics-mixpanel';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 5000;
declare var window: any;

describe('DwAnalyticsMixpanel', () => {
  let fixture: ComponentFixture<any>;
  let mixpanel: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestModule],
      providers: [DwAnalyticsMixpanel],
    });

    window.mixpanel = mixpanel = {
      track: jasmine.createSpy('track'),
      identify: jasmine.createSpy('identify'),
      people: {
        set: jasmine.createSpy('people.set'),
        set_once: jasmine.createSpy('people.set_once'),
      },
      register: jasmine.createSpy('register'),
      register_once: jasmine.createSpy('register_once'),
      alias: jasmine.createSpy('alias'),
    };
  });

  it('should track pages',
    fakeAsync(inject([DwAnalytics, DwAnalyticsMixpanel],
      (dwAnalytics: DwAnalytics, dwAnalyticsMixpanel: DwAnalyticsMixpanel) => {
        fixture = createRoot(RootCmp);
        dwAnalytics.pageTrack.next({ path: '/abc' });
        advance(fixture);
        expect(mixpanel.track).toHaveBeenCalledWith('Page Viewed', { page: '/abc' });
      }),
    ),
  );

  it('should track events',
    fakeAsync(inject([DwAnalytics, DwAnalyticsMixpanel],
      (dwAnalytics: DwAnalytics, dwAnalyticsMixpanel: DwAnalyticsMixpanel) => {
        fixture = createRoot(RootCmp);
        dwAnalytics.eventTrack.next({ action: 'do', properties: { category: 'cat' } });
        advance(fixture);
        expect(mixpanel.track).toHaveBeenCalledWith('do', { category: 'cat' });
      }),
    ),
  );


  it('should set username',
    fakeAsync(inject([DwAnalytics, DwAnalyticsMixpanel],
      (dwAnalytics: DwAnalytics, dwAnalyticsMixpanel: DwAnalyticsMixpanel) => {
        fixture = createRoot(RootCmp);
        dwAnalytics.setUserId.next('testUser');
        advance(fixture);
        expect(mixpanel.identify).toHaveBeenCalledWith('testUser');
      }),
    ),
  );

  it('should set user properties',
    fakeAsync(inject([DwAnalytics, DwAnalyticsMixpanel],
      (dwAnalytics: DwAnalytics, dwAnalyticsMixpanel: DwAnalyticsMixpanel) => {
        fixture = createRoot(RootCmp);
        dwAnalytics.setUserProperties.next({ userId: '1', firstName: 'John', lastName: 'Doe' });
        advance(fixture);
        expect(mixpanel.people.set).toHaveBeenCalledWith({
          userId: '1',
          firstName: 'John',
          lastName: 'Doe',
        });
      }),
    ),
  );

  it('should set user properties once',
    fakeAsync(inject([DwAnalytics, DwAnalyticsMixpanel],
      (dwAnalytics: DwAnalytics, dwAnalyticsMixpanel: DwAnalyticsMixpanel) => {
        fixture = createRoot(RootCmp);
        dwAnalytics.setUserPropertiesOnce.next({
          userId: '1',
          firstName: 'John',
          lastName: 'Doe',
        });
        advance(fixture);
        expect(mixpanel.people.set_once).toHaveBeenCalledWith({
          userId: '1',
          firstName: 'John',
          lastName: 'Doe',
        });
      }),
    ),
  );

  it('should set super properties',
    fakeAsync(inject([DwAnalytics, DwAnalyticsMixpanel],
      (dwAnalytics: DwAnalytics, dwAnalyticsMixpanel: DwAnalyticsMixpanel) => {
        fixture = createRoot(RootCmp);
        dwAnalytics.setSuperProperties.next({
          userId: '1',
          firstName: 'John',
          lastName: 'Doe',
        });
        advance(fixture);
        expect(mixpanel.register).toHaveBeenCalledWith({
          userId: '1',
          firstName: 'John',
          lastName: 'Doe',
        });
      }),
    ),
  );

  it('should set super properties once',
    fakeAsync(inject([DwAnalytics, DwAnalyticsMixpanel],
      (dwAnalytics: DwAnalytics, dwAnalyticsMixpanel: DwAnalyticsMixpanel) => {
        fixture = createRoot(RootCmp);
        dwAnalytics.setSuperPropertiesOnce.next({
          userId: '1',
          firstName: 'John',
          lastName: 'Doe',
        });
        advance(fixture);
        expect(mixpanel.register_once).toHaveBeenCalledWith({
          userId: '1',
          firstName: 'John',
          lastName: 'Doe',
        });
      }),
    ),
  );

  it('should set alias',
    fakeAsync(inject([DwAnalytics, DwAnalyticsMixpanel],
      (dwAnalytics: DwAnalytics, dwAnalyticsMixpanel: DwAnalyticsMixpanel) => {
        fixture = createRoot(RootCmp);
        dwAnalytics.setAlias.next('testAlias');
        advance(fixture);
        expect(mixpanel.alias).toHaveBeenCalledWith('testAlias');
      }),
    ),
  );

});
