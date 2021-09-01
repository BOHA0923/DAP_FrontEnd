/**
 * 登入頁的記住我資訊
 */
export interface IDwRememberLoginModel {
  rememberLogin: boolean; // 是否記住我
  userId: string; // 帳戶
  userName: string; // TODO:是否可移除?
  language: string; // 語言別
}
