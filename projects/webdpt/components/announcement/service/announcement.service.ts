import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { LocalStorage } from '@webdpt/framework/storage';
import { DwAnnouncementRepository } from '../repository/announcement-repository';
import { IDwAnnouncement, IDwAnnouncementIgnore } from '../interface/announcement.interface';
import { DwSystemConfigService } from '@webdpt/framework/config';
import { DwAnnouncementModule } from '../announcement.module';

@Injectable({
  providedIn: DwAnnouncementModule
})
export class DwAnnouncementService {

  constructor(
    private systemConfigService: DwSystemConfigService,
    private localStorage: LocalStorage,
    private announcementRepository: DwAnnouncementRepository
  ) { }

  /**
   * 取得公告資料
   *
   * @param displayId 公告頁面Id,從om公告維護取得
   * @returns Observable<Iannouncement> 返回訊息內容
   */
  getAnnouncement(displayId: string): Observable<IDwAnnouncement> {
    return Observable.create(observer => {
      this.systemConfigService.get('multiTenant').subscribe(val => {
        if (val === true) {
          this.announcementRepository.getActiveAnnouncement(displayId).subscribe(res => {
            if (res.data && res.data.length) {
              const annoucement = res.data[0];
              if (!this.getIgnoreList().filter(d => d.id === annoucement.id).length) {
                observer.next(annoucement);
              } else {
                observer.next(null);
              }
            } else {
              observer.next(null);
            }
          });
        } else {
          observer.next(null);
        }
      }, err => {
        observer.next(null);
      });
    });
  }

  /**
   * 從localStorage取得不顯示公告id陣列
   *
   * @returns 返回不顯示公告id陣列
   */
  getIgnoreList(): Array<IDwAnnouncementIgnore> {
    let announcementIgnores: IDwAnnouncementIgnore[] = [];
    let dwAnnouncementIgnore: any = this.localStorage.get('dwAnnouncementIgnore');
    if (dwAnnouncementIgnore) {
      dwAnnouncementIgnore = JSON.parse(dwAnnouncementIgnore);
      if (Array.isArray(dwAnnouncementIgnore)) {
        announcementIgnores = dwAnnouncementIgnore;
      }
    }
    return announcementIgnores;
  }

  /**
   * 相同displayId只會有ㄧ筆，順便檢查,把過期的其它公告id也刪除。
   *
   * @param announcementIgnore 不顯示的公告
   */
  setIgnore(announcementIgnore: IDwAnnouncementIgnore): void {
    let announcementIgnores: IDwAnnouncementIgnore[] = this.getIgnoreList();

    // step1 塞資料
    const idx = announcementIgnores.findIndex(a => a.displayId === announcementIgnore.displayId);
    if (idx !== -1) {
      announcementIgnores[idx] = announcementIgnore;
    } else {
      announcementIgnores.push(announcementIgnore);
    }

    // step2 移除過期資料
    announcementIgnores = announcementIgnores.filter(a => {
      return new Date(a.expires) > new Date();
    });

    this.localStorage.set('dwAnnouncementIgnore', JSON.stringify(announcementIgnores));
  }
}
