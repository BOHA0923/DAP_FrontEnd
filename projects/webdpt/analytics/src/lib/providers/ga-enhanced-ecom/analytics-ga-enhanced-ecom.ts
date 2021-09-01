import { Injectable } from '@angular/core';
import {
  GaEnhancedEcomAction,
  GaEnhancedEcomActionFieldObject,
  GaEnhancedEcomImpressionFieldObject,
  GaEnhancedEcomProductFieldObject,
} from './analytics-ga-enhanced-ecom-options';

// @ts-ignore
declare var ga: UniversalAnalytics.ga;

@Injectable({ providedIn: 'root' })
export class DwAnalyticsGoogleAnalyticsEnhancedEcommerce {
  /**
   * Add impression in GA enhanced ecommerce tracking
   * @link https://developers.google.com/analytics/devguides/collection/analyticsjs/enhanced-ecommerce#measuring-activities
   */
  ecAddImpression(properties: Partial<GaEnhancedEcomImpressionFieldObject>): void {
    ga('ec:addImpression', properties);
  }

  /**
   * Add product in GA enhanced ecommerce tracking
   * @link https://developers.google.com/analytics/devguides/collection/analyticsjs/ecommerce
   */
  ecAddProduct(product: Partial<GaEnhancedEcomProductFieldObject>): void {
    ga('ec:addProduct', product);
  }

  /**
   * Set action in GA enhanced ecommerce tracking
   * @link https://developers.google.com/analytics/devguides/collection/analyticsjs/ecommerce
   */
  ecSetAction(
    action: GaEnhancedEcomAction,
    properties: Partial<GaEnhancedEcomActionFieldObject>,
  ): void {
    ga('ec:setAction', action, properties);
  }
}
