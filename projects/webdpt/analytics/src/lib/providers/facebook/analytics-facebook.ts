import { Injectable } from '@angular/core';
import { DwAnalytics } from '../../core/analytics';

// @ts-ignore
declare const fbq: facebook.Pixel.Event;

const facebookEventList = [
  'ViewContent',
  'Search',
  'AddToCart',
  'AddToWishlist',
  'InitiateCheckout',
  'AddPaymentInfo',
  'Purchase',
  'Lead',
  'CompleteRegistration',
];

@Injectable({ providedIn: 'root' })
export class DwAnalyticsFacebook {
  constructor(private dwAnalytics: DwAnalytics) {
    this.dwAnalytics.eventTrack.subscribe(x => this.eventTrack(x.action, x.properties));
  }

  /**
   * Send interactions to the Pixel, i.e. for event tracking in Pixel
   *
   * @param action action associated with the event
   */
  eventTrack(action: string, properties: any = {}): void {
    if (typeof fbq === 'undefined') {
      return;
    }
    if (facebookEventList.indexOf(action) === -1) {
      return fbq('trackCustom', action, properties);
    }
    return fbq('track', action, properties);
  }
}
