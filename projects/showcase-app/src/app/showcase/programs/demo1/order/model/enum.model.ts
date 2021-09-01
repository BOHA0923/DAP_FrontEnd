import { Observable } from 'rxjs';

/**
 * 訂單狀態碼列舉
 *
 * @export
 * @class OrderStatusModel
 */
export class OrderStatusModel {
  private _value: string;
  private _text: string;

  constructor(value?: string, text?: string) {
    this._value = value;
    this._text = text;
  }

  get value(): string {
    return this._value ? this._value : 'Y';
  }

  get label(): string {
    return this._text ? this._text : '有效';
  }

  /**
   * 訂單狀態碼列舉
   *
   * @static
   * @returns {Observable<OrderStatusModel[]>}
   * @memberof OrderStatusModel
   */
  static getList(): Observable<OrderStatusModel[]> {
    return Observable.create(observer => {
      const list = [
        new OrderStatusModel('Y', '有效'),
        new OrderStatusModel('N', '無效')
      ];
      observer.next(list);
      observer.complete();
    });
  }
}

/**
 * 單身配送狀態碼列舉
 *
 * @export
 * @class OrderDistributionOrderStatusModel
 */
export class OrderDistributionOrderStatusModel {
  private _key: string;
  private _lable: string;

  constructor(key: string, lable: string) {
    this._key = key;
    this._lable = lable;
  }

  get key(): string {
    return this._key ? this._key : '';
  }

  get lable(): string {
    return this._lable ? this._lable : '';
  }

  static getList(): Observable<OrderDistributionOrderStatusModel[]> {
    return Observable.create(observer => {
      const list = [
        new OrderDistributionOrderStatusModel('1', '未出貨'),
        new OrderDistributionOrderStatusModel('2', '已出貨'),
        new OrderDistributionOrderStatusModel('3', '未退貨'),
        new OrderDistributionOrderStatusModel('4', '已退貨'),
        new OrderDistributionOrderStatusModel('5', '未換退'),
        new OrderDistributionOrderStatusModel('6', '已換退'),
        new OrderDistributionOrderStatusModel('7', '未換出'),
        new OrderDistributionOrderStatusModel('8', '已換出'),
        new OrderDistributionOrderStatusModel('A', '未出未換'),
        new OrderDistributionOrderStatusModel('B', '已出已換')
      ];
      observer.next(list);
      observer.complete();
    });
  }
}

/**
 * 性別篩選列舉
 *
 * @export
 * @class OrderGenderModel
 */
export class OrderGenderModel {
  private _text: string;
  private _value: string;
  private _checked: boolean;

  constructor(value?: string, text?: string, checked?: boolean) {
    this._text = text;
    this._value = value;
    this._checked = !!checked;
  }

  get label(): string {
    return this._text ? this._text : '';
  }

  get value(): string {
    return this._value;
  }

  set value(value: string) {
    this._value = value;
  }

  get checked(): boolean {
    return !!this._checked;
  }

  set checked(value: boolean) {
    this._checked = value;
  }

  static getList(): Observable<OrderGenderModel[]> {
    return Observable.create(
      observer => {
        const list = [
          new OrderGenderModel('male', '男', false),
          new OrderGenderModel('female', '女', false)
        ];

        observer.next(list);
        observer.complete();
      }
    );
  }

  static resetList(list: OrderGenderModel[]): void {
    list.forEach(item => {
      item.checked = false;
    });
  }

  static setChecked(list: OrderGenderModel[], values: string[] | string): void {
    if (values && values.length > 0) {
      list.forEach((gender) => {
        gender.checked = false;
        const _values = [].concat(values);
        _values.forEach((selected) => {
          if (gender.value === selected) {
            gender.checked = true;
          }
        });
      });
    }
  }
}
