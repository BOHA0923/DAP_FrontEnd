const demo1OrderJson = require('./demo1-order.json');

// 單頭
interface IMockDemo1OrderMaster {
  orderId: string;
  status: string;
  orderDate: Date;
  customerId: string;
  customerName: string;
  orderAddr: string;
  total: number;
  salesmanId: string;
  salesmanName: string;
  gender: string;
}

// 單身
export interface IMockRDemo1OrderDetail {
  seq: number;
  distributionStatus: string;
  productCode: string;
  productName: string;
  price: number;
  quantity: number;
}

interface IDemo1OrderModel {
  master?: Array<IMockDemo1OrderMaster>;
  detail?: Array<IMockRDemo1OrderDetail>;
}

/**
 * 訂單資料
 *
 * @class Demo1OrderModel
 */
class Demo1OrderModel {
  private _mockData?: IDemo1OrderModel;

  constructor() {
    this._mockData = (<any>demo1OrderJson); // 資料初始化來自JSON檔
  }

  get mockData(): IDemo1OrderModel {
    const str = JSON.stringify(this._mockData);
    return JSON.parse(str);
  }

  set mockData(newData: IDemo1OrderModel) {
    this._mockData.master = newData.master;
    this._mockData.detail = newData.detail;
  }
}

export const demo1OrderModel = new Demo1OrderModel(); // Single Instance
