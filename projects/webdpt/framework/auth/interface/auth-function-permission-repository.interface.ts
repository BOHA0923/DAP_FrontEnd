import { Observable } from 'rxjs';

export interface IDwAuthFunctionPermissionRepository {

  getFunctionPermissionAll(): Observable<any>; // 返回資料格式等同API的'restful/service/DWSys/functionPermission'
}
