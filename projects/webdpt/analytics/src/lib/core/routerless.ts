import { BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs';

import { DwAnalyticsSettings } from './analytics-config';
import { Injectable } from '@angular/core';

export interface TrackNavigationEnd {
  url: string;
  title?: string;
}

@Injectable({providedIn: 'root'})
export class RouterlessTracking {
  trackLocation(settings: DwAnalyticsSettings): Observable<TrackNavigationEnd> {
    return new BehaviorSubject<TrackNavigationEnd>({ url: '/' });
  }
  prepareExternalUrl(url: string): string {
    return url;
  }
}
