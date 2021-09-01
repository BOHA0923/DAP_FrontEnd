import { Injectable, Injector } from '@angular/core';
import { GoogleTagManagerSettings } from '../../core/analytics-config';
import { DwAnalytics } from '../../core/analytics';


declare var dataLayer: any;

export class GoogleTagManagerDefaults implements GoogleTagManagerSettings {
  userId = null;
  dimensions = {};
}

export class DwAnalyticsGoogleTagManager {
  constructor(private dwAnalytics: DwAnalytics, trackingId: any) {
    //  dwAnalytics: DwAnalytics;
    //  constructor(injector: Injector) {
    //    this.dwAnalytics = injector.get(DwAnalytics);
    // The dataLayer needs to be initialized
    if (typeof dataLayer !== 'undefined' && dataLayer) {
      dataLayer = (<any>window).dataLayer = (<any>window).dataLayer || [];
    }
    const defaults = new GoogleTagManagerDefaults;
    // Set the default settings for this module
    this.dwAnalytics.settings.gtm = { ...defaults, ...this.dwAnalytics.settings.gtm };
    this.dwAnalytics.pageTrack.subscribe((x) => this.pageTrack(x.path));
    this.dwAnalytics.eventTrack.subscribe((x) => this.eventTrack(x.action, x.properties));

    this.dwAnalytics.exceptionTrack.subscribe((x: any) => this.exceptionTrack(x));

    this.dwAnalytics.setUserId.subscribe((x: string) => this.setUserId(x));
    this.dwAnalytics.setAppId.subscribe(x => this.setAppId(x));
    this.dwAnalytics.setTenantId.subscribe(x => this.setTenantId(x));

    DwAnalyticsGoogleTagManager.createSession({ trackingId });
  }

  pageTrack(path: string, title?: string): void {
    if (typeof dataLayer !== 'undefined' && dataLayer) {
      dataLayer.push({
        'event': 'Page View',
        'content-name': path,
        'url': path,
        'userId': this.dwAnalytics.settings.gtm.userId,
        'title': title,
        ...this.dwAnalytics.settings.gtm.dimensions || {},
      });
    }
  }

  /**
   * Send interactions to the dataLayer, i.e. for event tracking in Google Analytics
   *
   * @param action associated with the event
   * @param properties
   * @param properties.category
   * @param [properties.label]
   * @param [properties.value]
   * @param [properties.noninteraction]
   */
  eventTrack(action: string, properties: any): void {

    // Set a default GTM category
    properties = properties || {};

    if (typeof dataLayer !== 'undefined' && dataLayer) {
      dataLayer.push({
        event: properties.event || 'interaction',
        target: properties.category || 'Event',
        category: properties.category || '',
        action: action,
        label: properties.label,
        value: properties.value,
        interactionType: properties.noninteraction,
        userId: this.dwAnalytics.settings.gtm.userId,
        ...this.dwAnalytics.settings.gtm.dimensions || {},
        ...properties.gtmCustom
      });
    }
  }

  /**
   * Exception Track Event in GTM
   *
   * @param  properties
   * @param  properties.appId
   * @param  properties.appName
   * @param  properties.appVersion
   * @param  [properties.description]
   * @param  [properties.fatal]
   */
  exceptionTrack(properties: any): void {
    // TODO: make interface
    //  @param properties
    //  @param properties.appId
    //  @param properties.appName
    //  @param properties.appVersion
    //  @param [properties.description]
    //  @param [properties.fatal]
    if (!properties || !properties.appId || !properties.appName || !properties.appVersion) {
      console.error('Must be setted appId, appName and appVersion.');
      return;
    }

    if (properties.fatal === undefined) {
      console.log('No "fatal" provided, sending with fatal=true');
      properties.exFatal = true;
    }

    properties.exDescription = properties.event ? properties.event.stack : properties.description;

    this.eventTrack(`Exception thrown for ${properties.appName} <${properties.appId}@${properties.appVersion}>`, {
      'category': 'Exception',
      'label': properties.exDescription
    });
  }

  /**
   * Set userId for use with Universal Analytics User ID feature
   *
   * @param userId used to identify user cross-device in Google Analytics
   */
  setUserId(userId: string): void {
    this.dwAnalytics.settings.gtm.dimensions.userId = userId;
    this.dwAnalytics.settings.gtm.userId = userId;
  }

  private setAppId(appId: string): void {
    this.dwAnalytics.settings.gtm.dimensions.appId = appId;
  }

  private setTenantId(tenantId: string): void {
    this.dwAnalytics.settings.gtm.dimensions.tenantId = tenantId;
  }

  static createSession(settings: { trackingId: string }): void {

    // tslint:disable-next-line:no-shadowed-variable
    (function (window: any, document: any, script: any, dataLayer: any, trackingId: any): void {
      window[dataLayer] = window[dataLayer] || [];
      window[dataLayer].push({
        'gtm.start':
          new Date().getTime(), event: 'gtm.js'
      });
      const f = document.getElementsByTagName(script)[0],
        j: any = document.createElement(script), dl = dataLayer !== 'dataLayer' ? '&l=' + dataLayer : '';
      j.async = true;
      j.src = 'https://www.googletagmanager.com/gtm.js?id=' + trackingId + dl;
      f.parentNode.insertBefore(j, f);
    })(window, document, 'script', 'dataLayer', settings.trackingId);

  }

}
