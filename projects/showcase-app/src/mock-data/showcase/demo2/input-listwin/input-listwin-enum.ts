import { RequestInfo } from 'angular-in-memory-web-api';
import { IDwMockData } from '@webdpt/framework/mock';
import { demo2InputListwinEnum } from './input-listwin-enum-data';
import { DatePipe } from '@angular/common';


class Demo2InputListwinEnumData implements IDwMockData {

  get data(): any {
    return demo2InputListwinEnum;
  }

  getMethod(reqInfo: any): any {
    return reqInfo.collection;
  }

  postMethod(reqInfo: any): any {
    const enumResp = [];
    const orderInfo = reqInfo.collection.orderInfo; // 訂單詳細資料
    const addrInfo = reqInfo.collection.addrInfo; // 地區
    const companyInfo = reqInfo.collection.companyInfo; // 公司
    const salesmanNameInfo = reqInfo.collection.salesmanNameInfo; // 業務員姓名

    let key = 1;
    for (let i = 0; i < 100; i++) { // 可以產生多筆資料.
      const object = Object.assign({}, orderInfo);
      const plusOrMinus = Math.random() < 0.5 ? -1 : 1;
      const orderDate  = new Date(+new Date() + ((Math.floor(Math.random() * 50) * 86400000 * plusOrMinus)));
      const orderAddr = {
        city: addrInfo[key % 17],
        address: object.orderAddr.address
      };

      Object.assign(object, {
        orderId: 'No_00000' + key,
        customerId: 'C0' + (Math.floor(Math.random() * 9 + 1)),
        status: key % 2,
        orderAddr: orderAddr,
        customerName: companyInfo[key % 7],
        total: Math.floor(Math.random() * (10000 - 1000 + 1)) + 1000,
        orderDate: (new DatePipe('zh_tw')).transform(orderDate, 'yyyy/MM/dd'),
        gender: (key % 2) ? 'male' : 'female',
        salesmanName: salesmanNameInfo[key % 4]
      });

      enumResp.push(object);
      key++;
    }

    return enumResp;
    // return reqInfo.collection;
  }

  deleteMethod(reqInfo: RequestInfo): any {
    return [];
  }

  putMethod(reqInfo: RequestInfo): any {
    return [];
  }
}

export let demo2InputListwinEnumData = new Demo2InputListwinEnumData();
