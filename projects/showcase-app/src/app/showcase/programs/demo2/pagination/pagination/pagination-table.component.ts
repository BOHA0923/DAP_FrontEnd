import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DwQueryInfo } from '@webdpt/framework/document';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-pagination-table',
  template: `
    <dw-table #basicTable [dwShowPagination]="false" [dwData]="dataSet" [dwPageSize]="pageSize">
      <thead>
      <tr>
        <th>Id</th>
        <th>Athlete</th>
        <th>Age</th>
        <th>Sport</th>
        <th>Action</th>
      </tr>
      </thead>
      <tbody>
      <tr *ngFor="let data of basicTable.data">
        <td>{{data.id}}</td>
        <td>{{data.athlete}}</td>
        <td>{{data.age}}</td>
        <td>{{data.sport}}</td>
        <td>
          <a>Action{{data.name}}</a>
          <dw-divider dwType="vertical"></dw-divider>
          <a>Delete</a>
        </td>
      </tr>
      </tbody>
    </dw-table>
    <div dw-row dwType="flex" dwJustify="center" style="margin: 10px 0;">

      <dw-pagination-server-side-wrap [dataSource]="orderService"
                                      [dwPageIndex]="pageNumber"
                                      [dwPageSize]="pageSize"
                                      [queryInfo]="queryInfo"
                                      [dwShowSizeChanger]="true"
                                      (dataSourceChange)="onDataSourceChange($event)">

      </dw-pagination-server-side-wrap>

    </div>
  `
})
export class PaginationTableComponent {
  orderService: any;
  pageNumber = 1;
  pageSize = 10;
  queryInfo: DwQueryInfo = new DwQueryInfo();
  dataSet: any;

  constructor(private http: HttpClient) {

    this.orderService = new (class {

      constructor(private _http: HttpClient, private _url: string) {
      }

      getDataList(pageNumber: number, pageSize: number, queryInfo: DwQueryInfo): Observable<any> {

        queryInfo.pageNumber = pageNumber;
        queryInfo.pageSize = pageSize;
        return this._http.post(this._url, {
          params: queryInfo.getRawValue()
        });

      }
    })(this.http, 'showcase/demo2/ag-grid/grid-data');

  }

  onDataSourceChange(result: any): void {
    // 後端會將當前的分頁資訊回傳，作業可於此處取得相關資訊以利後續作業的應用。
    this.pageNumber = result.currentPage;
    this.pageSize = result.pageSize;
    this.dataSet = result.data;
  }

}
