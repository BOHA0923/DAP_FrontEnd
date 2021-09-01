import { RequestInfo } from 'angular-in-memory-web-api';
import { IDwMockData } from '@webdpt/framework/mock';
const mockResponse = require('../../mock-response.json');
import { demo1TreeModel } from './demo1-tree.model';

class Demo1TreeModifyMockData implements IDwMockData {

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
      'description': '修改失敗'
    };

    // 模擬API查詢結果
    const paramsGroupId: string = params.master.groupId;
    // 集團編號
    if (paramsGroupId !== '') {
      // 單頭
      collection.master = collection.master.map((mapData) => {
        const groupId: string = mapData.groupId;
        if (groupId === paramsGroupId) {
          mapData = params.master;
        }
        return mapData;
      });

      // 單身
      collection.detail = collection.detail.map((mapData) => {
        const groupId: string = mapData.groupId;
        if (groupId === paramsGroupId) {
          mapData.detail = params.detail;
        }
        return mapData;
      });
    }

    // demo1TreeModel.mockData = collection;

    mockResp.response.status = true;
    mockResp.response.description = paramsGroupId + ' 修改成功';

    return mockResp;
  }

  deleteMethod({ collection, collectionName, headers, id, url }: RequestInfo): any {
    return [];
  }

  putMethod({ collection, collectionName, headers, id, req, url }: RequestInfo): any {
    return [];
  }
}

export let demo1TreeModify = new Demo1TreeModifyMockData();
