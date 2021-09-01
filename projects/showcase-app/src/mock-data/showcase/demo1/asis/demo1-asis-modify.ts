import { RequestInfo } from 'angular-in-memory-web-api';
import { IDwMockData } from '@webdpt/framework/mock';
const mockResponse = require('../../mock-response.json');
import { demo1AsisModel } from './demo1-asis.model';

class Demo1AsisModifyMockData implements IDwMockData {

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
      'description': '修改失敗'
    };
    // 模擬API查詢結果
    const paramsAsisId: string = params.master.asisId;
    // 編號
    if (paramsAsisId !== '') {
      // 單頭
      collection.master = collection.master.map((mapData) => {
        const asisId: string = mapData.asisId;
        if (asisId === paramsAsisId) {
          mapData = params.master;
        }
        return mapData;
      });

      // 單身
      collection.detail = collection.detail.map((mapData) => {
        const asisId: string = mapData.asisId;
        if (asisId === paramsAsisId) {
          mapData.detail = params.detail;
        }
        return mapData;
      });
      // 單身明細

      const existChildrenIdx = [];
      collection.detailChildren = collection.detailChildren.map((mapData) => {
        const itemId: string = mapData.itemId;
        let idx = -1;
        params.detailChildren.forEach(child => {
          idx++;
          if (itemId === child.itemId) {
            mapData.detail = child.detail;
            existChildrenIdx.push(idx);
          }
        });
        return mapData;
      });
      for (let i = 0; i < params.detailChildren.length; i++) {
        const idx = existChildrenIdx.indexOf(i);
        // 新增的明細
        if (idx < 0) {
          collection.detailChildren.push(params.detailChildren[i]);
        }
      }

    }
    console.log(collection);
    demo1AsisModel.mockData = collection;

    mockResp.response.status = true;
    mockResp.response.description = paramsAsisId + ' 修改成功';

    return mockResp;
  }

  deleteMethod({ collection, collectionName, headers, id, url }: RequestInfo): any {
    return [];
  }

  putMethod({ collection, collectionName, headers, id, req, url }: RequestInfo): any {
    return [];
  }
}

export let demo1AsisModify = new Demo1AsisModifyMockData();
