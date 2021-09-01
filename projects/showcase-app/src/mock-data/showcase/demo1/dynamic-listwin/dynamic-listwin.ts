import { RequestInfo } from 'angular-in-memory-web-api';
import { IDwMockData } from '@webdpt/framework/mock';
import { demo1DynamicListwin } from './dynamic-listwin-data';

class Demo1DynamicListwinMockData implements IDwMockData {

  get data(): any {
    return demo1DynamicListwin;
  }

  // (1) 是否返回开窗结果的scheam，如果当前请求的不是第一页的数据，此Tag无效，默认视为false.
  // (2) 是否返回总笔数，如果当前请求的不是第一页的数据，此Tag无效，默认视为false.
  getMethod(request: any): any {
    // 為了進行產生新的物件, 只用在單純只有資料的物件.
    const collection = JSON.parse(JSON.stringify(request.collection));
    if (!(request.query && request.query.get('queryInfo'))) {
      return collection;
    }

    // 取得queryInfo.
    const queryInfo = JSON.parse(request.query.get('queryInfo'));
    if (queryInfo.pageNumber === undefined && queryInfo.pageSize === undefined) {
      return {
        data: collection
      };
    }

    // 模擬排序.
    if (queryInfo.orderfields.length > 0) {
      const sortKey = queryInfo.orderfields[0].name;
      const sortVal = queryInfo.orderfields[0].orderby;
      const sortCollection = JSON.parse(JSON.stringify(collection.response.data.rows));
      collection.response.data.rows = sortCollection.sort(
        (a, b) => {
          return (sortVal === 'asc') ? (a[sortKey] > b[sortKey] ? 1 : -1) : (b[sortKey] > a[sortKey] ? 1 : -1);
        }
      );
    }

    const pageNumber = queryInfo.pageNumber;
    const pageSize = queryInfo.pageSize;
    const std_data = collection.response.data;
    // 模擬分頁.
    const datas = std_data.rows.slice((pageNumber - 1) * pageSize, pageNumber * pageSize);

    // 模擬CRUD的回參.
    const retData = {
      pageCount: Math.ceil(std_data.rows.length / pageSize), // 總頁數.
      pageSize: pageSize, // 分頁筆數.
      currentPage: pageNumber, // 當前頁數.
      rowCount: std_data.rows.length, // 總筆數.
      data: {
        rows: datas,
        picklists: std_data.picklists,
      }
    };

    // 模擬CRUD的回參-只有在 page=1 時, 會傳遞的值.
    if (pageNumber === 1) {
      retData.data['fields'] = std_data.fields;
      retData.data['keyInfo'] = std_data.keyInfo;
    }

    return retData;
  }

  postMethod(request: any): any {
    return request.collection;
  }

  deleteMethod(reqInfo: RequestInfo): any {
    return [];
  }

  putMethod(reqInfo: RequestInfo): any {
    return [];
  }
}

export let demo1DynamicListwinData = new Demo1DynamicListwinMockData();
