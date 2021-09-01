import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';

import { IDwRequestOptions } from './interface/client.interface';
import { DwSystemHttpErrorHandler } from './system-error';
import { DwHttpRequestUrlService } from './service/http-request-url.service';
import { DwHttpLoadMaskService } from './service/dw-http-load-mask.service';

@Injectable()
export abstract class DwHttpClient {
  protected systemHttpError: DwSystemHttpErrorHandler;
  protected http: HttpClient;
  protected api = '';
  private throwawayHeader: { [header: string]: string | string[] };

  public constructor(
    public dwHttpRequestUrlService: DwHttpRequestUrlService,
    protected dwHttpLoadMaskService: DwHttpLoadMaskService
  ) {
    this.systemHttpError = inject(DwSystemHttpErrorHandler);
    this.http = inject(HttpClient);
    // this.initialize();
  }

  // protected abstract initialize(): void;

  protected errorHandler(error: HttpErrorResponse): void { }
  protected responseIntercept(body: any): any {
    return body;
  }

  protected get defaultHeaders(): { [header: string]: string | string[] } {
    return {};
  }

  protected get defaultParams(): { [param: string]: string } {
    return {};
  }

  public setThrowawayHeader(header: { [header: string]: string | string[] }): void {
    this.throwawayHeader = header;
  }

  private addDefaultOption(options?: IDwRequestOptions): any {
    const localOptions = options || {};

    let headers: HttpHeaders;
    if (localOptions.headers instanceof HttpHeaders) {
      headers = localOptions.headers;
    } else {
      headers = new HttpHeaders(localOptions.headers);
    }

    const localHeaders = this.throwawayHeader || this.defaultHeaders;
    this.throwawayHeader = undefined;

    headers = Object.keys(localHeaders)
      .reduce((acc, name) => (acc.has(name)) ? acc : acc.set(name, localHeaders[name]), headers);

    let params: HttpParams;
    if (!!localOptions.params) {
      if (localOptions.params instanceof HttpParams) {
        params = localOptions.params;
      } else {
        params = new HttpParams({ fromObject: localOptions.params });
      }
    }

    params = Object.keys(this.defaultParams)
      .reduce((acc, name) => (acc.has(name)) ? acc : acc.set(name, this.defaultParams[name]), params);


    return {
      headers,
      observe: localOptions.observe,
      params,
      body: localOptions.body,
      reportProgress: localOptions.reportProgress,
      responseType: localOptions.responseType,
      withCredentials: localOptions.withCredentials
    };
  }

  private requestProcess(request: Observable<any>, options?: IDwRequestOptions): Observable<any> {
    const loadingMaskId = this.dwHttpLoadMaskService.showMask(options);

    return request.pipe(
      tap(
        response => {
          this.dwHttpLoadMaskService.hideMask(loadingMaskId);
          return response;
        },
        error => {
          this.dwHttpLoadMaskService.hideMask(loadingMaskId);
          this.systemHttpError.handlerError(error);
          this.errorHandler(error);
        }
      ),
      map(response => this.responseIntercept(response))
      //// request掛掉時,可以在取消註解,測試假的HttpErrorResponse
      // catchError(err => {
      //   throw new HttpErrorResponse({error:{}});
      // }),
    );
  }

  public request<T>(method: string, url: string, options?: IDwRequestOptions): Observable<any> {
    const requestOptions = this.addDefaultOption(options);
    const requestUrl = this.dwHttpRequestUrlService.getUrl(this.api, url);
    const request = this.http.request<T>(method, requestUrl, requestOptions);
    return this.requestProcess(request, options);
  }

  public get<T>(url: string, options?: IDwRequestOptions): Observable<any> {
    const requestOptions = this.addDefaultOption(options);
    const requestUrl = this.dwHttpRequestUrlService.getUrl(this.api, url);
    const request = this.http.get<T>(requestUrl, requestOptions);
    return this.requestProcess(request, options);
  }

  public post<T>(url: string, body: Object, options?: IDwRequestOptions): Observable<any> {
    const requestOptions = this.addDefaultOption(options);
    const requestUrl = this.dwHttpRequestUrlService.getUrl(this.api, url);
    const request = this.http.post<T>(requestUrl, body, requestOptions);
    return this.requestProcess(request, options);
  }

  public put<T>(url: string, body: Object, options?: IDwRequestOptions): Observable<any> {
    const requestOptions = this.addDefaultOption(options);
    const requestUrl = this.dwHttpRequestUrlService.getUrl(this.api, url);
    const request = this.http.put<T>(requestUrl, body, requestOptions);
    return this.requestProcess(request, options);
  }

  public delete<T>(url: string, options: IDwRequestOptions): Observable<any> {
    const requestOptions = this.addDefaultOption(options);
    const requestUrl = this.dwHttpRequestUrlService.getUrl(this.api, url);
    const request = this.http.delete<T>(requestUrl, requestOptions);
    return this.requestProcess(request, options);
  }
}
