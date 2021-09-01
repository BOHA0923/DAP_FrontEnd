import { Observable } from 'rxjs';

export class DocumentOrderEnumModel {
  static gender = [
    { label: '男', value: 'male' },
    { label: '女', value: 'female' }
  ];

  static orderStatus = [
    { label: '有效', value: 'C' },
    { label: '無效', value: 'D' }
  ];
}

/**
 * 訂單狀態碼列舉
 *
 * @export
 * @class DocumentOrderStatusModel
 */
export class DocumentOrderStatusModel {
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
   * @returns {Observable<DocumentOrderStatusModel[]>}
   * @memberof DocumentOrderStatusModel
   */
  static getList(): Observable<DocumentOrderStatusModel[]> {
    return Observable.create(observer => {
      const list = [
        new DocumentOrderStatusModel('Y', '有效'),
        new DocumentOrderStatusModel('N', '無效')
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
 * @class DocumentOrderDistributionStatusModel
 */
export class DocumentOrderDistributionStatusModel {
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

  static getList(): Observable<DocumentOrderDistributionStatusModel[]> {
    return Observable.create(observer => {
      const list = [
        new DocumentOrderDistributionStatusModel('1', '未出貨'),
        new DocumentOrderDistributionStatusModel('2', '已出貨'),
        new DocumentOrderDistributionStatusModel('3', '未退貨'),
        new DocumentOrderDistributionStatusModel('4', '已退貨'),
        new DocumentOrderDistributionStatusModel('5', '未換退'),
        new DocumentOrderDistributionStatusModel('6', '已換退'),
        new DocumentOrderDistributionStatusModel('7', '未換出'),
        new DocumentOrderDistributionStatusModel('8', '已換出'),
        new DocumentOrderDistributionStatusModel('A', '未出未換'),
        new DocumentOrderDistributionStatusModel('B', '已出已換')
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
 * @class DocumentOrderGenderModel
 */
export class DocumentOrderGenderModel {
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

  static getList(): Observable<DocumentOrderGenderModel[]> {
    return Observable.create(
      observer => {
        const list = [
          new DocumentOrderGenderModel('male', '男', false),
          new DocumentOrderGenderModel('female', '女', false)
        ];

        observer.next(list);
        observer.complete();
      }
    );
  }

  static resetList(list: DocumentOrderGenderModel[]): void {
    list.forEach(item => {
      item.checked = false;
    });
  }

  static setChecked(list: DocumentOrderGenderModel[], values: string[] | string): void {
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
