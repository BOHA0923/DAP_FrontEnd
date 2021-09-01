import { RequestInfo } from 'angular-in-memory-web-api';
import { IDwMockData } from '@webdpt/framework/mock';
const mockResponse = require('../mock-response.json');
import { demo1OrderModel } from './demo1-order.model';

class Demo1OrderDetailMockData implements IDwMockData {

  get data(): any {
    const mockData = demo1OrderModel.mockData;

    return mockData;
  }

  getMethod(reqInfo: any): any {
    return reqInfo.collection;
  }

  postMethod(reqInfo: any): any {
    let params;
    try {
      params = JSON.parse(reqInfo.req.body);
    } catch (error) {
      params = reqInfo.req.body;
    }
    const collectionDb = <any>demo1OrderModel.mockData;
    const collection = {
      'master': [...collectionDb.master],
      'detail': [...collectionDb.detail]
    };

    const mockResp = <any>JSON.parse(JSON.stringify(mockResponse));
    mockResp.response = {
      master: {},
      detail: []
    };

    // 模擬API查詢結果
    const paramsOrderId: string = params.orderId;
    // 訂單編號
    if (paramsOrderId !== '') {
      // 單頭
      collection.master = collection.master.filter((filterData) => {
        const orderId: string = filterData.orderId;
        if (orderId.indexOf(paramsOrderId) !== -1) {
          return filterData;
        }
      });
      // 單身
      collection.detail = collection.detail.filter((filterData) => {
        const orderId: string = filterData.orderId;
        if (orderId.indexOf(paramsOrderId) !== -1) {
          return filterData;
        }
      });
    }

    if (collection.master.length > 0) {
      mockResp.response.master = collection.master[0];
    }

    if (collection.detail.length > 0) {
      mockResp.response.detail = collection.detail[0].detail;
    }

    return mockResp;
  }

  deleteMethod({ collection, collectionName, headers, id, url }: RequestInfo): any {
    return [];
  }

  putMethod({ collection, collectionName, headers, id, req, url }: RequestInfo): any {
    return [];
  }
}

export let demo1OrderDetail = new Demo1OrderDetailMockData();
