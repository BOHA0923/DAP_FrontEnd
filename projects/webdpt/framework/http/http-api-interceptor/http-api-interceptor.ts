import { Injectable, Inject } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DwSystemConfigService } from '@webdpt/framework/config';


/**
 * Http API 攔截器
 *
 * @export
 */
@Injectable()
export class DwHttpApiInterceptor implements HttpInterceptor {
  apiUrl: string;
  constructor(
    private configService: DwSystemConfigService
  ) {
    this.configService.get('apiUrl').subscribe(
      url => this.apiUrl = url
    );
  }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // 攔截請求：串接網址
    const url = req.url;
    const isExternalURL = (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('//') || url.startsWith('assets/'));
    if (!isExternalURL) {
      req = req.clone({
        url: this.apiUrl + url
      });
    }

    return next.handle(req).pipe(
      map(
        (event: any) => {

          // 攔截響應：轉換成API的格式
          if (event instanceof HttpResponse) {
            const resp: HttpResponse<any> = event;
            event = event.clone({ body: isExternalURL ? resp.body : resp.body.response });
          }

          return event;
        }
      )
    );
  }
}
