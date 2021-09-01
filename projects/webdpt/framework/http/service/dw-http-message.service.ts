import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { DwHttpModule } from '../http.module';


@Injectable({
  providedIn: DwHttpModule
})
export class DwHttpMessageService {
  constructor() {
  }


  /**
   * framework默認訊息彈窗 - error
   *
   */
  error(message: string): Observable<boolean>;
  // tslint:disable-next-line: unified-signatures
  error(message: string, options: Object): Observable<boolean>;
  // tslint:disable-next-line: unified-signatures
  error(message: { dwTitle: string, dwContent: string }): Observable<boolean>;
  error(message: { dwTitle: string, dwContent: string }|string, options?: Object): Observable<boolean> {
    const showMsg = this.getMessage(message);

    return new Observable((observer): void => {
      alert(showMsg);
      observer.next(true);
      observer.complete();
    });

  }


  /**
   * framework默認訊息彈窗 - warring
   *
   */
  warning(message: string): Observable<boolean>;
  // tslint:disable-next-line: unified-signatures
  warning(message: string, options: Object): Observable<boolean>;
  // tslint:disable-next-line: unified-signatures
  warning(message: { dwTitle: string, dwContent: string }): Observable<boolean>;
  warning(message: { dwTitle: string, dwContent: string }|string, options?: Object): Observable<boolean> {
    const showMsg = this.getMessage(message);

    return new Observable((observer): void => {
      alert(showMsg);
      observer.next(true);
      observer.complete();
    });

  }


  /**
   * framework默認訊息彈窗 - confirm
   *
   */
  confirm(message: {dwTitle: string, dwContent: string}): Observable<boolean> {
    const showMsg = this.getMessage(message);

    return new Observable((observer): void => {
      if (confirm(showMsg)) {
        observer.next(true);
        observer.complete();
      } else {
        observer.next(false);
        observer.complete();
      }
    });

  }


  /**
   * framework默認訊息彈窗 - create
   *
   */
  create(message: 'success' | 'info' | 'warning' | 'error' | 'loading' | string, content: string):  Observable<boolean>;
  // tslint:disable-next-line: unified-signatures
  create(message: 'success' | 'info' | 'warning' | 'error' | 'loading' | string, content: string, options: Object):  Observable<boolean>;
  create(message: {
    dwTitle?: string, dwContent: string, dwClassName: string, dwMaskClosable: boolean, dwClosable: boolean,
    dwOkText: string, dwOkType: string, dwCancelText: string
  }): Observable<boolean>;
  create(message: {
    dwTitle?: string, dwContent: string, dwClassName: string, dwMaskClosable: boolean, dwClosable: boolean,
    dwOkText: string, dwOkType: string, dwCancelText: string
  } | string, content?: string, options?: Object): Observable<boolean> {

    let showMsg = null;
    if (typeof message === 'string') {
      showMsg = this.getMessage(content);
    }
    if (typeof message === 'object') {
      showMsg = this.getMessage(message);
    }

    return new Observable((observer): void => {
      if (confirm(showMsg)) {
        observer.next(true);
        observer.complete();
      } else {
        observer.next(false);
        observer.complete();
      }
    });

  }


  /**
   * 取得顯示訊息
   *
   */
  protected getMessage(message: {dwTitle?: string, dwContent: string} | string): string {

    const msg = [];
    let showMsg = 'error';

    if (typeof message === 'string') {
      showMsg = message;
    }

    if (typeof message === 'object') {
      if (message.hasOwnProperty('dwTitle')) {
        msg.push(message.dwTitle);
      }
      if (message.hasOwnProperty('dwContent')) {
        msg.push(message.dwContent);
      }
      if (msg.length > 0) {
        showMsg = msg.join('\n');
      }
    }

    return showMsg;
  }

}
