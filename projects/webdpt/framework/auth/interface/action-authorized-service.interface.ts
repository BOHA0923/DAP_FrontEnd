import { Observable } from 'rxjs';

export interface IDwActionAuthorizedService {
  /**
   * 取得功能權限
   *
   * @param dwAuthorizedId 作業權限ID
   * @param dwActionId 功能按鈕ID
   */
  getActionAuth(dwAuthorizedId: string, dwActionId: string): Observable<string>;
}
