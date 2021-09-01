import { Observable } from 'rxjs';

/**
 * 功能權限應用函式
 *
 * @description 在此可以加上應用邏輯，再回傳功能權限最終結果restrictionResult
 * @template [dwActionAuthorizedCallback]="actionAuthorizedCallback"
 * @param restriction 功能權限：allow 允許, hidden 隱藏, disabled 禁用
 * @param authorizedId 作業權限ID
 * @param actionId 功能按鈕ID
 * @returns restrictionResult 功能權限最終結果
 */
export type IDwActionAuthorizedCallbackFunc = (restriction: string, authorizedId: string, actionId: string) => Observable<string>;
