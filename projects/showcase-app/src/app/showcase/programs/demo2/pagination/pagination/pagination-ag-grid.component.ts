import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AG_GRID_FW_COMPONENTS } from '@webdpt/components/ag-grid-editors';
import { DwQueryInfo, DwQueryOrder } from '@webdpt/framework/document';
import { Observable } from 'rxjs';
import { GridApi } from 'ag-grid-community';

@Component({
  selector: 'app-pagination-ag-grid',
  template: `
    <ag-grid-angular
      #agGrid
      [rowData]="rowData"
      class="ag-theme-balham"
      [columnDefs]="columnDefs"
      [enableColResize]="true"
      [frameworkComponents]="frameworkComponents"
      (gridReady)="onGridReady($event)"
    ></ag-grid-angular>
    <div dw-row dwType="flex" dwJustify="center" style="margin: 10px 0;">

      <dw-pagination-server-side-wrap [dataSource]="orderService"
                                      [dwPageIndex]="pageNumber"
                                      [dwPageSize]="pageSize"
                                      [dwShowSizeChanger]="true"
                                      [queryInfo]="queryInfo"
                                      (dataSourceChange)="onDataSourceChange($event)">

      </dw-pagination-server-side-wrap>

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
export class PaginationAgGridComponent {
  orderService: any;
  pageNumber = 1;
  pageSize = 10;
  queryInfo: DwQueryInfo = new DwQueryInfo();
  rowData: any;
  columnDefs: any;
  frameworkComponents: any;
  gridApi: GridApi;
  constructor(private http: HttpClient) {

    // 指定資料來源的服務。
    // 可直接指定為CRUD或開窗組件的資料來源Service。
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
    // 後端會將當前的分頁資訊回傳，作業可於此處取得相關資訊以利後續作業的應用。
    this.pageNumber = result.currentPage;
    this.pageSize = result.pageSize;
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
