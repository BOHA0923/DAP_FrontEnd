import { Injectable, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Observable } from 'rxjs';

import { DwHttpClient } from '@webdpt/framework/http';
import { DwOmHttpErrorHandler } from './om-http-error-handler';
import { DwSystemConfigService } from '@webdpt/framework/config';
import { DW_APP_AUTH_TOKEN } from '@webdpt/framework/config';
import { DW_AUTH_TOKEN } from '@webdpt/framework/auth';
import { DwRouterInfoService } from '@webdpt/framework/operation';
import { IDwProgram } from '@webdpt/framework/operation';
import { DwProgramInfoListJsonService } from '@webdpt/framework/operation';
import { DwHttpRequestUrlService } from '@webdpt/framework/http';
import { DwHttpLoadMaskService } from '@webdpt/framework/http';
import { DwOmModule } from './om.module';


@Injectable({
  providedIn: DwOmModule
})
export class DwOmHttpClient extends DwHttpClient {
  constructor(
    public dwHttpRequestUrlService: DwHttpRequestUrlService,
    public configService: DwSystemConfigService,
    @Inject(DW_APP_AUTH_TOKEN) private dwAppAuthToken: string,
    @Inject(DW_AUTH_TOKEN) private authToken: any,
    private omHttpError: DwOmHttpErrorHandler,
    private activatedRoute: ActivatedRoute,
    private dwRouterInfoService: DwRouterInfoService,
    private programInfoListJsonService: DwProgramInfoListJsonService,
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
    return this.configService.get('omUrl');
  }

  protected get defaultHeaders(): { [header: string]: string | string[] } {
    const token = (this.authToken.token) ? this.authToken.token : '';

    let programId = this.dwRouterInfoService.routerProgramId(this.activatedRoute);
    let moduleId = '';

    if (programId === null) {
      programId = 'default';
      moduleId = 'default';
    } else {
      const program: IDwProgram = this.programInfoListJsonService.programListJsonMap[programId];

      if (program) {
        moduleId = program.module;
      } else {
        // TODO：報表不在作業清單，找不到模組，API傳入模組'default'必須也讓programId = 'default'，才能通過請求
        programId = 'default';
        moduleId = 'default';
      }
    }

    return {
      'digi-middleware-auth-app': this.dwAppAuthToken,
      'token': token,
      'Module-Name': moduleId, // 模組編號
      'Program-Code': programId // 作業編號
    };
  }

  protected responseIntercept(body: any): any {
    if (body && body.response) {
      return body.response;
    } else {
      return body;
    }
  }

  protected errorHandler(event: any): void {
    if (event.error && event.error.status) {
      this.omHttpError.handlerError(event);
    }
  }
}
