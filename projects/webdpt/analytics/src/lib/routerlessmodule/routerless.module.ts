import { ModuleWithProviders, NgModule, Provider } from '@angular/core';
import { ANGULARTICS2_TOKEN } from '../core/analytics-token';
import { DwAnalyticsOnModule } from '../core/analyticsOn';
import { DwAnalyticsSettings } from '../core/analytics-config';
import { RouterlessTracking } from '../core/routerless';
import { DwAnalytics } from '../core/analytics';


@NgModule({
  imports: [DwAnalyticsOnModule],
})
export class DwAnalyticsRouterlessModule {
  static forRoot(
    providers: Provider[],
    settings: Partial<DwAnalyticsSettings> = {},
  ): ModuleWithProviders<DwAnalyticsRouterlessModule> {
    return {
      ngModule: DwAnalyticsRouterlessModule,
      providers: [
        { provide: ANGULARTICS2_TOKEN, useValue: { providers, settings } },
        ...providers,
      ],
    };
  }
}
