import { RequestInfo } from 'angular-in-memory-web-api';

export interface IDwMockData {
  data: any;
  getMethod(reqInfo: RequestInfo | any): any;
  postMethod(reqInfo: RequestInfo | any): any;
  deleteMethod(reqInfo: RequestInfo | any): any;
  putMethod(reqInfo: RequestInfo | any): any;
}
