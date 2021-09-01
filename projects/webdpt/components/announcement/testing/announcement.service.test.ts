import { Observable, of } from 'rxjs';
export class DwAnnouncementServiceTest {
  getAnnouncement(displayId: any): Observable<any> {
    return of({
      id: '2020020045',
      pageId: 65,
      subject: '公告藍色',
      createDate: '2020/02/15 09:35:57',
      startDate: '2020/02/15 09:35:28',
      endDate: '2020/03/26 09:35:34',
      description: 'description-test'
    });
  }
  setIgnore(val: any): any {

  }
}
