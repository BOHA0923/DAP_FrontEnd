import { Injectable, Injector } from '@angular/core';

import { DwAnalytics } from '../../core/analytics';


declare var woopra: any;

@Injectable({ providedIn: 'root' })
export class DwAnalyticsWoopra {
  dwAnalytics: DwAnalytics;
  constructor(injector: Injector) {
    if (typeof (woopra) === 'undefined') {
      console.warn('Woopra not found');
    }
    this.dwAnalytics = injector.get(DwAnalytics);
    this.dwAnalytics.pageTrack.subscribe((x) => this.pageTrack(x.path));
    this.dwAnalytics.eventTrack.subscribe((x) => this.eventTrack(x.action, x.properties));
    this.dwAnalytics.setUserProperties.subscribe((x) => this.setUserProperties(x));
  }

  pageTrack(path: string): void {
    try {
      woopra.track('pv', {
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
      woopra.track(action, properties);
    } catch (e) {
      if (!(e instanceof ReferenceError)) {
        throw e;
      }
    }
  }

  setUserProperties(properties: any): void {
    try {
      if (properties.email) {
        woopra.identify(properties);
      }
    } catch (e) {
      if (!(e instanceof ReferenceError)) {
        throw e;
      }
    }
  }
}
