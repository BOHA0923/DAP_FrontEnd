import { RequestInfo } from 'angular-in-memory-web-api';
import { IDwMockData } from '@webdpt/framework/mock';
import { demo2InputListwin } from './input-listwin-data';
import { DatePipe } from '@angular/common';


class Demo2InputListwinMockData implements IDwMockData {

  get data(): any {
    return demo2InputListwin;
  }

  getMethod(reqInfo: any): any {
    return reqInfo.collection;
  }

  postMethod(reqInfo: any): any {
    const mockResp = [];
    const orderInfo = reqInfo.collection.orderInfo; // 訂單詳細資料
    const addrInfo = reqInfo.collection.addrInfo; // 地區
    const companyInfo = reqInfo.collection.companyInfo; // 公司

    let key = 1;
    for (let i = 0; i < 100; i++) { // 可以產生多筆資料.
      const object = Object.assign({}, orderInfo);
      const plusOrMinus = Math.random() < 0.5 ? -1 : 1;
      const orderDate  = new Date(+new Date() + ((Math.floor(Math.random() * 50) * 86400000 * plusOrMinus)));

      Object.assign(object, {
        orderId: 'No_00000' + key,
        customerId: 'C0' + (Math.floor(Math.random() * 9 + 1)),
        orderAddr: addrInfo[key % 25] + object.orderAddr,
        customerName: companyInfo[key % 41],
        total: Math.floor(Math.random() * (10000 - 1000 + 1)) + 1000,
        orderDate: (new DatePipe('zh_tw')).transform(orderDate, 'yyyy/MM/dd')
      });
      mockResp.push(object);
      key++;
    }

    return mockResp;
    // return reqInfo.collection;
  }

  deleteMethod(reqInfo: RequestInfo): any {
    return [];
  }

  putMethod(reqInfo: RequestInfo): any {
    return [];
  }
}

export let demo2InputListwinData = new Demo2InputListwinMockData();
