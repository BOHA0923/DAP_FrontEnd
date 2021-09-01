import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { DwDapHttpClient } from '@webdpt/framework/dap';
import {
  DwSelectModalService,
  IDwSelectModalCustomizeConfig,
  ApiServerPagingService
} from '@webdpt/components/modals/select';

@Injectable()
export class DemoOrderServerPagingService {
  public config: IDwSelectModalCustomizeConfig;

  constructor(
    private selectModalService: DwSelectModalService,
    private http: DwDapHttpClient
  ) {
    this.http = http;
    this.config = {
      modalTitle: 'select-modal-demo-order-modalTitle',
      tableMultiSelect: true,
      tableIdField: 'orderid',
      tableNameField: 'orderdate',
      tableColDefs: [
        {title: 'select-modal-demo-order-orderId', field: 'orderid'},
        {title: 'select-modal-demo-order-orderDate', field: 'orderdate'},
        {title: 'select-modal-demo-order-status', field: 'status'},
        {title: 'select-modal-demo-order-customerId', field: 'customerid'},
        {title: 'select-modal-demo-order-orderAddr', field: 'address'},
        {title: 'select-modal-demo-order-total', field: 'totalcount'},
        {title: 'select-modal-demo-order-salesmanName', field: 'employeename'},
        {title: 'select-modal-demo-order-gender', field: 'gender'}
      ],
      dataSource: new ApiServerPagingService(
        this.http as any,
        'restful/service/DEMO_DAP_CURRENT/DemoOrder/List',
        'demo_order',
        ['orderid', 'orderdate', 'employeeid', 'customerid']
      )
    };
  }

  public open(selected: Array<any>): Observable<any> {
    return this.selectModalService.open(this.config, selected);
  }

}
