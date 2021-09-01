import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { TranslateService } from '@ngx-translate/core';

import {
  DwSelectModalService,
  IDwSelectModalCustomizeConfig,
  IDwSelectModalTableDataEnum
} from '@webdpt/components/modals/select';
import { EnumDataSourceService } from './enum-data-source.service';
import { InputListwinCustomPipe } from '../../../programs/demo2/input-listwin/input-listwin-custom.pipe';


@Injectable()
export class EnumClientPagingService {
  public config: IDwSelectModalCustomizeConfig;

  constructor(
    private selectModalService: DwSelectModalService,
    private http: HttpClient,
    private translateService: TranslateService,
    private customPipe: InputListwinCustomPipe
  ) {
    // 枚舉值的字段
    const statusEnum: IDwSelectModalTableDataEnum = {
      0: 'false',
      1: 'true'
    };

    // 枚舉值的字段
    const genderEnum: IDwSelectModalTableDataEnum = {
      'female': this.translateService.instant('select-modal-enum-gender-female'),
      'male': this.translateService.instant('select-modal-enum-gender-male')
    };

    this.http = http;
    this.config = {
      modalTitle: 'select-modal-enum-modalTitle',
      tableMultiSelect: true,
      tableIdField: 'orderId',
      tableNameField: 'orderDate',
      tableColDefs: [
        {title: 'select-modal-enum-orderId', field: 'orderId', dataPipe: 'lowercase', dataClass: 'color-10'},
        {title: 'select-modal-enum-orderDate', field: 'orderDate', dataPipe: 'date:fullDate|uppercase'},
        {title: 'select-modal-enum-status', field: 'status', isSort: false, dataPipe: 'i18nSelect', dataEnum: statusEnum},
        {title: 'select-modal-enum-customerId', field: 'customerId', dataPipe: 'custom:color:red', customPipe: this.customPipe},
        {title: 'select-modal-enum-customerName', field: 'customerName', dataPipe: 'titlecase'},
        {title: 'select-modal-enum-orderAddr', field: 'orderAddr', dataPipe: 'json|uppercase'},
        {title: 'select-modal-enum-total', field: 'total', dataPipe: 'currency:CNY:symbol:4.2-2'},
        {title: 'select-modal-enum-salesmanName', field: 'salesmanName', dataPipe: 'keyvalue'},
        {title: 'select-modal-enum-gender', field: 'gender', dataPipe: 'i18nSelect', dataEnum: genderEnum}
      ],
      dataSource: new EnumDataSourceService(this.http, 'showcase/demo2/input-listwin/getInputListwinEnumData')
    };

  }

  public open(selected: Array<any>): Observable<any> {
    return this.selectModalService.open(this.config, selected);
  }

}
