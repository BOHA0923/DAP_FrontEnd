import { RequestInfo } from 'angular-in-memory-web-api';
import { IDwMockData } from '@webdpt/framework/mock';
const mockResponse = require('../../mock-response.json');
import { demo1AsisModel } from './demo1-asis.model';

class Demo1AsisAddMockData implements IDwMockData {

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
    const collection = {
      'master': [...collectionDb.master],
      'detail': [...collectionDb.detail],
      'detailChildren': [...collectionDb.detailChildren]
    };
    const mockResp = <any>JSON.parse(JSON.stringify(mockResponse));
    mockResp.response = {
      'status': false,
      'description': '新增失敗'
    };

    // 模擬API查詢結果
    const paramsAsisId: string = params.master.asisId;
    // 集團編號
    if (paramsAsisId !== '') {
      // 單頭
      collection.master.unshift(params.master);

      // 單身
      collection.detail.push({
        'asisId': paramsAsisId,
        'detail': [...params.detail]
      });
      // 單身明細
      collection.detailChildren = [...collection.detailChildren, ...params.detailChildren];
      mockResp.response.status = true;
      mockResp.response.description = paramsAsisId + ' 新增成功';
    }

    demo1AsisModel.mockData = collection;



    return mockResp;
  }

  deleteMethod({ collection, collectionName, headers, id, url }: RequestInfo): any {
    return [];
  }

  putMethod({ collection, collectionName, headers, id, req, url }: RequestInfo): any {
    return [];
  }
}

export let demo1AsisAdd = new Demo1AsisAddMockData();
