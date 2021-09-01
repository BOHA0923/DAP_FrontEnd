import { RequestInfo } from 'angular-in-memory-web-api';
import { IDwMockData } from '@webdpt/framework/mock';
const mockResponse = require('../mock-response.json');
import { demo1OrderModel } from './demo1-order.model';

class Demo1OrderListMockData implements IDwMockData {

  get data(): any {
    const mockData = demo1OrderModel.mockData;

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
    const collectionDb = <any>demo1OrderModel.mockData;
    let collection = [...collectionDb.master];

    const mockResp = <any>JSON.parse(JSON.stringify(mockResponse));
    mockResp.response = {
      currentPage: 0, // 當前頁碼
      rowCount: 0, // 總筆數
      pageCount: 0, // 總頁數
      datas: [] // 資料
    };

    // 模擬API查詢結果
    const sortSet = params.sortSet || []; // 排序欄位
    mockResp.response.currentPage = params.currentPage;
    const paramsPageSize = params.pageSize;
    const paramsStatus: Array<string> = params.param.status || [];
    const paramsOrderId: string = params.param.orderId || '';
    const paramsTotal: string = params.param.total || '';
    const paramsCustomerName: string = params.param.customerName;
    const paramsSalesmanName: string = params.param.salesmanName;
    const paramsGender: Array<string> = params.param.gender || [];

    if (!(paramsStatus.length === 0 && paramsOrderId === '' && paramsTotal === ''
      && paramsCustomerName === '' && paramsSalesmanName === '' && paramsGender.length === 0)) {

      // 訂單編號
      if (paramsOrderId) {
        collection = collection.filter((filterData) => {
          const orderId: string = filterData.orderId;
          if (orderId.indexOf(paramsOrderId) !== -1) {
            return filterData;
          }
        });
      }

      // 狀態碼
      if (paramsStatus.length > 0) {
        collection = collection.filter((filterData) => {
          const status: string = filterData.status;
          for (let i = 0; i < paramsStatus.length; i++) {
            const str = paramsStatus[i];
            if (status === str) {
              return filterData;
            }
          }
        });
      }

      // 訂單總額
      if (paramsTotal) {
        collection = collection.filter((filterData) => {
          const total: string = filterData.total.toString();
          if (total === paramsTotal) {
            return filterData;
          }
        });
      }

      // 客戶名稱
      if (paramsCustomerName) {
        collection = collection.filter((filterData) => {
          const customerName: string = filterData.customerName;
          if (customerName.indexOf(paramsCustomerName) !== -1) {
            return filterData;
          }
        });
      }

      // 業務員姓名
      if (paramsSalesmanName) {
        collection = collection.filter((filterData) => {
          const salesmanName: string = filterData.salesmanName;
          if (salesmanName.indexOf(paramsSalesmanName) !== -1) {
            return filterData;
          }
        });
      }
    }

    // 業務員性別
    if (paramsGender.length > 0) {
      collection = collection.filter((filterData) => {
        const gender: string = filterData.gender;
        for (let i = 0; i < paramsGender.length; i++) {
          const str = paramsGender[i];
          if (gender === str) {
            return filterData;
          }
        }
      });
    }

    if (collection) {
      mockResp.response.rowCount = collection.length;
      if (mockResp.response.rowCount > 0) {

        // 排序
        sortSet.forEach((element, index, array) => {
          // 由小到大：'ascend',由大到小：'descend'
          collection = [...collection.sort((a, b) => {
            if (a[element.sortName] > b[element.sortName]) {
              return (element.sortExpression === 'ascend') ? 1 : -1;
            } else if (a[element.sortName] < b[element.sortName]) {
              return (element.sortExpression === 'ascend') ? -1 : 1;
            } else {
              return 0; // 兩者相等，不會改變順序
            }
          })];
        });

        mockResp.response.pageCount = Math.ceil(mockResp.response.rowCount / paramsPageSize);
        // if (mockResp.response.currentPage > mockResp.response.pageCount) {
        //   mockResp.response.currentPage = mockResp.response.pageCount;
        // }

        let startIdx = 0;
        if (mockResp.response.currentPage > 1) {
          startIdx = (mockResp.response.currentPage - 1) * paramsPageSize;
        }

        let endIdx = mockResp.response.currentPage * paramsPageSize;
        if (endIdx > mockResp.response.rowCount) {
          endIdx = mockResp.response.rowCount;
        }

        for (let i = startIdx; i < endIdx; i++) {
          mockResp.response.datas.push(collection[i]);
        }
      }
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

export let demo1OrderList = new Demo1OrderListMockData();
