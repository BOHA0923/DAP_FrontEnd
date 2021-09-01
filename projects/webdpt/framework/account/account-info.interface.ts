import { ValidatorFn, AsyncValidatorFn } from '@angular/forms';
import { Observable } from 'rxjs';


/**
 * 個人資料維護功能的資料來源
 *
 */
export interface IDwAccountInfoDataSource {
  // 取得用戶的基本資料
  getUserBasicInfo(userId?: string): Observable<any>;
  // 更新用戶的基本資料.
  updateUserBasicInfo(userInfo: any): Observable<any>;
  // 刷新用戶在session storage的資料.
  refreshUserInfo(userInfo: any): Observable<any>;
}


/**
 * 頭像的上傳與更新
 *
 */
export interface IDwAccountInfoUpload {
  // 上傳並取得分享連結
  uploadAndShare(file: File, bucketName?: string, dirId?: string): Observable<any>;
  // 更新用戶頭像
  updateUserHeadimageUrl(headImageUrl: string, userSid?: string): Observable<any>;
}


/**
 * 動態欄位的每一個的設定
 *
 */
export interface IDwAccInfoFormOption {
  type: string; // 欄位類型, checkbox, label, radio, select, date, phone, input
  name: string; // formControlName, 需要與用戶基本資料的 key 值一致
  label: string; // 欄位顯示詞
  value?: string; // 暫無作用, 保留, todo, 如果 value 與 用戶基本資料 同時有值, 要以誰為主?
  columns?: number; // <dw-form-item>的 Grid 柵格, 1欄或 2欄, 當沒有設定grid時, 默認會以columns取得對應的 grid.
  required?: boolean; // 是否必填, 當在云端時, 默認 email 與手機必填
  disabled?: boolean; // 是否禁用
  placeHolder?: string; // 欄位輸入提示用詞
  option?: Array<IDwAccInfoOptionItem>; // 選項清單, 用在 radio 與 select
  selectShowSearch?: boolean; // 欄位類型為 select 時, 使單選模式可搜索
  selectMode?: string; // 欄位類型為 select 時, 設置dw-select的模式, multiple|tags|default
  grid?: IDwAccInfoOptionGrid; // <dw-form-item> 的顯示區塊的 Grid 柵格
  validators?: Array<ValidatorFn>; // 同步驗證器
  asyncValidators?: Array<AsyncValidatorFn>; // 非同步驗證器
  prefix?: IDwAccInfoFormOption; // 帶有前綴欄位的欄位型態, 目前只用在 phone
}


/**
 * 選項清單包括 radio 與 select
 *
 */
export interface IDwAccInfoOptionItem {
  label: string;
  value: string;
}


/**
 * <dw-form-item> 的顯示區塊的 Grid 柵格
 *
 */
export interface IDwAccInfoOptionGrid {
  colSpan: number; // <dw-col> 的 Grid 柵格
  labelSpan: number; // <dw-form-label> 的 Grid 柵格
  inputSpan: number; // <dw-form-control> 的 Grid 柵格
}
