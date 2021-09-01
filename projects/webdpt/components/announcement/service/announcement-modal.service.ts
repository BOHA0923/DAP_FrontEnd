import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DwModalRef } from 'ng-quicksilver/modal';
import { DwModalService } from 'ng-quicksilver/modal';

import { DwAnnouncementModalComponent } from '../announcement-modal/announcement-modal.component';
import { DwAnnouncementService } from './announcement.service';
import { DwAnnouncementModule } from '../announcement.module';

@Injectable({
  providedIn: DwAnnouncementModule
})
export class DwAnnouncementModalService {
  private _postModal: DwModalRef;

  constructor(
    private dwModalService: DwModalService,
    private announcementService: DwAnnouncementService
  ) { }

  /**
   * 顯示公告
   *
   * @param  displayId 公告頁面Id,從om公告維護取得
   * @param  width 公告開窗寬度
   * @returns Observable<any> 關窗後返回訊息
   */
  displayAnnouncement(displayId: string, width: string = '730'): Observable<any> {
  return  Observable.create(observer => {
    this.announcementService.getAnnouncement(displayId).subscribe(annoucement => {
      // 當公告不存時, 不顯示
      if (!annoucement) {
        observer.next(true);
        return;
      }

      this._postModal = this.dwModalService.create({
        dwContent: DwAnnouncementModalComponent,
        dwWidth: width,
        dwFooter: null,
        dwClosable: false,
        dwMaskClosable: false,
        dwOnOk: (data: any): void => { },
        dwOnCancel(): void { },
        dwComponentParams: { 'description': annoucement.description }
      });

      // 關閉窗後.
      this._postModal.afterClose.subscribe((isIgnore) => {
        if (isIgnore) {
          this.announcementService.setIgnore({
            displayId: displayId,
            id: annoucement.id,
            expires: annoucement.endDate
          });
        }
        observer.next(true);
      });
    });
    });
  }
}
