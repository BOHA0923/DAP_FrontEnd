import { Observable } from 'rxjs';

export interface IDwRead {
  read(resource: string, oid: object): Observable<any>;
}
