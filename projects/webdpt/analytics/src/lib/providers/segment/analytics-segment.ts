import { Injectable, Injector } from '@angular/core';
import { DwAnalytics } from '../../core/analytics';

// @ts-ignore
declare var analytics: SegmentAnalytics.AnalyticsJS;

@Injectable({ providedIn: 'root' })
export class DwAnalyticsSegment {
  dwAnalytics: DwAnalytics;
  constructor(
    injector: Injector
  ) {
    this.dwAnalytics = injector.get(DwAnalytics);
    this.dwAnalytics.pageTrack.subscribe((x) => this.pageTrack(x.path));
    this.dwAnalytics.eventTrack.subscribe((x) => this.eventTrack(x.action, x.properties));
    this.dwAnalytics.setUserProperties.subscribe((x) => this.setUserProperties(x));
    this.dwAnalytics.setUserPropertiesOnce.subscribe((x) => this.setUserProperties(x));
    this.dwAnalytics.setAlias.subscribe((x) => this.setAlias(x));
  }

  /**
   * https://segment.com/docs/libraries/analytics.js/#page
   *
   * analytics.page([category], [name], [properties], [options], [callback]);
   */
  pageTrack(path: string): void {
    // TODO : Support optional parameters where the parameter order and type changes their meaning
    try {
      analytics.page(path);
    } catch (e) {
      if (!(e instanceof ReferenceError)) {
        throw e;
      }
    }
  }

  /**
   * https://segment.com/docs/libraries/analytics.js/#track
   *
   * analytics.track(event, [properties], [options], [callback]);
   */
  eventTrack(action: string, properties: any): void {
    try {
      analytics.track(action, properties);
    } catch (e) {
      if (!(e instanceof ReferenceError)) {
        throw e;
      }
    }
  }

  /**
   * https://segment.com/docs/libraries/analytics.js/#identify
   *
   * analytics.identify([userId], [traits], [options], [callback]);
   */
  setUserProperties(properties: any): void {
    try {
      if (properties.userId) {
        analytics.identify(properties.userId, properties);
      } else {
        analytics.identify(properties);
      }
    } catch (e) {
      if (!(e instanceof ReferenceError)) {
        throw e;
      }
    }
  }

  /**
   * https://segment.com/docs/libraries/analytics.js/#alias
   *
   * analytics.alias(userId, previousId, options, callback);
   */
  setAlias(alias: any): void {
    try {
      analytics.alias(alias);
    } catch (e) {
      if (!(e instanceof ReferenceError)) {
        throw e;
      }
    }
  }
}
