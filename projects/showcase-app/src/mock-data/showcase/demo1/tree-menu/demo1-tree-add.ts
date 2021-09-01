import { RequestInfo } from 'angular-in-memory-web-api';
import { IDwMockData } from '@webdpt/framework/mock';
const mockResponse = require('../../mock-response.json');
import { demo1TreeModel } from './demo1-tree.model';

class Demo1TreeAddMockData implements IDwMockData {

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
      'status': false,
      'description': '新增失敗'
    };

    // 模擬API查詢結果
    const paramsGroupId: string = params.master.groupId;
    // 集團編號
    if (paramsGroupId !== '') {
      // 單頭
      collection.master.unshift(params.master);

      // 單身
      collection.detail.push({
        'groupId': paramsGroupId,
        'detail': [...params.detail]
      });
      mockResp.response.status = true;
      mockResp.response.description = paramsGroupId + ' 新增成功';
    }

    // demo1TreeModel.mockData = collection;

    return mockResp;
  }

  deleteMethod({ collection, collectionName, headers, id, url }: RequestInfo): any {
    return [];
  }

  putMethod({ collection, collectionName, headers, id, req, url }: RequestInfo): any {
    return [];
  }
}

export let demo1TreeAdd = new Demo1TreeAddMockData();
