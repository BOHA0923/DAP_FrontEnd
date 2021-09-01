import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { TranslateService } from '@ngx-translate/core';

import { DwLanguagePreService } from '@webdpt/framework/program-info';
import { DwHttpMessageService } from '@webdpt/framework/http';


/**
 * 路由檢查權限的訊息
 *
 * @export
 */
@Injectable()
export class DwDapAuthorizedMessageService {
  constructor(
    private translateService: TranslateService,
    private dwLanguagePreService: DwLanguagePreService,
    private dwMessageService: DwHttpMessageService
    // private location: Location,
  ) {
  }

  /**
   * 訊息
   *
   * @param isActive 是否有權限
   * @param dwAuthId 權限編號
   */
  public canActivateMessage(isActive: boolean, dwAuthId: string): void {
    if (!isActive) {
      this.messageContent(dwAuthId).subscribe(
        (msgCntent: string) => {
          this.dwMessageService.warning({
            dwTitle: this.translateService.instant('dw-http-error-403'), // 抱歉，您無權訪問該頁面
            dwContent: msgCntent,
          }).subscribe(
            (ret) => {
              this.closeMessage();
            }
          );
        }
      );
    }
  }

  public messageContent(dwAuthId: string): Observable<string> {
    return Observable.create(
      (observer: any) => {
        let msgCntent = '';

        // 作業或子頁面名稱
        let lable: string = this.translateService.instant(this.dwLanguagePreService.page + dwAuthId);
        lable = lable.toString();

        if (lable.indexOf(this.dwLanguagePreService.page) !== 0) {
          msgCntent = lable + '(' + dwAuthId + ')';
        } else {
          lable = this.translateService.instant(this.dwLanguagePreService.program + dwAuthId);

          if (lable.indexOf(this.dwLanguagePreService.program) !== 0) {
            msgCntent = lable + '(' + dwAuthId + ')';
          }
        }

        observer.next(msgCntent);
        observer.complete();
      }
    );
  }

  public closeMessage(): void {
    // ssologin 無作業權限時，重導向應用首頁
    // if (this.location.path().indexOf('sso-login') >= 0) {
    //   this.router.navigateByUrl(this.defaultApp);
    // }
  }
}
