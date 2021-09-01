import { Injectable, Injector } from '@angular/core';
import { GoogleAnalyticsSettings } from '../../core/analytics-config';
import { DwAnalytics } from '../../core/analytics';
import { UserTimings } from '../../core/analytics-interfaces';


declare var _gaq: any; // GoogleAnalyticsCode;
declare var ga: any; // UniversalAnalytics.ga;
declare var location: any;

export class GoogleAnalyticsDefaults implements GoogleAnalyticsSettings {
  additionalAccountNames = [];
  userId = null;
  appId = '';
  tenantId = '';
  transport = '';
  anonymizeIp = false;
  dimensions = {};
}

@Injectable({ providedIn: 'root' })
export class DwAnalyticsGoogleAnalytics {
  dimensionsAndMetrics = [];
  dwAnalytics: DwAnalytics;
  constructor(injector: Injector) {
    this.dwAnalytics = injector.get(DwAnalytics);
    const defaults = new GoogleAnalyticsDefaults();
    // Set the default settings for this module
    this.dwAnalytics.settings.ga = {
      ...defaults,
      ...this.dwAnalytics.settings.ga,
    };
    this.dwAnalytics.pageTrack.subscribe(x => this.pageTrack(x.path));
    this.dwAnalytics.eventTrack.subscribe(x => this.eventTrack(x.action, x.properties));
    this.dwAnalytics.exceptionTrack.subscribe(x => this.exceptionTrack(x));
    this.dwAnalytics.setUserId.subscribe((x: string) => this.setUserId(x));
    this.dwAnalytics.setAppId.subscribe(x => this.setAppId(x));
    this.dwAnalytics.setTenantId.subscribe(x => this.setTenantId(x));
    this.dwAnalytics.setUserProperties.subscribe(x => this.setUserProperties(x));
    this.dwAnalytics.userTimings.subscribe(x => this.userTimings(x));
  }

  pageTrack(path: string): void {
    if (typeof _gaq !== 'undefined' && _gaq) {
      _gaq.push(['_trackPageview', path]);
      for (const accountName of this.dwAnalytics.settings.ga.additionalAccountNames) {
        _gaq.push([accountName + '._trackPageview', path]);
      }
    }
    if (typeof ga !== 'undefined' && ga) {
      if (this.dwAnalytics.settings.ga.userId) {
        ga('set', '&uid', this.dwAnalytics.settings.ga.userId);
        for (const accountName of this.dwAnalytics.settings.ga.additionalAccountNames) {
          ga(accountName + '.set', '&uid', this.dwAnalytics.settings.ga.userId);
        }
      }
      if (this.dwAnalytics.settings.ga.anonymizeIp) {
        ga('set', 'anonymizeIp', true);
        for (const accountName of this.dwAnalytics.settings.ga.additionalAccountNames) {
          ga(accountName + '.set', 'anonymizeIp', true);
        }
      }
      ga('set', {
        'dimension1': this.dwAnalytics.settings.ga.appId,
        'dimension2': this.dwAnalytics.settings.ga.tenantId,
        'dimension3': this.dwAnalytics.settings.ga.userId
      });
      ga('send', 'pageview', path);
      for (const accountName of this.dwAnalytics.settings.ga.additionalAccountNames) {
        ga(accountName + '.send', 'pageview', path);
      }
    }
  }

  /**
   * Track Event in GA
   *
   * @param action Associated with the event
   * @param properties Comprised of:
   *  - category (string) and optional
   *  - label (string)
   *  - value (integer)
   *  - noninteraction (boolean)
   *
   * @link https://developers.google.com/analytics/devguides/collection/gajs/eventTrackerGuide#SettingUpEventTracking
   * @link https://developers.google.com/analytics/devguides/collection/analyticsjs/events
   */
  eventTrack(action: string, properties: any): void {
    // Google Analytics requires an Event Category
    if (!properties || !properties.category) {
      properties = properties || {};
      properties.category = 'Event';
    }
    // GA requires that eventValue be an integer, see:
    // https://developers.google.com/analytics/devguides/collection/analyticsjs/field-reference#eventValue
    // https://github.com/luisfarzati/angulartics/issues/81
    if (properties.value) {
      const parsed = parseInt(properties.value, 10);
      properties.value = isNaN(parsed) ? 0 : parsed;
    }

    if (typeof ga !== 'undefined') {
      const eventOptions = {
        eventCategory: properties.category,
        eventAction: action,
        eventLabel: properties.label,
        eventValue: properties.value,
        nonInteraction: properties.noninteraction,
        page: properties.page || location.hash.substring(1) || location.pathname,
        userId: this.dwAnalytics.settings.ga.userId,
        hitCallback: properties.hitCallback,
      };

      ga('set', {
        'dimension1': this.dwAnalytics.settings.ga.appId,
        'dimension2': this.dwAnalytics.settings.ga.tenantId,
        'dimension3': this.dwAnalytics.settings.ga.userId
      });

      // add custom dimensions and metrics
      this.setDimensionsAndMetrics(properties);
      if (this.dwAnalytics.settings.ga.transport) {
        ga('send', 'event', eventOptions, {
          transport: this.dwAnalytics.settings.ga.transport,
        });
      } else {
        ga('send', 'event', eventOptions);
      }

      for (const accountName of this.dwAnalytics.settings.ga.additionalAccountNames) {
        ga(accountName + '.send', 'event', eventOptions);
      }
    } else if (typeof _gaq !== 'undefined') {
      _gaq.push([
        '_trackEvent',
        properties.category,
        action,
        properties.label,
        properties.value,
        properties.noninteraction,
      ]);
    }
  }

  /**
   * Exception Track Event in GA
   *
   * @param properties Comprised of the optional fields:
   *  - fatal (string)
   *  - description (string)
   *
   * @https://developers.google.com/analytics/devguides/collection/analyticsjs/exceptions
   *
   * @link https://developers.google.com/analytics/devguides/collection/analyticsjs/events
   */
  exceptionTrack(properties: any): void {
    if (properties.fatal === undefined) {
      console.log('No "fatal" provided, sending with fatal=true');
      properties.fatal = true;
    }

    properties.exDescription = properties.description;

    const eventOptions = {
      exFatal: properties.fatal,
      exDescription: properties.description,
    };

    ga('send', 'exception', eventOptions);
    for (const accountName of this.dwAnalytics.settings.ga.additionalAccountNames) {
      ga(accountName + '.send', 'exception', eventOptions);
    }
  }

  /**
   * User Timings Event in GA
   * @name userTimings
   *
   * @param properties Comprised of the mandatory fields:
   *  - timingCategory (string)
   *  - timingVar (string)
   *  - timingValue (number)
   * Properties can also have the optional fields:
   *  - timingLabel (string)
   *
   * @link https://developers.google.com/analytics/devguides/collection/analyticsjs/user-timings
   */
  userTimings(properties: UserTimings): void {
    if (
      !properties ||
      !properties.timingCategory ||
      !properties.timingVar ||
      !properties.timingValue
    ) {
      console.error(
        'Properties timingCategory, timingVar, and timingValue are required to be set.',
      );
      return;
    }

    if (typeof ga !== 'undefined') {
      ga('send', 'timing', properties);
      for (const accountName of this.dwAnalytics.settings.ga.additionalAccountNames) {
        ga(accountName + '.send', 'timing', properties);
      }
    }
  }

  setUserId(userId: string): void {
    this.dwAnalytics.settings.ga.userId = userId;
  }

  private setAppId(appId: string): void {
    this.dwAnalytics.settings.ga.dimensions.appId = appId;
  }

  private setTenantId(tenantId: string): void {
    this.dwAnalytics.settings.ga.dimensions.tenantId = tenantId;
  }

  setUserProperties(properties: any): void {
    this.setDimensionsAndMetrics(properties);
  }

  private setDimensionsAndMetrics(properties: any): void {
    if (typeof ga === 'undefined') {
      return;
    }
    // clean previously used dimensions and metrics that will not be overriden
    this.dimensionsAndMetrics.forEach(elem => {
      if (!properties.hasOwnProperty(elem)) {
        ga('set', elem, undefined);

        this.dwAnalytics.settings.ga.additionalAccountNames.forEach(
          (accountName: string) => {
            ga(`${accountName}.set`, elem, undefined);
          },
        );
      }
    });
    this.dimensionsAndMetrics = [];

    // add custom dimensions and metrics
    Object.keys(properties).forEach(key => {
      if (
        key.lastIndexOf('dimension', 0) === 0 ||
        key.lastIndexOf('metric', 0) === 0
      ) {
        ga('set', key, properties[key]);

        this.dwAnalytics.settings.ga.additionalAccountNames.forEach(
          (accountName: string) => {
            ga(`${accountName}.set`, key, properties[key]);
          },
        );
        this.dimensionsAndMetrics.push(key);
      }
    });
  }

  static createGaSession(settings: {trackingId: string, domain: string}): void {
    document.write(
      `<script>
      (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
        (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
        m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
      })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

      ga("create", "'${settings.trackingId}'" , "'${settings.domain}'");
      </script>
      `
    );
  }
}
