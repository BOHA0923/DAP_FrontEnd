import { RequestInfo } from 'angular-in-memory-web-api';
import { IDwMockData } from '@webdpt/framework/mock';
const demo1Gridster = require('./demo1-gridster.json');

class GridsterMockData implements IDwMockData {
  get data(): any {
    return demo1Gridster;
  }

  // GET
  getMethod(reqInfo: RequestInfo): any {
    return reqInfo.collection;
  }

  // POST
  postMethod(reqInfo: RequestInfo | any): any {
    const mockResp = [];
    reqInfo.collection.response.forEach(item => {
      const object = Object.assign({}, item); // 因為會對item做取代, 所以, 需要跟原object拖勾.
      mockResp.push(object);
    });

    return mockResp;
  }

  // DELETE
  deleteMethod(reqInfo: RequestInfo): any {
    return [];
  }

  // PUT
  putMethod(reqInfo: RequestInfo): any {
    return [];
  }

}

export let demo1GridsterList = new GridsterMockData();
