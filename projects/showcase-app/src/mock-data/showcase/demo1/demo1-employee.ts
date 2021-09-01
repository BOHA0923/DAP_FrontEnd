import { RequestInfo } from 'angular-in-memory-web-api';
import { IDwMockData } from '@webdpt/framework/mock';
const demo1Empoyree = require('./demo1-employee.json');

class EmployeeMockData implements IDwMockData {
  get data(): any {
    return demo1Empoyree;
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

export let demo1Employee = new EmployeeMockData();
