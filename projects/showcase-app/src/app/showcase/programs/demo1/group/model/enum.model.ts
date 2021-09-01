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
/**
 * 幣別碼列舉
 *
 * @export
 * @class CurrencyModel
 */
export class CurrencyModel {
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
  static getList(): Observable<CurrencyModel[]> {
    return Observable.create(observer => {
      const list = [
        new CurrencyModel('CNY', '人民幣'),
        new CurrencyModel('NTD', '新台幣')
      ];
      CurrencyModel.staticLists = list;
      observer.next(list);
      observer.complete();
    });
  }
  static staticLists: CurrencyModel[];
}

/**
 * 集團匯率檔設定列舉
 *
 * @export
 * @class ExchangeWayModel
 */
export class ExchangeWayModel {
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
  static getList(): Observable<ExchangeWayModel[]> {
    return Observable.create(observer => {
      const list = [
        new ExchangeWayModel('auto', '自動複製'),
        new ExchangeWayModel('custom', '自訂')
      ];
      ExchangeWayModel.staticLists = list;
      observer.next(list);
      observer.complete();
    });
  }
  static staticLists: ExchangeWayModel[];
}
/**
 * 匯率類別碼列舉
 *
 * @export
 * @class ExchangeClassModel
 */
export class ExchangeClassModel {
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
  static getList(): Observable<ExchangeClassModel[]> {
    return Observable.create(observer => {
      const list = [
        new ExchangeClassModel('1', '銀行買入匯率'),
        new ExchangeClassModel('2', '約定匯率')
      ];
      ExchangeClassModel.staticLists = list;
      observer.next(list);
      observer.complete();
    });
  }
  static staticLists: ExchangeClassModel[];
}
export class ExchangeSourceModel {
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
  static getList(): Observable<ExchangeSourceModel[]> {
    return Observable.create(observer => {
      const list = [
        new ExchangeSourceModel('1', '鼎捷南京'),
        new ExchangeSourceModel('2', '鼎捷上海')
      ];
      ExchangeSourceModel.staticLists = list;
      observer.next(list);
      observer.complete();
    });
  }
  static staticLists: ExchangeSourceModel[];
}



