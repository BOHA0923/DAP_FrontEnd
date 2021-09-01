import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs';

import { DwHttpClient } from '@webdpt/framework/http';
import { DwDmcHttpErrorHandler } from './dmc-http-error-handler';
import { DwSystemConfigService } from '@webdpt/framework/config';
import { DwHttpRequestUrlService } from '@webdpt/framework/http';
import { DwHttpLoadMaskService } from '@webdpt/framework/http';
import { DwHttpModule } from '@webdpt/framework/http';


@Injectable({
  providedIn: DwHttpModule
})
export class DwDmcHttpClient extends DwHttpClient {

  constructor(
    public dwHttpRequestUrlService: DwHttpRequestUrlService,
    public configService: DwSystemConfigService,
    private dmcHttpError: DwDmcHttpErrorHandler,
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
    return this.configService.get('dmcUrl');
  }

  protected get defaultHeaders(): { [header: string]: string | string[] } {
    return { };
  }

  protected errorHandler(event: HttpErrorResponse): void {
    if (event.error && event.error.message) {
      this.dmcHttpError.handlerError(event);
    }
  }
}
