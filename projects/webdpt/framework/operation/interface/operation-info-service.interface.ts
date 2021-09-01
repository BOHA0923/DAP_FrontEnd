import { Observable } from 'rxjs';

import { IDwProgram } from './program.interface';


export interface IDwOperationInfoService {
  operationInfo$(programId: string): Observable<IDwProgram>;
}
