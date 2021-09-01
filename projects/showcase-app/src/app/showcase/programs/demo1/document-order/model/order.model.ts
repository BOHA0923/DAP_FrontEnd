import { DocumentOrderStatusModel } from './enum.model';


/**
 * 單頭
 *
 * @export
 * @class DocumentOrderMasterModel
 */
export class DocumentOrderMasterModel {
  orderId: string = '';
  status: string = new DocumentOrderStatusModel().value;
  orderDate: Date;
  customerId: string = '';
  customerName: string = '';
  orderAddr: string = '';
  total: number = 0;
  salesmanId: string = '';
  salesmanName: string = '';
  gender: string = '';

  constructor(values: any) {
    Object.assign(this, values);
  }
}


/**
 * 單身
 */
export class DocumentOrderProductInfo {
  seq = 0;
  productCode = '';
  productName = '';
  distributionStatus = '1';
  distributionStatusDesc = '未出貨';
  price = 0;
  subtotal = 0;

  private _quantity = 0;

  constructor(object: any) {
    Object.assign(this, object);
  }

  get quantity(): number {
    return this._quantity;
  }

  set quantity(value: number) {
    this._quantity = value;
    this.onChange();
  }

  onChange(): void {
    this.subtotal = this.price * this.quantity;
  }

  static parseToArray(jsonArray: any[]): DocumentOrderProductInfo[] {
    const details: DocumentOrderProductInfo[] = [];
    jsonArray.forEach(
      (item) => { details.push(new DocumentOrderProductInfo(item)); }
    );
    return details;
  }
}
