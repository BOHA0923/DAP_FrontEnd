import { ParamMap } from '@angular/router';

import { Observable } from 'rxjs';


export interface IDwSsoLogin {
  ssoLogin(queryParam: ParamMap): Observable<boolean>;
}
