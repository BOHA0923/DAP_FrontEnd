import { Injectable, Inject, Self } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs';

import { DwHttpClient } from '@webdpt/framework/http';
import { DwIamHttpErrorHandler } from './iam-http-error-handler';
import { DwHttpRequestUrlService } from '@webdpt/framework/http';
import { DwSystemConfigService } from '@webdpt/framework/config';
import { DW_AUTH_TOKEN } from '@webdpt/framework/auth';
import { DW_APP_AUTH_TOKEN, DW_SYSTEM_CONFIG } from '@webdpt/framework/config';
import { DwHttpLoadMaskService } from '@webdpt/framework/http';
import { DwHttpModule } from '@webdpt/framework/http';


@Injectable({
  providedIn: DwHttpModule
})
export class DwIamHttpClient extends DwHttpClient {

  constructor(
    public dwHttpRequestUrlService: DwHttpRequestUrlService,
    public configService: DwSystemConfigService,
    @Inject(DW_AUTH_TOKEN) private authToken: any,
    @Self() private iamHttpError: DwIamHttpErrorHandler,
    @Inject(DW_APP_AUTH_TOKEN) private dwAppAuthToken: string,
    protected dwHttpLoadMaskService: DwHttpLoadMaskService
  ) {
    super(dwHttpRequestUrlService, dwHttpLoadMaskService);

    this.getApiUrl().subscribe(
      (url: string) => {
        this.api = url;
      }
    );
  }

  public getApiUrl(): Observable<string> {
    return this.configService.get('iamUrl');
  }

  protected get defaultHeaders(): { [header: string]: string | string[] } {
    const token = (this.authToken.token) ? this.authToken.token : '';

    return {
      'digi-middleware-auth-app': this.dwAppAuthToken,
      'digi-middleware-auth-user': token,
      'Client-Agent': 'webplatform/' + DW_SYSTEM_CONFIG.dwVersion
    };
  }

  protected errorHandler(event: HttpErrorResponse): void {
    if (event.error && event.error.message) {
      this.iamHttpError.handlerError(event);
    }
  }
}
