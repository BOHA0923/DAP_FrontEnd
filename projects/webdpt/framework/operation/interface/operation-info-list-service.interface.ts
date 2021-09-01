
import { Observable } from 'rxjs';

import { IDwOperationMap } from './program.interface';


export interface IDwOperationInfoListService {
  operationListMap$: Observable<IDwOperationMap>;
}
