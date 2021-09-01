export interface IDwIframe {
  url: string; // iframe 的 url.
  attr?: string; // iframe 的 屬性.
  routerLink?: string;
  type?: string; // iframe 類型, fineReport 與 externalUrl.
  programId?: string; // 作業編號
}
