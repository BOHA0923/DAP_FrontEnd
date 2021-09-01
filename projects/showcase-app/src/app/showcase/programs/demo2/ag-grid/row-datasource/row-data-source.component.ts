import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GridApi } from 'ag-grid-community';

@Component({
  selector: 'app-row-data-source',
  template: `
    <div>
      <dw-radio-group [(ngModel)]="rowSelection">
        <label dw-radio dwValue="single">單選</label>
        <label dw-radio dwValue="multiple">多選</label>
      </dw-radio-group>
    </div>
    <ag-grid-angular
      #agGrid
      style="flex: 1;"
      id="myGrid"
      [rowData]="rowData"
      class="ag-theme-material"
      [columnDefs]="columnDefs"
      [debug]="true"
      [enableSorting]="true"
      [enableColResize]="true"
      [rowSelection]="rowSelection"
      [rowModelType]="'infinite'"
      (selectionChanged)="onSelectionChanged()"
      (gridReady)="onGridReady($event)"
    ></ag-grid-angular>
    <div>{{ dataInfo | json }}</div>
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
    `
  ]
})
export class RowDataSourceComponent {
  private gridApi: GridApi;
  private gridColumnApi: any;
  rowData: any;
  rowSelection: string = 'single';
  dataInfo: any;
  columnDefs: any;
  paginationPageSize = 10;

  constructor(private http: HttpClient) {
    this.columnDefs = [
      {
        headerName: '#',
        colId: 'rowNum',
        valueGetter: 'node.id',
        width: 40,
        pinned: 'left'
      },
      {
        headerName: 'Athlete',
        field: 'athlete',
        width: 150,
        pinned: 'left'
      },
      {
        headerName: 'Age',
        field: 'age',
        width: 90,
        pinned: 'left'
      },
      {
        headerName: 'Country',
        field: 'country',
        width: 160
      },
      {
        headerName: 'Year',
        field: 'year',
        width: 110
      },
      {
        headerName: 'Date',
        field: 'date',
        width: 160
      },
      {
        headerName: 'Sport',
        field: 'sport',
        width: 160
      },
      {
        headerName: 'Gold',
        field: 'gold',
        width: 100
      },
      {
        headerName: 'Silver',
        field: 'silver',
        width: 100
      },
      {
        headerName: 'Bronze',
        field: 'bronze'
      },
      {
        headerName: 'Total',
        field: 'total',

        pinned: 'right'
      }
    ];

  }

  onGridReady(params: any): void {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    // this.gridApi.addEventListener(Events.EVENT_SORT_CHANGED, (event: any) => {
    //   this.rowData = [];
    //   this.http
    //     .post('showcase/demo2/ag-grid/grid-data', {sort: event.api.getSortModel()})
    //     .subscribe((data: any): any => {
    //       this.rowData = data.body;
    //     });
    // });
    // this.http
    //   .get('showcase/demo2/ag-grid/grid-data')
    //   .subscribe((data: any): any => {
    //     this.rowData = data.body;
    //   });

    const sort = [
      {
        colId: 'age',
        sort: 'asc'
      }
    ];
    this.gridApi.setSortModel(sort);

    const httpClient = this.http;
    const dataSource = {
      rowCount: null,
      getRows: function (_params: any): void {
        console.log('%c asking for ' + _params.startRow + ' to ' + _params.endRow, 'background: #222; color: #bada55');
        httpClient
          .post('showcase/demo2/ag-grid/grid-data', {start: _params.startRow, end: _params.endRow})
          .subscribe((data: any): any => {
            let result = [...data.body];
            const pageSize = _params.endRow - _params.startRow;
            result = result.splice(_params.startRow, pageSize);
            _params.successCallback(result, data.length);
          });
      }
    };
    params.api.setDatasource(dataSource);
  }

  onSelectionChanged(): void {
    const selectedRows = this.gridApi.getSelectedRows();

    this.dataInfo = selectedRows;
  }
}
