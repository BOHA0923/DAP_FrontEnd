export class DwTabEvent {
  tabId: string;
  url: string;
  id: string;
  module: string;
  type: string;
  constructor(tabId: string, url: string, id: string, module: string, type: string) {
    this.tabId = tabId;
    this.url = url;
    this.id = id;
    this.module = module;
    this.type = type;
  }
}

/**
 * 頁籤開啟
 */
export class DwTabOpen extends DwTabEvent {}

/**
 * 頁籤取得焦點
 */
export class DwTabFocusin extends DwTabEvent {}

/**
 * 頁籤離開焦點
 */
export class DwTabFocusout extends DwTabEvent {}

/**
 * 頁籤關閉
 */
export class DwTabClose extends DwTabEvent {}

