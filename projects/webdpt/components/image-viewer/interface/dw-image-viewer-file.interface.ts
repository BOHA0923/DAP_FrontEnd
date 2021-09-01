/**
 * 圖片瀏覽列表功能項
 */
export interface IDwImageViewerActionItem {
  show: boolean; // 是否顯示
  title: string; // 標題
  disabled?: boolean; // 禁用
}

/**
 * 圖片瀏覽列表功能其他功能鍵
 */
export interface IDwImageViewerListOtherAction {
  [key: string]: IDwImageViewerActionItem;
}

/**
 * 圖片瀏覽列表功能
 */
export interface IDwImageViewerListAction {
  dwPreview: IDwImageViewerActionItem; // 瀏覽：預設顯示
  dwRemove: IDwImageViewerActionItem; // 刪除：預設顯示
  dwDownload: IDwImageViewerActionItem; // 下載：預設顯示
  dwCheck: IDwImageViewerActionItem; // 選擇：預設不顯示
  otherAction?: Array<IDwImageViewerListOtherAction>; // 其他功能鍵
}

/**
 * 圖片瀏覽功能
 */
export interface IDwImageViewerAction {
  dwPrevious: IDwImageViewerActionItem; // 前一個：預設顯示
  dwNext: IDwImageViewerActionItem; // 下一個：預設顯示
  dwFullScreen: IDwImageViewerActionItem; // 全螢幕：預設顯示
  dwZoomIn: IDwImageViewerActionItem; // 放大：預設顯示
  dwZoomOut: IDwImageViewerActionItem; // 縮小：預設顯示
  dwResetZoom: IDwImageViewerActionItem; // 重設大小：預設顯示
  dwOriginalSize: IDwImageViewerActionItem; // 實際大小：預設顯示
  dwRotateRight: IDwImageViewerActionItem; // 右旋轉：預設顯示
  dwRotateLeft: IDwImageViewerActionItem; // 左旋轉：預設顯示
  dwDownload: IDwImageViewerActionItem; // 下載：預設顯示
}

/**
 * 圖片瀏覽重取的資料
 *
 * @see 功能"前一個"和"下一個"的資料改變時，回調函式返回的資料格式
 */
export interface IDwImageViewerChangeData {
  uid: string;
  fileSrc: string | File;
  name: string;
  type: string;
  title: string;
  viewerAction: IDwImageViewerAction;
}

export type IDwImageViewerUploadFileStatus = 'error' | 'success' | 'done' | 'uploading' | 'removed';
export type IDwImageViewerListType = 'picture-card';

/**
 * 檔案物件
 *
 * @see 可以接收NG-ZORRO上傳檔案的格式
 */
export interface IDwImageViewerFile {
  uid: string; // 檔案唯一識別碼
  size?: number; // 檔案大小 byte
  name: string; // 檔名
  title?: string; // 檔案標題
  // filename?: string;
  lastModified?: string;
  lastModifiedDate?: Date;
  url?: string; // 檔案URL
  status?: IDwImageViewerUploadFileStatus; // 狀態：uploading done error removed
  originFileObj?: File; // 原始檔案
  percent?: number; // 上傳進度百分比
  thumbUrl?: string; // 檔案縮圖URL
  response?: any;
  error?: any;
  // linkProps?: { download: string };
  type: string; // 檔案類型 MIME type(等於文檔中心的contentType)
  message?: string; // 錯誤訊息。例如：上傳失敗
  check?: boolean; // 選擇的值
  [key: string]: any;
}
