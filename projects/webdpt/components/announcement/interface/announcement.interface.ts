export interface IDwAnnouncementIgnore {
  'displayId': string;
  'id': string;
  'expires': string;
}

/*公告的資料格式*/
export interface IDwAnnouncement {
  id: string;
  pageId: number;
  subject: string;
  createDate: string;
  startDate: string;
  endDate: string;
  description: string;
}
