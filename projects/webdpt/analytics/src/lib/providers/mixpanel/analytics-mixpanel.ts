import { Injectable, Injector } from '@angular/core';

import { DwAnalytics } from '../../core/analytics';
declare var mixpanel: any;

@Injectable({ providedIn: 'root' })
export class DwAnalyticsMixpanel {
  dwAnalytics: DwAnalytics;
  constructor(
    injector: Injector
  ) {
    this.dwAnalytics = injector.get(DwAnalytics);
    this.dwAnalytics.pageTrack.subscribe((x) => this.pageTrack(x.path));
    this.dwAnalytics.eventTrack.subscribe((x) => this.eventTrack(x.action, x.properties));
    this.dwAnalytics.setUserId.subscribe((x: string) => this.setUserId(x));
    this.dwAnalytics.setUserProperties.subscribe((x) => this.setUserProperties(x));
    this.dwAnalytics.setUserPropertiesOnce.subscribe((x) => this.setUserPropertiesOnce(x));
    this.dwAnalytics.setSuperProperties.subscribe((x) => this.setSuperProperties(x));
    this.dwAnalytics.setSuperPropertiesOnce.subscribe((x) => this.setSuperPropertiesOnce(x));
    this.dwAnalytics.setAlias.subscribe((x) => this.setAlias(x));
  }

  pageTrack(path: string): void {
    try {
      mixpanel.track('Page Viewed', { page: path });
    } catch (e) {
      if (!(e instanceof ReferenceError)) {
        throw e;
      }
    }
  }

  eventTrack(action: string, properties: any): void {
    try {
      mixpanel.track(action, properties);
    } catch (e) {
      if (!(e instanceof ReferenceError)) {
        throw e;
      }
    }
  }

  setUserId(userId: string): void {
    try {
      mixpanel.identify(userId);
    } catch (e) {
      if (!(e instanceof ReferenceError)) {
        throw e;
      }
    }
  }

  setUserProperties(properties: any): void {
    try {
      mixpanel.people.set(properties);
    } catch (e) {
      if (!(e instanceof ReferenceError)) {
        throw e;
      }
    }
  }

  setUserPropertiesOnce(properties: any): void {
    try {
      mixpanel.people.set_once(properties);
    } catch (e) {
      if (!(e instanceof ReferenceError)) {
        throw e;
      }
    }
  }

  setSuperProperties(properties: any): void {
    try {
      mixpanel.register(properties);
    } catch (e) {
      if (!(e instanceof ReferenceError)) {
        throw e;
      }
    }
  }

  setSuperPropertiesOnce(properties: any): void {
    try {
      mixpanel.register_once(properties);
    } catch (e) {
      if (!(e instanceof ReferenceError)) {
        throw e;
      }
    }
  }

  setAlias(alias: any): void {
    try {
      mixpanel.alias(alias);
    } catch (e) {
      if (!(e instanceof ReferenceError)) {
        throw e;
      }
    }
  }
}
