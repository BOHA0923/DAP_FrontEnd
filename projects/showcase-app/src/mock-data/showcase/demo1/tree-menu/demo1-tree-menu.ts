import { RequestInfo } from 'angular-in-memory-web-api';
import { IDwMockData } from '@webdpt/framework/mock';
const demo1TreeMenuModel = require('./demo1-tree-menu.json');

class Demo1TreeMenuMockData implements IDwMockData {

  get data(): any {
    return demo1TreeMenuModel;
  }

  getMethod(reqInfo: any): any {
    return reqInfo.collection;
  }

  postMethod(reqInfo: any): any {
    return reqInfo.collection;
  }

  deleteMethod(reqInfo: RequestInfo): any {
    return [];
  }

  putMethod(reqInfo: RequestInfo): any {
    return [];
  }
}

export let demo1TreeMenu = new Demo1TreeMenuMockData();
