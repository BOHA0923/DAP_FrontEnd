import { Injectable, Injector } from '@angular/core';
import { DwAnalytics } from '../../core/analytics';



declare var _kmq: any;

@Injectable({ providedIn: 'root' })
export class DwAnalyticsKissmetrics {
  dwAnalytics: DwAnalytics;
  constructor(
    injector: Injector
  ) {
    if (typeof (_kmq) === 'undefined') {
      _kmq = [];
    }
    this.dwAnalytics = injector.get(DwAnalytics);
    this.dwAnalytics.pageTrack.subscribe((x) => this.pageTrack(x.path));
    this.dwAnalytics.eventTrack.subscribe((x) => this.eventTrack(x.action, x.properties));
    this.dwAnalytics.setUserId.subscribe((x: string) => this.setUserId(x));
    this.dwAnalytics.setUserProperties.subscribe((x) => this.setUserProperties(x));
  }

  pageTrack(path: string): void {
    _kmq.push(['record', 'Pageview', { 'Page': path }]);
  }

  eventTrack(action: string, properties: any): void {
    _kmq.push(['record', action, properties]);
  }

  setUserId(userId: string): void {
    _kmq.push(['identify', userId]);
  }

  setUserProperties(properties: any): void {
    _kmq.push(['set', properties]);
  }
}
