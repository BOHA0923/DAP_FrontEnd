import { Injectable, Injector } from '@angular/core';

import { DwAnalytics } from '../../core/analytics';

declare var Intercom: any;

@Injectable({ providedIn: 'root' })
export class DwAnalyticsIntercom {
  dwAnalytics: DwAnalytics;
  constructor(
    injector: Injector
  ) {
    this.dwAnalytics = injector.get(DwAnalytics);
    this.dwAnalytics.pageTrack.subscribe((x) => this.pageTrack(x.path));
    this.dwAnalytics.eventTrack.subscribe((x) => this.eventTrack(x.action, x.properties));
    this.dwAnalytics.setUserProperties.subscribe((x) => this.setUserProperties(x));
    this.dwAnalytics.setUserPropertiesOnce.subscribe((x) => this.setUserProperties(x));
  }

  pageTrack(path: string): void {
    try {
      this.eventTrack('Pageview', {
        url: path
      });
    } catch (e) {
      if (!(e instanceof ReferenceError)) {
        throw e;
      }
    }
  }

  eventTrack(action: string, properties: any): void {
    try {
      Intercom('trackEvent', action, properties);
    } catch (e) {
      if (!(e instanceof ReferenceError)) {
        throw e;
      }
    }
  }

  setUserProperties(properties: any): void {
    try {
      if (properties.userId && !properties.user_id) {
        properties.user_id = properties.userId;
      }

      Intercom('boot', properties);
    } catch (e) {
      if (!(e instanceof ReferenceError)) {
        throw e;
      }
    }
  }
}
