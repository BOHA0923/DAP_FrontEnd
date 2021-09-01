import { Observable } from 'rxjs';

import { IDwLanguageList } from './language.interface';

export interface IDwLanguageListService {
  /**
   * 取得可用語言清單
   */
  getLanguagesList(): Observable<IDwLanguageList[]>;
}
