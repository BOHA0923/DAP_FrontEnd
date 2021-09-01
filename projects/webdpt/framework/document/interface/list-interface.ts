import { Observable } from 'rxjs';

export interface IDwList {
  list(resource: string, queryInfo: object): Observable<any>;
}
