import { RequestInfo } from 'angular-in-memory-web-api';
import { IDwMockData } from '@webdpt/framework/mock';
const demo1Customers = require('./demo1-customer.json');

class CustomerMockData implements IDwMockData {
  get data(): any {
    return demo1Customers;
  }

  // GET
  getMethod(reqInfo: RequestInfo): any {
    return reqInfo.collection;
  }

  // POST
  postMethod(reqInfo: RequestInfo | any): any {
    return reqInfo.collection;
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

export let demo1Customer = new CustomerMockData();
