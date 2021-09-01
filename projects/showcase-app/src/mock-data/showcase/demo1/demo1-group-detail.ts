import { RequestInfo } from 'angular-in-memory-web-api';
import { IDwMockData } from '@webdpt/framework/mock';
const mockResponse = require('../mock-response.json');
import { demo1GroupModel } from './demo1-group.model';

class Demo1GroupDetailMockData implements IDwMockData {

  get data(): any {
    const mockData = demo1GroupModel.mockData;

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
    const collectionDb = <any>demo1GroupModel.mockData;
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
    const paramsGroupId: string = params.groupId;
    // 訂單編號
    if (paramsGroupId !== '') {
      // 單頭
      collection.master = collection.master.filter((filterData) => {
        const groupId: string = filterData.groupId;
        if (groupId === paramsGroupId) {
          return filterData;
        }
      });
      // 單身
      collection.detail = collection.detail.filter((filterData) => {
        const groupId: string = filterData.groupId;
        if (groupId === paramsGroupId) {
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

export let demo1GroupDetail = new Demo1GroupDetailMockData();
