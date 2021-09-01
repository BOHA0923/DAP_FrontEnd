import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { IDwAuthFunctionPermissionRepository } from '@webdpt/framework/auth';
import { DwDapHttpClient } from './dap-http-client';

/**
 * IAM權限中心資料
 */
@Injectable()
export class DwDapAuthFunctionPermissionRepository implements IDwAuthFunctionPermissionRepository {
  constructor(
    private http: DwDapHttpClient
  ) {
  }

  public getFunctionPermissionAll(): Observable<any> {
    const queryStringParam: object = {
      params: {
        code: JSON.stringify([])
      }
    };

    return this.http.get('restful/service/DWSys/functionPermission', queryStringParam);
  }
}
