import { Observable } from 'rxjs';

/**
 * 訂單狀態碼列舉
 *
 * @export
 * @class StatusModel
 */
export class StatusModel {
  private _value: string;
  private _label: string;

  constructor(value?: string, label?: string) {
    this._value = value;
    this._label = label;
  }

  get value(): string {
    return this._value ? this._value : 'Y';
  }

  get label(): string {
    return this._label ? this._label : '有效';
  }

  /**
   * 訂單狀態碼列舉
   *
   * @static
   * @returns {Observable<StatusModel[]>}
   * @memberof StatusModel
   */
  static getList(): Observable<StatusModel[]> {
    return Observable.create(observer => {
      const list = [
        new StatusModel('Y', '有效'),
        new StatusModel('N', '無效')
      ];
      StatusModel.staticLists = list;
      observer.next(list);
      observer.complete();
    });
  }
  static staticLists: StatusModel[];
}




