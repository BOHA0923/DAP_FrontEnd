/**
 * 權限-作業子頁面
 */
export interface IDwAuthorizedPage {
  id: string;
  restriction: string;
}

/**
 * 權限-功能權限
 */
export interface IDwAuthorizedAction {
  id: string; // 按鈕編號
  restriction: string; // 按鈕功能限制 allow, hidden, disabled
}

export interface IDwAuthorizedItem {
  programId: string; // 作業編號
  page?: IDwAuthorizedPage[]; // 作業子頁面權限
  action?: IDwAuthorizedAction[]; // 功能權限
}

/**
 * 作業與功能權限
 */
export interface IDwAuthorizedList {
  // id包含作業和子頁面的id
  [id: string]: IDwAuthorizedItem;
}
