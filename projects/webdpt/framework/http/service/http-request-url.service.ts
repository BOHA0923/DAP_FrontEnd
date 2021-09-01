import { Injectable } from '@angular/core';

import { DwHttpModule } from '../http.module';


@Injectable({
  providedIn: DwHttpModule
})
export class DwHttpRequestUrlService {

  constructor() {
  }

  public getUrl(apiUrl: string, requestUrl: string): string {
    let url = apiUrl;

    if (requestUrl.startsWith('http://') || requestUrl.startsWith('https://')
      || requestUrl.startsWith('//') || requestUrl.startsWith('assets/')) {

      url = requestUrl;
    } else if (requestUrl) {
      url = apiUrl + '/' + requestUrl;
    }

    return url;
  }
}
