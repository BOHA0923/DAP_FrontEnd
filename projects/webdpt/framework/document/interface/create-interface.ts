import { Observable } from 'rxjs';

export interface IDwCreate {
  create(resource: string, data: object): Observable<any>;
}
