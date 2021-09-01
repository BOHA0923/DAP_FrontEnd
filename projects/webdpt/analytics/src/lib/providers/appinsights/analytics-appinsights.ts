import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import {
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
} from '@angular/router';
import { filter } from 'rxjs/operators';
import { AppInsightsSettings } from '../../core/analytics-config';
import { DwAnalytics } from '../../core/analytics';

// @ts-ignore
declare const appInsights: Microsoft.ApplicationInsights.IAppInsights;

export class AppInsightsDefaults implements AppInsightsSettings {
  userId = null;
}

@Injectable({ providedIn: 'root' })
export class DwAnalyticsAppInsights {
  loadStartTime: number = null;
  loadTime: number = null;

  metrics: { [name: string]: number } = null;
  dimensions: { [name: string]: string } = null;
  measurements: { [name: string]: number } = null;

  constructor(
    private dwAnalytics: DwAnalytics,
    private title: Title,
    private router: Router,
  ) {
    if (typeof appInsights === 'undefined') {
      console.warn('appInsights not found');
    }

    const defaults = new AppInsightsDefaults;
    // Set the default settings for this module
    this.dwAnalytics.settings.appInsights = { ...defaults, ...this.dwAnalytics.settings.appInsights };
    this.dwAnalytics.pageTrack.subscribe((x) => this.pageTrack(x.path));
    this.dwAnalytics.eventTrack.subscribe((x) => this.eventTrack(x.action, x.properties));
    this.dwAnalytics.exceptionTrack.subscribe((x) => this.exceptionTrack(x));
    this.dwAnalytics.setUserId.subscribe((x: string) => this.setUserId(x));
    this.dwAnalytics.setUserProperties.subscribe((x) => this.setUserProperties(x));
    this.router.events
      .pipe(filter(event => event instanceof NavigationStart))
      .subscribe(event => this.startTimer());

    this.router.events
      .pipe(filter(event => event instanceof NavigationError || event instanceof NavigationEnd))
      .subscribe(error => this.stopTimer());
  }

  startTimer(): void {
    this.loadStartTime = Date.now();
    this.loadTime = null;
  }

  stopTimer(): void {
    this.loadTime = Date.now() - this.loadStartTime;
    this.loadStartTime = null;
  }

  /**
   * Page Track in Baidu Analytics
   *
   * @param path - Location 'path'
   *
   * @link https://github.com/Microsoft/ApplicationInsights-JS/blob/master/API-reference.md#trackpageview
   */
  pageTrack(path: string): void {
    appInsights.trackPageView(
      this.title.getTitle(),
      path,
      this.dimensions,
      this.metrics,
      this.loadTime,
    );
  }

  /**
   * Log a user action or other occurrence.
   *
   * @param name Name to identify this event in the portal.
   * @param properties Additional data used to filter events and metrics in the portal. Defaults to empty.
   *
   * @link https://github.com/Microsoft/ApplicationInsights-JS/blob/master/API-reference.md#trackevent
   */
  eventTrack(name: string, properties: { [name: string]: string }): void {
    appInsights.trackEvent(name, properties, this.measurements);
  }

  /**
   * Exception Track Event in GA
   *
   * @param properties - Comprised of the mandatory fields 'appId' (string), 'appName' (string) and 'appVersion' (string) and
   * optional fields 'fatal' (boolean) and 'description' (string), error
   *
   * @link https://github.com/Microsoft/ApplicationInsights-JS/blob/master/API-reference.md#trackexception
   */
  exceptionTrack(properties: any): void {
    const description = properties.event || properties.description || properties;

    appInsights.trackException(description);
  }

  /**
   *
   * @param userId
   *
   * @link https://github.com/Microsoft/ApplicationInsights-JS/blob/master/API-reference.md#setauthenticatedusercontext
   */
  setUserId(userId: string): void {
    this.dwAnalytics.settings.appInsights.userId = userId;
    appInsights.setAuthenticatedUserContext(userId);
  }

  setUserProperties(properties: Partial<{ userId: string, accountId: string }>): void {
    if (properties.userId) {
      this.dwAnalytics.settings.appInsights.userId = properties.userId;
    }
    if (properties.accountId) {
      appInsights.setAuthenticatedUserContext(
        this.dwAnalytics.settings.appInsights.userId,
        properties.accountId,
      );
    } else {
      appInsights.setAuthenticatedUserContext(
        this.dwAnalytics.settings.appInsights.userId,
      );
    }
  }
}
