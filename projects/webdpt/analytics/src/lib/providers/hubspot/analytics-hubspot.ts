import { Injectable, Injector } from '@angular/core';

import { DwAnalytics } from '../../core/analytics';

declare var _hsq: any;

@Injectable({ providedIn: 'root' })
export class DwAnalyticsHubspot {
  dwAnalytics: DwAnalytics;
  constructor(
    injector: Injector
  ) {
    if (typeof _hsq === 'undefined') {
      _hsq = [];
    }
    this.dwAnalytics = injector.get(DwAnalytics);
    this.dwAnalytics.pageTrack.subscribe((x) => this.pageTrack(x.path));
    this.dwAnalytics.eventTrack.subscribe((x) => this.eventTrack(x.action, x.properties));
    this.dwAnalytics.setUserProperties.subscribe((x) => this.setUserProperties(x));
  }

  pageTrack(path: string): void {
    if (typeof _hsq !== 'undefined') {
      _hsq.push(['setPath', path]);
      _hsq.push(['trackPageView']);
    }
  }

  eventTrack(action: string, properties: any): void {
    if (typeof _hsq !== 'undefined') {
      _hsq.push(['trackEvent', properties]);
    }
  }

  setUserProperties(properties: any): void {
    if (typeof _hsq !== 'undefined') {
      _hsq.push(['identify', properties]);
    }
  }
}
