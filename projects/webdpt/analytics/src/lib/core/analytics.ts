import { Inject, Injectable, NgZone } from '@angular/core';

import { ReplaySubject } from 'rxjs';

import { DwAnalyticsSettings, DefaultConfig } from './analytics-config';
import { EventTrack, PageTrack, UserTimings } from './analytics-interfaces';
import { DwAnalyticsToken, ANGULARTICS2_TOKEN } from './analytics-token';
import { RouterlessTracking, TrackNavigationEnd } from './routerless';
import { DwSystemConfigService } from '@webdpt/framework/config';
import { DwAnalyticsGoogleTagManager } from '../providers/gtm/analytics-gtm';
import { DwAnalyticsBaiduTongji } from '../providers/baidu/analytics-baidu';
import { DOCUMENT } from '@angular/common';

@Injectable()
export class DwAnalytics {
  settings: DwAnalyticsSettings;

  pageTrack = new ReplaySubject<Partial<PageTrack>>(10);
  eventTrack = new ReplaySubject<Partial<EventTrack>>(10);
  exceptionTrack = new ReplaySubject<any>(10);
  setAlias = new ReplaySubject<string>(10);
  setUserId = new ReplaySubject<{ userId: string | number } | string>(10);
  setAppId = new ReplaySubject<string>(10);
  setTenantId = new ReplaySubject<string>(10);
  setCustomVar = new ReplaySubject<{ name: string, value: string, index?: number }>(10);
  setUserProperties = new ReplaySubject<any>(10);
  setUserPropertiesOnce = new ReplaySubject<any>(10);
  setSuperProperties = new ReplaySubject<any>(10);
  setSuperPropertiesOnce = new ReplaySubject<any>(10);
  userTimings = new ReplaySubject<UserTimings>(10);

  constructor(
    private tracker: RouterlessTracking,
    @Inject(ANGULARTICS2_TOKEN) setup: DwAnalyticsToken,
    @Inject(DOCUMENT) private document: any,
    private configService: DwSystemConfigService,
    zone: NgZone
  ) {
    const defaultConfig = new DefaultConfig();
    this.settings = {...defaultConfig, ...setup.settings};
    this.settings.pageTracking = {
      ...defaultConfig.pageTracking,
      ...setup.settings.pageTracking,
    };
    this.tracker
      .trackLocation(this.settings)
      .subscribe((event: TrackNavigationEnd) =>
        this.trackUrlChange(event.url, event.title),
      );

    this.configService.get('analytics').subscribe(
      analytics => {
        if (analytics) {
          if (analytics.gtm !== '' && analytics.gtm !== '@ANALYTICS_GTM@') {
            const gtm = new DwAnalyticsGoogleTagManager(this, analytics.gtm);
          }
          if (analytics.baidu !== '' && analytics.baidu !== '@ANALYTICS_BAIDU@') {
            const baidu = new DwAnalyticsBaiduTongji(this, analytics.baidu);
          }
        }
      }
    );
  }

  protected trackUrlChange(url: string, title?: string): void {
    if (this.settings.pageTracking.autoTrackVirtualPages && !this.matchesExcludedRoute(url)) {
      const clearedUrl = this.clearUrl(url);
      let path: string;
      if (this.settings.pageTracking.basePath.length) {
        path = this.settings.pageTracking.basePath + clearedUrl;
      } else {
        path = this.tracker.prepareExternalUrl(clearedUrl);
      }
      this.pageTrack.next({path, title});
    }
  }

  /**
   * Use string literals or regular expressions to exclude routes
   * from automatic pageview tracking.
   *
   * @param url location
   */
  protected matchesExcludedRoute(url: string): boolean {
    for (const excludedRoute of this.settings.pageTracking.excludedRoutes) {
      const matchesRegex = excludedRoute instanceof RegExp && excludedRoute.test(url);
      if (matchesRegex || url.indexOf(<string>excludedRoute) !== -1) {
        return true;
      }
    }
    return false;
  }

  /**
   * Removes id's from tracked route.
   *  EX: `/project/12981/feature` becomes `/project/feature`
   *
   * @param url current page path
   */
  protected clearUrl(url: string): string {
    if (this.settings.pageTracking.clearIds || this.settings.pageTracking.clearQueryParams) {
      return url
        .split('/')
        .map(part => this.settings.pageTracking.clearQueryParams ? part.split('?')[0] : part)
        .map(part => this.settings.pageTracking.clearHash ? part.split('#')[0] : part)
        .filter(part => !this.settings.pageTracking.clearIds || !part.match(this.settings.pageTracking.idsRegExp))
        .join('/');
    }
    return url;
  }
}
