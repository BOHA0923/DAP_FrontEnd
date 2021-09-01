import { RequestInfo } from 'angular-in-memory-web-api';
import { IDwMockData } from '@webdpt/framework/mock';
const mockResponse = require('../../mock-response.json');
import { demo1TreeModel } from './demo1-tree.model';

class Demo1TreeDetailMockData implements IDwMockData {

  get data(): any {
    const mockData = demo1TreeModel.mockData;

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
    const collectionDb = <any>demo1TreeModel.mockData;
    const collection = {
      'master': [...collectionDb.master],
      'detail': [...collectionDb.detail]
    };

    const mockResp = <any>JSON.parse(JSON.stringify(mockResponse));
    mockResp.response = {
      master: {},
      detail: []
    };

    // 模擬API查詢結果.
    // 集團編號.
    if (params.groupId) { // groupId 為 dw-tree 的 key 值, 為 number.
      // 單頭
      collection.master = collection.master.filter((filterData) => {
        if (filterData.groupId === params.groupId.toString()) {
          return filterData;
        }
      });
      // 單身
      collection.detail = collection.detail.filter((filterData) => {
        if (filterData.groupId === params.groupId.toString()) {
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

export let demo1TreeDetail = new Demo1TreeDetailMockData();
