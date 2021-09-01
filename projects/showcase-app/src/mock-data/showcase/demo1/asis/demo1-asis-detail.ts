import { RequestInfo } from 'angular-in-memory-web-api';
import { IDwMockData } from '@webdpt/framework/mock';
const mockResponse = require('../../mock-response.json');
import { demo1AsisModel } from './demo1-asis.model';

class Demo1AsisDetailMockData implements IDwMockData {

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
      master: {},
      detail: [],
      detailChildren: []
    };

    // 模擬API查詢結果
    const paramsAsisId: string = params.asisId;
    // 訂單編號
    if (paramsAsisId !== '') {
      // 單頭
      collection.master = collection.master.filter((filterData) => {
        const asisId: string = filterData.asisId;
        if (asisId === paramsAsisId) {
          return filterData;
        }
      });
      // 單身
      collection.detail = collection.detail.filter((filterData) => {
        const asisId: string = filterData.asisId;
        if (asisId === paramsAsisId) {
          return filterData;
        }
      });
      // 單身明細
      const detailChildren: any[] = [];
      collection.detail[0].detail.forEach((filterData) => {
        const child = collection.detailChildren.filter((item) => {
          const itemId: string = item.itemId;
          if (itemId === filterData.itemId) {
            return item;
          }
        });
        if (child.length) {
          child.forEach((data) => {
            detailChildren.push(data);
          });
        }
      });
      collection.detailChildren = detailChildren;
    }

    if (collection.master.length > 0) {
      mockResp.response.master = collection.master[0];
    }

    if (collection.detail.length > 0) {
      mockResp.response.detail = collection.detail[0].detail;
    }
    if (collection.detailChildren.length > 0) {
      mockResp.response.detailChildren = collection.detailChildren;
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

export let demo1AsisDetail = new Demo1AsisDetailMockData();
