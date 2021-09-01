import {
  ModuleWithProviders,
  NgModule,
  Provider,
} from '@angular/core';

import { UIRouterTracking } from './uirouter';
import { DwAnalyticsOnModule } from '../core/analyticsOn';
import { DwAnalyticsSettings } from '../core/analytics-config';
import { ANGULARTICS2_TOKEN } from '../core/analytics-token';
import { DwAnalytics } from '../core/analytics';
import { RouterlessTracking } from '../core/routerless';


@NgModule({
  imports: [DwAnalyticsOnModule],
})
export class DwAnalyticsUirouterModule {
  static forRoot(
    providers: Provider[],
    settings: Partial<DwAnalyticsSettings> = {},
  ): ModuleWithProviders<DwAnalyticsUirouterModule> {
    return {
      ngModule: DwAnalyticsUirouterModule,
      providers: [
        { provide: ANGULARTICS2_TOKEN, useValue: { providers, settings } },
        DwAnalytics,
        { provide: RouterlessTracking, useClass: UIRouterTracking },
        ...providers,
      ],
    };
  }
}
