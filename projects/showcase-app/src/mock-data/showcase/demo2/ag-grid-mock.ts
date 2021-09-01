import { RequestInfo } from 'angular-in-memory-web-api';
import { IDwMockData } from '@webdpt/framework/mock';

const mockResponse = require('./ag-grid.data.json');
const largeDataResponse = require('./ag-grid-large.data.json');

class AgGridMock implements IDwMockData {

  private datas: Array<any> = [];

  get data(): any {
    mockResponse.forEach((item, index) => {
      this.datas.push({
        id: index + 1,
        ...item
      });
    });
    return this.datas;
  }

  get largeData(): any {
    const data = [];
    performance.mark('mock_data_iterator');
    largeDataResponse.forEach((item, index) => {
      data.push({
        id: index + 1,
        ...item
      });
    });
    performance.measure('mock_data_iterator');
    return data;
  }

  getMethod(reqInfo: any): any {
    return reqInfo.collection;
  }

  postMethod(request: any): any {

    const collection = request.collection;

    if (!(request.req.body && request.req.body.params)) {
      return collection;
    }
    if (request.req.body.params.pageNumber === undefined && request.req.body.params.pageSize === undefined) {
      return {
        data: collection
      };
    }
    const pageNumber = request.req.body.params.pageNumber;
    const pageSize = request.req.body.params.pageSize;
    const datas = collection.slice((pageNumber - 1) * pageSize, pageNumber * pageSize);
    return {
      rowCount: collection.length,
      pageCount: Math.ceil(collection.length / pageSize),
      pageSize: pageSize,
      currentPage: pageNumber,
      data: datas
    };
  }

  deleteMethod({collection, collectionName, headers, id, url}: RequestInfo): any {
    return [];
  }

  putMethod({collection, collectionName, headers, id, req, url}: RequestInfo): any {
    return [];
  }
}

export let agGridMock = new AgGridMock();
