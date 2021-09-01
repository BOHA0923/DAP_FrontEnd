import { RequestInfo } from 'angular-in-memory-web-api';
import { IDwMockData } from '@webdpt/framework/mock';
// const demo1Customers = require('./demo1-customer.json');

class DocumentOrderMockData implements IDwMockData {
  get data(): any {
    return [];
  }

  getList(reqInfo: RequestInfo): any {
    return {
      'duration': 5,
      'statusDescription': 'OK',
      'response': {
        'rowCount': 7,
        'pageCount': 1,
        'pageSize': 20,
        'currentPage': 1,
        'message': null,
        'success': true,
        'data': {
          'demo_order': [
            {
              'totalcount': null,
              'address': null,
              'gender': null,
              'orderid': '20180613001',
              'customerid': 'c01',
              'orderdate': 'Jun 13, 2018',
              'employeeid': 'e01',
              'employeename': null,
              'status': 'C'
            },
            {
              'totalcount': null,
              'address': null,
              'gender': null,
              'orderid': '20180613002',
              'customerid': 'c03',
              'orderdate': 'Jun 13, 2018',
              'employeeid': 'e02',
              'employeename': null,
              'status': 'C'
            },
            {
              'totalcount': null,
              'address': null,
              'gender': null,
              'orderid': '20180619001',
              'customerid': 'c02',
              'orderdate': 'Jun 19, 2018',
              'employeeid': 'e02',
              'employeename': null,
              'status': 'C'
            },
            {
              'totalcount': null,
              'address': null,
              'gender': null,
              'orderid': '20180619002',
              'customerid': 'c02',
              'orderdate': 'Jun 19, 2018',
              'employeeid': 'e02',
              'employeename': null,
              'status': 'C'
            },
            {
              'totalcount': null,
              'address': null,
              'gender': null,
              'orderid': '20180620001',
              'customerid': 'c02',
              'orderdate': 'Jun 20, 2018',
              'employeeid': 'e02',
              'employeename': null,
              'status': 'C'
            },
            {
              'totalcount': null,
              'address': null,
              'gender': null,
              'orderid': '20180621001',
              'customerid': 'c02',
              'orderdate': 'Jun 21, 2016',
              'employeeid': 'e02',
              'employeename': null,
              'status': 'C'
            },
            {
              'totalcount': null,
              'address': null,
              'gender': null,
              'orderid': '20180622001',
              'customerid': 'c02',
              'orderdate': 'Jun 21, 2016',
              'employeeid': 'e02',
              'employeename': null,
              'status': 'C'
            }
          ]
        }
      },
      'profile': {
        'primerKey': '0aedcec3-d901-4932-9dd8-a62e43b7f73c',
        'userName': '王明明',
        'userId': 'u001'
      },
      'uuid': '',
      'status': 200
    };
  }

  // GET
  getMethod(reqInfo: RequestInfo): any {
    return {
      'duration': 5,
      'statusDescription': 'OK',
      'response': {
        'message': null,
        'success': true,
        'data': {
          'demo_order': [
            {
              'totalcount': null,
              'address': null,
              'gender': null,
              'orderid': '20180613001',
              'orderdate': 'Jun 13, 2018',
              'employeeid': 'e01',
              '$state': 'U',
              'customerid': 'c01',
              'customername': 'Janet Huang',
              'employeename': null,
              'status': 'C'
            }
          ],
          'demo_orderdetail': [
            {
              'quantity': 2,
              'productid': '4',
              'orderid': '20180613001',
              'deliverystatus': '1',
              'price': 100,
              'count': 0,
              'seq': 4
            },
            {
              'quantity': 2,
              'productid': 'jj',
              'orderid': '20180613001',
              'deliverystatus': '1',
              'price': 0,
              'count': 0,
              'seq': 5
            }
          ]
        }
      },
      'profile': {
        'primerKey': '0aedcec3-d901-4932-9dd8-a62e43b7f73c',
        'userName': '王明明',
        'userId': 'u001'
      },
      'uuid': '',
      'status': 200
    };
  }

  // POST
  postMethod(reqInfo: RequestInfo | any): any {
    return {
      success: true
    };
  }

  // DELETE
  deleteMethod(reqInfo: RequestInfo): any {
    return {
      success: true
    };
  }

  // PUT
  putMethod(reqInfo: RequestInfo): any {
    return {
      success: true
    };
  }
}

export let demo1DocumentOrder = new DocumentOrderMockData();
