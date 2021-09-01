import { Injectable, Injector } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { interval, Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

import { DwHttpMessageService } from '@webdpt/framework/http';


@Injectable()
export class DwServiceWorkerUpdateService {
  notifyInterval: number = 5 * 60 * 1000; // 5分鐘提醒一次
  modalService: DwHttpMessageService;
  private modal: Observable<boolean>;

  constructor(
    private updates: SwUpdate,
    private injector: Injector,
    private translate: TranslateService,
  ) {

  }

  initialize(millisecond: number, enable: boolean): void {
    if (enable) {
      if (navigator && navigator.serviceWorker) {
        navigator.serviceWorker.register('/ngsw-worker.js');
      }
    }

    // 如果將 DwHttpMessageService 放在 constructor() 裡, DwMessageService 會是 undefined
    this.modalService = this.injector.get(DwHttpMessageService);
    if (this.updates.isEnabled) {
      this.updates.available.subscribe(event => {
        console.log('有新版本，將會進行重新整理');
        this.updates.activateUpdate().then(() => {

          console.log('更新完成');
          this.notifyRefresh();
        });
        this.updates.activated.subscribe(e => {
          // 更新

          console.log('activated finish');

        }, (error) => {
          console.log('updates.activated.error', error);
        });

      });


      interval(millisecond).subscribe(() => {
        this.updates.checkForUpdate().then((x) => {

        }, (err) => {
          console.log('Inside Interval updates.checkForUpdate() err =', err);
        });
      });
    }
  }

  private notifyRefresh(): void {
    if (this.modal) {
      return;
    }

    this.modal = this.modalService.create({
      // dwTitle: 'Update',
      dwContent: this.translate.instant('dw-detect-update-finished'),
      dwClassName: 'update-refresh-modal',
      dwMaskClosable: false,
      dwClosable: false,
      dwOkText: this.translate.instant('dw-update-refresh'),
      dwOkType: 'primary',
      dwCancelText: this.translate.instant('dw-update-refresh-wait'),
    });

    this.modal.subscribe((status) => {
      if (status) {
        document.location.reload();
      } else {
        setTimeout(() => {
          this.notifyRefresh();
        }, this.notifyInterval);
      }

      this.modal = null;
    });

  }

}
