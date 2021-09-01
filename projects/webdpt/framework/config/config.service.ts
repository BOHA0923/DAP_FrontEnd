import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';
import { map, skipWhile } from 'rxjs/operators';


@Injectable()
export class DwSystemConfigService {
  private _config: any;
  private apiLoaded$ = new BehaviorSubject(null);
  setConfig(result: Object): void {
    this._config = result;
    this.apiLoaded$.next(result);
  }

  get(key: string): Observable<any> {
    return this.apiLoaded$.pipe(
      map(
        result => {
          const value = result ? (result[key] ? result[key] : '') : result;
          return this.convertPropertyValue(key, value);
        }
      ),
      skipWhile(result => {
        return result === null;
      })
    );
  }

  getConfig(): Observable<any> {
    return this.apiLoaded$.pipe(
      skipWhile(result => {
        return result === null;
      })
    );
  }

  private convertPropertyValue(key: string, value: any): any {

    let result = value;

    switch (key) {
      case 'multiTenant':
        result = coerceBooleanProperty(value);
        break;
      default:
        break;
    }

    return result;
  }
}
