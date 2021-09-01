import { Injectable, Injector } from '@angular/core';
import { DwAnalytics } from '../../core/analytics';


declare var _hmt: any;

// @Injectable()
export class DwAnalyticsBaiduTongji {
  constructor(private dwAnalytics: DwAnalytics, trackingId: any) {
    // dwAnalytics: DwAnalytics;
    // constructor(injector: Injector) {
    // this.dwAnalytics = injector.get(DwAnalytics);
    if (typeof _hmt === 'undefined') {
      _hmt = (<any>window)._hmt = [];
    } else {
      _hmt.push(['_setAutoPageview', false]);
    }
    // this.dwAnalytics = injector.get(DwAnalytics);
    this.dwAnalytics.pageTrack.subscribe((x) => this.pageTrack(x.path));
    this.dwAnalytics.eventTrack.subscribe((x) => this.eventTrack(x.action, x.properties));
    this.dwAnalytics.setAppId.subscribe((x: string) => this.setAppId(x));
    this.dwAnalytics.setTenantId.subscribe(x => this.setTenantId(x));
    this.dwAnalytics.setUserId.subscribe((x: string) => this.setUserId(x));
    this.dwAnalytics.setCustomVar.subscribe((x) => this.setCustomVar(x));
    // this.dwAnalytics.setUserProperties.subscribe((x) => this.setUserProperties(x));
    DwAnalyticsBaiduTongji.createSession({ trackingId });
  }

  /**
   * Page Track in Baidu Analytics
   *
   * @param path Required url 'path'
   *
   * @link http://tongji.baidu.com/open/api/more?p=ref_trackPageview
   */
  pageTrack(path: string): void {
    if (typeof _hmt !== 'undefined' && _hmt) {
      _hmt.push(['_trackPageview', path]);
    }
  }

  /**
   * Track Event in Baidu Analytics
   *
   * @param action Name associated with the event
   * @param properties Comprised of:
   *  - 'category' (string)
   *  - 'opt_label' (string)
   *  - 'opt_value' (string)
   *
   * @link http://tongji.baidu.com/open/api/more?p=ref_trackEvent
   */
  eventTrack(action: string, properties: any): void {
    // baidu analytics requires category
    if (!properties || !properties.category) {
      properties = properties || {};
      properties.category = 'Event';
      properties.opt_label = 'default';
      properties.opt_value = 'default';
    }

    if (typeof _hmt !== 'undefined' && _hmt) {
      _hmt.push([
        '_trackEvent',
        properties.category,
        action,
        properties.opt_label,
        properties.opt_value,
      ]);
    }
  }

  private setAppId(appId: string): void {
    _hmt.push(['_setCustomVar', 1, 'appId', appId, 3]);
  }

  private setTenantId(tenantId: string): void {
    _hmt.push(['_setCustomVar', 2, 'tenantId', tenantId, 3]);
  }

  private setUserId(userId: string): void {
    // set default custom variables name to 'identity' and 'value'
    _hmt.push(['_setCustomVar', 3, 'userId', userId, 3]);
  }

  private setCustomVar(x: { name: string; value: string; index?: number, scope?: number }): void {
    _hmt.push(['_setCustomVar', x.index, x.name, x.value, (x.scope ? x.scope : 3)]);
  }

  setUserProperties(properties: any): void {
    _hmt.push(['_setCustomVar', 2, 'user', JSON.stringify(properties)]);
  }

  static createSession(settings: { trackingId: string }): void {
    // @ts-ignore
    // tslint:disable-next-line:no-shadowed-variable

    (function (): void {
      const s = document.getElementsByTagName('script')[0];
      const hm = document.createElement('script');
      hm.async = true;
      hm.src = 'https://hm.baidu.com/hm.js?' + settings.trackingId;
      s.parentNode.insertBefore(hm, s);
    })();

  }

}
