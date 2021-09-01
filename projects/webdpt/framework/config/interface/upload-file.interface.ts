export interface IDWDmcUserInfo {
  username: string; // DMC 文檔中心登入的帳號
  password: string; // DMC 文檔中心登入的密碼
}


export interface IDWUploadMessage {
  status: string;  // 'success', 'error', 'ongoing'
  data: any; // 訊息 或 HttpErrorResponse
  fileId?: string; // 文件 ID
  shareUrl?: string; //
  percent?: number; // 上傳進度
}

export interface IDWUploadMangMessage {
  status: string;
  message?: any; // string 或 HttpErrorResponse
  percent?: number;
  fileId?: string;
  shareUrl?: string;
  shrinkUrl?: string;
}
