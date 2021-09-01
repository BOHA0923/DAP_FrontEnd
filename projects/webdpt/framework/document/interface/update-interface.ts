import { Observable } from 'rxjs';

export interface IDwUpdate {
  update(resource: string, data: object): Observable<any>;
}
