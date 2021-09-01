import { Injectable } from '@angular/core';
import { DwAnalytics } from '../../core/analytics';


declare var amplitude: {
  getInstance: () => {
    logEvent(action: string, properties: any): void;
    setUserId(userId: string): void;
    setUserProperties(properties: any): void;
  }
};

@Injectable({ providedIn: 'root' })
export class DwAnalyticsAmplitude {

  constructor(private dwAnalytics: DwAnalytics) {
    this.dwAnalytics.pageTrack.subscribe((x: any) => this.pageTrack(x.path));

    this.dwAnalytics.eventTrack.subscribe((x: any) => this.eventTrack(x.action, x.properties));

    this.dwAnalytics.setUserId.subscribe((x: any) => this.setUserId(x));

    this.dwAnalytics.setUserProperties.subscribe((x: any) => this.setUserProperties(x));

    this.dwAnalytics.setUserPropertiesOnce.subscribe((x: any) => this.setUserProperties(x));
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
      amplitude.getInstance().logEvent(action, properties);
    } catch (e) {
      if (!(e instanceof ReferenceError)) {
        throw e;
      }
    }
  }

  setUserId(userId: string): void {
    try {
      amplitude.getInstance().setUserId(userId);
    } catch (e) {
      if (!(e instanceof ReferenceError)) {
        throw e;
      }
    }
  }

  setUserProperties(properties: any): void {
    try {
      amplitude.getInstance().setUserProperties(properties);
    } catch (e) {
      if (!(e instanceof ReferenceError)) {
        throw e;
      }
    }
  }
}
