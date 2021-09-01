import {
  APP_INITIALIZER,
  ModuleWithProviders,
  NgModule,
  Provider,
} from '@angular/core';

import { DwAngularRouterTracking } from './angular-router';
import { DwAnalytics } from './analytics';
import { DwAnalyticsSettings } from './analytics-config';
import { ANGULARTICS2_TOKEN } from './analytics-token';
import { DwAnalyticsOn, DwAnalyticsOnModule } from './analyticsOn';
import { RouterlessTracking } from './routerless';


@NgModule({
  imports: [DwAnalyticsOnModule],
  exports: [DwAnalyticsOn],
})
export class DwAnalyticsModule {
  static forRoot(
    settings: Partial<DwAnalyticsSettings> = {},
  ): ModuleWithProviders<DwAnalyticsModule> {
    return {
      ngModule: DwAnalyticsModule,
      providers: [
        { provide: ANGULARTICS2_TOKEN, useValue: { providers: [], settings } },
        DwAnalytics,
        { provide: RouterlessTracking, useClass: DwAngularRouterTracking }
      ],
    };
  }
}
