/**
 * 忘記密碼送出後, 進行修改密碼.
 *
 */
export interface IDwForgetUpdatePassword {
  account: string; // Email帳號/手機號碼.
  password: string; // 密碼.
  verificationCode: string; // 驗證碼
  selectVerification: string; // 驗證方式
}

/**
 * 提供忘記密碼的驗證方式的設定值.
 *
 */
export enum IDwForgetverificationType {
  EMAIL = 'email',
  MOBILEPHONE = 'mobilephone'
}
