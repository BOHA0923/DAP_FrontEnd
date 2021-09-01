import { Observable } from 'rxjs';

/**
 * 狀態碼列舉
 *
 * @export
 * @class StatusModel
 */
export class TreeStatusModel {
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
  static getList(): Observable<TreeStatusModel[]> {
    return Observable.create(observer => {
      const list = [
        new TreeStatusModel('Y', '有效'),
        new TreeStatusModel('N', '無效')
      ];
      // TreeStatusModel.staticLists = list;
      observer.next(list);
      observer.complete();
    });
  }
  // static staticLists: TreeStatusModel[];
}

/**
 * 幣別碼列舉
 *
 * @export
 * @class CurrencyModel
 */
export class TreeCurrencyModel {
  private _value: string;
  private _label: string;

  constructor(value?: string, label?: string) {
    this._value = value;
    this._label = label;
  }

  get value(): string {
    return this._value ? this._value : 'CNY';
  }

  get label(): string {
    return this._label ? this._label : '人民幣';
  }

  /**
   * 幣別碼列舉
   *
   * @static
   * @returns {Observable<CurrencyModel[]>}
   * @memberof CurrencyModel
   */
  static getList(): Observable<TreeCurrencyModel[]> {
    return Observable.create(observer => {
      const list = [
        new TreeCurrencyModel('CNY', '人民幣'),
        new TreeCurrencyModel('NTD', '新台幣')
      ];
      TreeCurrencyModel.staticLists = list;
      observer.next(list);
      observer.complete();
    });
  }
  static staticLists: TreeCurrencyModel[];
}

/**
 * 集團匯率檔設定列舉
 *
 * @export
 * @class ExchangeWayModel
 */

 export class TreeExchangeWayModel {
  private _value: string;
  private _label: string;

  constructor(value?: string, label?: string) {
    this._value = value;
    this._label = label;
  }

  get value(): string {
    return this._value ? this._value : 'auto';
  }

  get label(): string {
    return this._label ? this._label : '自動複製';
  }

  /**
   * 集團匯率檔設定列舉
   *
   * @static
   * @returns {Observable<ExchangeWayModel[]>}
   * @memberof ExchangeWayModel
   */
  static getList(): Observable<TreeExchangeWayModel[]> {
    return Observable.create(observer => {
      const list = [
        new TreeExchangeWayModel('auto', '自動複製'),
        new TreeExchangeWayModel('custom', '自訂')
      ];
      // TreeExchangeWayModel.staticLists = list;
      observer.next(list);
      observer.complete();
    });
  }
  // static staticLists: TreeExchangeWayModel[];
}

/**
 * 匯率類別碼列舉
 *
 * @export
 * @class ExchangeClassModel
 */
 export class TreeExchangeClassModel {
  private _value: string;
  private _label: string;

  constructor(value?: string, label?: string) {
    this._value = value;
    this._label = label;
  }

  get value(): string {
    return this._value ? this._value : '1';
  }

  get label(): string {
    return this._label ? this._label : '銀行買入匯率';
  }

  /**
   * 匯率類別列舉
   *
   * @static
   * @returns {Observable<ExchangeClassModel[]>}
   * @memberof ExchangeClassModel
   */
  static getList(): Observable<TreeExchangeClassModel[]> {
    return Observable.create(observer => {
      const list = [
        new TreeExchangeClassModel('1', '銀行買入匯率'),
        new TreeExchangeClassModel('2', '約定匯率')
      ];
      // TreeExchangeClassModel.staticLists = list;
      observer.next(list);
      observer.complete();
    });
  }
  // static staticLists: TreeExchangeClassModel[];
}

export class TreeExchangeSourceModel {
  private _value: string;
  private _label: string;

  constructor(value?: string, label?: string) {
    this._value = value;
    this._label = label;
  }

  get value(): string {
    return this._value ? this._value : '1';
  }

  get label(): string {
    return this._label ? this._label : '鼎捷南京';
  }

  /**
   * 匯率類別列舉
   *
   * @static
   * @returns {Observable<ExchangeSourceModel[]>}
   * @memberof ExchangeSourceModel
   */
  static getList(): Observable<TreeExchangeSourceModel[]> {
    return Observable.create(observer => {
      const list = [
        new TreeExchangeSourceModel('1', '鼎捷南京'),
        new TreeExchangeSourceModel('2', '鼎捷上海')
      ];
      // TreeExchangeSourceModel.staticLists = list;
      observer.next(list);
      observer.complete();
    });
  }
  // static staticLists: TreeExchangeSourceModel[];
}



