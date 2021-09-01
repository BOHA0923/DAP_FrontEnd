import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AG_GRID_FW_COMPONENTS } from '@webdpt/components/ag-grid-editors';
import { DwQueryInfo, DwQueryOrder } from '@webdpt/framework/document';
import { Observable } from 'rxjs';
import { GridApi } from 'ag-grid-community';

@Component({
  selector: 'app-pagination-ag-grid-cs',
  template: `
    <ag-grid-angular
      #agGrid
      [rowData]="rowData"
      class="ag-theme-balham"
      [columnDefs]="columnDefs"
      [pagination]="true"
      [paginationPageSize]="pageSize"
      [suppressPaginationPanel]="true"
      [suppressScrollOnNewData]="true"
      [enableColResize]="true"
      [frameworkComponents]="frameworkComponents"
      (gridReady)="onGridReady($event)"
    ></ag-grid-angular>
    <div dw-row dwType="flex" dwJustify="center" style="margin: 10px 0;">
      <button (click)="pagination.reSendData()">ReSendData</button>
      <dw-pagination-client-side-wrap #pagination
                                      [dataSource]="orderService"
                                      [queryInfo]="queryInfo"
                                      [dwPageIndex]="pageNumber"
                                      [dwPageSize]="pageSize"
                                      [agGridComponent]="agGrid"
                                      [dwShowSizeChanger]="true"
                                      (dataSourceChange)="onDataSourceChange($event)">

      </dw-pagination-client-side-wrap>

    </div>
  `,
  styles: [
    `
      :host {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        display: flex;
        flex-direction: column;
      }
      :host ag-grid-angular{
        flex: 1;
      }
    `
  ]
})
export class PaginationAgGridCsComponent {
  orderService: any;
  pageNumber = 1;
  pageSize = 10;
  queryInfo: DwQueryInfo = new DwQueryInfo();
  rowData: any;
  columnDefs: any;
  frameworkComponents: any;
  gridApi: GridApi;
  constructor(private http: HttpClient) {

    this.queryInfo.pageable = false; // QueryInfo.pageable = false時，wrapper不再代理任何事件

    this.orderService = new class {

      constructor(private _http: HttpClient, private _url: string) { }

      getDataList(pageNumber: number, pageSize: number, queryInfo: DwQueryInfo): Observable<any> {
        queryInfo.pageNumber = pageNumber;
        queryInfo.pageSize = pageSize;
        return this._http.post(this._url, {
          params: queryInfo.getRawValue()
        });
      }
    }(
      this.http, 'showcase/demo2/ag-grid/grid-data'
    );

    this.createColumnDefs();
    this.frameworkComponents = AG_GRID_FW_COMPONENTS;
  }

  onGridReady(params: any): void {
    this.gridApi = params.api;
  }

  onDataSourceChange(result: any): void {
    this.gridApi.setRowData(result.data);
  }

  createColumnDefs(): void {
    this.columnDefs = [
      { field: 'id' },
      { field: 'athlete' },
      { field: 'age' },
      { field: 'sport' }
    ];
  }

}
