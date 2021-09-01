/**
 * 變更密碼開窗元件的預設參數.
 *
 */
export interface IDwUpdatePasswordDefault {
  modalTitle?: string; // modal 標題.
  modalWidth?: string; // modal 寬度.
  modalOkText?: string; // 確認按鈕文字.
  modalCancelText?: string; // 取消按鈕文字.
  modalOnOk?(): void; // 點擊[確認]回調-[作業定義].
  modalOnCancel?(): void; // 點擊[遮罩層]或[右上角叉]或[取消按鈕]的回調-[作業定義].
  modalAfterClose?(): void; // Modal 完全關閉後的回調-[作業定義].
  modalAfterOpen?(): void; // Modal 打開後的回調-[作業定義].
  formVerifyType?: string; // 驗證方式 full: 全部, email: 電子信箱, mobilephone: 手機號, 預設: full.
}


/**
 * 變更密碼表單的預設參數.
 *
 */
export interface IDwUpdatePasswordConfig {
  verifyType: string; // 驗證方式 full: 全部, email: 電子信箱, mobilephone: 手機號, 預設: full.
}


/**
 * 變更密碼表單的預設參數-for云端.
 *
 */
export interface IDwUpdatePassword {
  account: string; // 類型：String 必有字段 備註：手機號或郵箱賬號
  password: string; // 類型：String 必有字段 備註：新密碼
  verificationCode: string; // 類型：String 必有字段 備註：驗證碼
}

/**
 * 強制變更密碼表單的預設參數-for地端.
 *
 */
export interface IDwUpdatePasswordForce {
  id?: string; // 類型：String  可有字段  備註：用戶Id與Sid不能同時為空
  sid?: string; // 類型：String  可有字段  備註：用戶Id與Sid不能同時為空
  newPassword?: string; // 類型：String  可有字段  備註：用戶密碼與加密後的密碼不能同時為空
  newPasswordHash?: string; // 類型：String  可有字段  備註：用戶密碼與加密後的密碼不能同時為空
}
