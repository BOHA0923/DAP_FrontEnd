import { RequestInfo } from 'angular-in-memory-web-api';
import { IDwMockData } from '@webdpt/framework/mock';
const mockResponse = require('../../mock-response.json');
import { demo1AsisModel } from './demo1-asis.model';

class Demo1DeleteAsisListMockData implements IDwMockData {

  get data(): any {
    const mockData = demo1AsisModel.mockData;

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
    const collectionDb = <any>demo1AsisModel.mockData;
    const collection = [...collectionDb.master];

    const mockResp = <any>JSON.parse(JSON.stringify(mockResponse));
    mockResp.response = {
      'status': false,
      'description': '刪除失敗'
    };

    const paramsAsisIds: string[] = params.asisIds;
    if (paramsAsisIds.length) {
      for (let i = 0; i < paramsAsisIds.length; i++) {
        const idx = collection.findIndex((value: any) => {
          return value.asisId === paramsAsisIds[i];
        });
        if (idx >= 0) {
          collection.splice(idx, 1);
          mockResp.response.status = true;
          mockResp.response.description = ' 刪除成功';
        }
      }
    }
    collectionDb.master = collection;
    demo1AsisModel.mockData = collectionDb;

    return mockResp;
  }

  deleteMethod({ collection, collectionName, headers, id, url }: RequestInfo): any {
    return [];
  }

  putMethod({ collection, collectionName, headers, id, req, url }: RequestInfo): any {
    return [];
  }
}

export let demo1AsisListDelete = new Demo1DeleteAsisListMockData();
