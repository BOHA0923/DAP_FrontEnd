import { Observable } from 'rxjs';

/**
 * [登入前]事件.
 */
export interface IDwOnLogining {
  logining(): Observable<any>;
}

/**
 * [登入後]事件.
 */
export interface IDwOnLogined {
  logined(): void;
}

/**
 * [登出前]事件.
 */
export interface IDwOnLogouting {
  logouting(): void;
}

/**
 * [登出後]事件.
 */
export interface IDwOnLogouted {
  logouted(): void;
}


export type DwLoginEvent = IDwOnLogining | IDwOnLogined | IDwOnLogouting | IDwOnLogouted;

