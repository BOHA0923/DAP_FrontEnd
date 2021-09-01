import { Observable } from 'rxjs';

export interface IDwDelete {
  delete(resource: string, oid: object): Observable<any>;
}
