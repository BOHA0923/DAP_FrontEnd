import { RequestInfo } from 'angular-in-memory-web-api';
import { IDwMockData } from '@webdpt/framework/mock';
const mockResponse = require('../../mock-response.json');
import { demo1AsisModel } from './demo1-asis.model';

class Demo1AsisListMockData implements IDwMockData {

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
    let collection = [...collectionDb.master];
    // console.log(collection);
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
    const paramsAsisId: string = params.param.asisId || '';
    const paramsAsisName: string = params.param.asisName || '';
    const paramsCurrencyId: string = params.param.currencyId;
    const paramsCurrencyName: string = params.param.currencyName;
    const paramsSourceId: string = params.param.currencyName;

    if (!(paramsStatus.length === 0 && paramsAsisId === '' && paramsAsisName === '')) {

      // 編號
      if (paramsAsisId) {
        collection = collection.filter((filterData) => {
          const asisId: string = filterData.asisId;
          if (asisId.indexOf(paramsAsisId) !== -1) {
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


      // 來源編號
      if (paramsSourceId) {
        collection = collection.filter((filterData) => {
          const sourceId: string = filterData.sourceId.toString();
          if (sourceId.indexOf(paramsSourceId) !== -1) {
            return filterData;
          }
        });
      }
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

export let demo1AsisList = new Demo1AsisListMockData();
