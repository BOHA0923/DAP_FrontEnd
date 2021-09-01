import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

import { filter } from 'rxjs/operators';
import { map } from 'rxjs/operators';

import { Observable } from 'rxjs';
import { RouterlessTracking, TrackNavigationEnd } from './routerless';
import { delay } from 'rxjs/operators';
import { Title } from '@angular/platform-browser';

/**
 * Track Route changes for applications using Angular's
 * default router
 *
 * @link https://angular.io/api/router/Router
 */
@Injectable({ providedIn: 'root' })
export class DwAngularRouterTracking implements RouterlessTracking {
  constructor(
    private router: Router,
    private location: Location,
    private title: Title
  ) {}

  trackLocation(settings: any): Observable<TrackNavigationEnd> {
    return this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      filter(() => !settings.developerMode),
      map((e: NavigationEnd) => {
        return { url: e.urlAfterRedirects, title: this.title.getTitle() };
      }),
      delay(0),
    );
  }

  prepareExternalUrl(url: string): string {
    return this.location.prepareExternalUrl(url);
  }
}
