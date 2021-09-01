import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DwMessageService } from 'ng-quicksilver/message';
import { DwModalService } from 'ng-quicksilver/modal';
import { DwButtonType } from 'ng-quicksilver/button';

import { DwHttpMessageService } from '@webdpt/framework/http';
import { DwExceptionModule } from './exception.module';

@Injectable({
  providedIn: DwExceptionModule
})
export class DwHttpMessageServiceModalService extends DwHttpMessageService {
  constructor(
    private modalService: DwModalService,
    private messageService: DwMessageService
  ) {
    super();
  }


  /**
   * DwModalService、DwMessageService 的訊息彈窗 - error
   *
   */
  error(message: string): Observable<boolean>;
  // tslint:disable-next-line: unified-signatures
  error(message: string, options: Object): Observable<boolean>;
  // tslint:disable-next-line: unified-signatures
  error(message: { dwTitle: string, dwContent: string }): Observable<boolean>;
  error(message: {dwTitle: string, dwContent: string} | string, options?: Object): Observable<boolean> {

    return new Observable((observer): void => {
      if (typeof message === 'string') {
        this.messageService.error(message, options);
      }
      if (typeof message === 'object') {
        this.modalService.error(message);
      }
      observer.next(true);
      observer.complete();
    });

  }


  /**
   * DwModalService、DwMessageService 的訊息彈窗 - warring
   *
   */
  warning(message: string): Observable<boolean>;
  // tslint:disable-next-line: unified-signatures
  warning(message: string, options: Object): Observable<boolean>;
  // tslint:disable-next-line: unified-signatures
  warning(message: { dwTitle: string, dwContent: string }): Observable<boolean>;
  warning(message: {dwTitle: string, dwContent: string} | string, options?: Object): Observable<boolean> {

    return new Observable((observer): void => {
      if (typeof message === 'string') {
        this.messageService.warning(message, options);
      }
      if (typeof message === 'object') {
        this.modalService.warning(message);
      }

      observer.next(true);
      observer.complete();
    });

  }


  /**
   * DwModalService 的訊息彈窗 - confirm
   *
   */
  confirm(message: {dwTitle: string, dwContent: string}): Observable<boolean> {

    return new Observable((observer): void => {
      Object.assign(message, {
        dwOnOk: (): any => {
          observer.next(true);
          observer.complete();
        },
        dwOnCancel: (): any => {
          observer.next(false);
          observer.complete();
        }
      });

      this.modalService.confirm(message);

    });

  }


  /**
   * DwModalService、DwMessageService 的訊息彈窗 - create
   *
   */
  create(message: 'success' | 'info' | 'warning' | 'error' | 'loading' | string, content: string):  Observable<boolean>;
  // tslint:disable-next-line: unified-signatures
  create(message: 'success' | 'info' | 'warning' | 'error' | 'loading' | string, content: string, options: Object):  Observable<boolean>;
  create(message: {
    dwTitle?: string, dwContent: string, dwClassName: string, dwMaskClosable: boolean, dwClosable: boolean,
    dwOkText: string, dwOkType: DwButtonType, dwCancelText: string
  }): Observable<boolean>;
  create(message: {
    dwTitle?: string, dwContent: string, dwClassName: string, dwMaskClosable: boolean, dwClosable: boolean,
    dwOkText: string, dwOkType: DwButtonType, dwCancelText: string
  } | string, content?: string, options?: Object): Observable<boolean> {

    return new Observable((observer): void => {
      if (typeof message === 'string') {
        this.messageService.create(message, content, options);
        observer.next(true);
        observer.complete();
      }

      if (typeof message === 'object') {
        Object.assign(message, {
          dwOnOk: (): any => {
            observer.next(true);
            observer.complete();
          },
          dwOnCancel: (): any => {
            observer.next(false);
            observer.complete();
          }
        });

        this.modalService.create(message);
      }
    });

  }

}
