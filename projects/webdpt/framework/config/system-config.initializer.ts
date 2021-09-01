import { Injectable, isDevMode } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { DwSystemConfigService } from './config.service';

export const initStore = (initializer: DwSystemConfigInitializer): any => (): any => {
  return initializer.load();
};


@Injectable()
export class DwSystemConfigInitializer {
  constructor(
    private configService: DwSystemConfigService,
    private http: HttpClient
  ) {
  }

  load(): Promise<any> {
    const apiConfigUrl = isDevMode() ? 'api.dev.json' : 'api.json';
    const timestamp = new Date().getTime();
    return this.http.get(`assets/${apiConfigUrl}?${timestamp}`)
      .toPromise()
      .then(result => {
        this.configService.setConfig(result);
      })
      .catch(error => {
        console.error(`can not found ${apiConfigUrl}`);
      });
  }
}
