import { InjectionToken, Provider } from '@angular/core';

import { DwAnalyticsSettings } from './analytics-config';

export interface DwAnalyticsToken {
  providers: Provider[];
  settings: Partial<DwAnalyticsSettings>;
}

export const ANGULARTICS2_TOKEN = new InjectionToken<DwAnalyticsToken>('ANGULARTICS2');
