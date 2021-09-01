import { OrderStatusModel } from './enum.model';

/**
 * 單頭
 *
 * @export
 * @class OrderMasterModel
 */
export class OrderMasterModel {
  orderId: string = '';
  status: string = new OrderStatusModel().value;
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
export class OrderProductInfo {
  seq = 0;
  productCode = '';
  productName = '';
  distributionStatus = '1';
  distributionStatusDesc = '未出貨';
  price = 0;
  quantity = 0;
  subtotal = 0;

  constructor(object: any) {
    Object.assign(this, object);
  }
}
