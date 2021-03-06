import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';

import { DW_APP_ID } from '@webdpt/framework/config';
import { DwOmHttpClient } from '@webdpt/framework/om';
import { DwAnnouncementModule } from '../announcement.module';

@Injectable({
  providedIn: DwAnnouncementModule
})
export class DwAnnouncementRepository {

  constructor(
    @Inject(DW_APP_ID) private dwAppId: string,
    private http: DwOmHttpClient
  ) { }

  /**
   * εεΎε¬ε
   */
  getActiveAnnouncement(displayId: string): Observable<any> {
    return this.http.get('restful/service/DWSysManagement/Announcement/ActiveAnnouncement', {
      params: {
        goodsCode: this.dwAppId,
        displayId: displayId
      }
    });
  }
}
