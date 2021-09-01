import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { DwSelectModalService, IDwSelectModalCustomizeConfig } from '@webdpt/components/modals/select';
import { CustomerDataSourceService } from './customer-data-source.service';

/**
 * 一個開窗需建立一個目錄, 一個開窗 service 需對應一個 DataSource.
 */
@Injectable()
export class CustomerClientPagingService {
  public config: IDwSelectModalCustomizeConfig;

  constructor(
    private selectModalService: DwSelectModalService,
  ) {
    this.config = {
      modalTitle: 'dw-document-order-員工編號',
      tableMultiSelect: false,
      tableIdField: 'id',
      tableNameField: 'name',
      tableColDefs: [
        {title: 'dw-document-order-員工編號', field: 'id', width: '50%'},
        {title: 'dw-document-order-員工姓名', field: 'name', width: '50%'}
      ],
      dataSource: new CustomerDataSourceService()
    };

  }

  public open(selected: Array<any>): Observable<any> {
    return this.selectModalService.open(this.config, selected);
  }

}
