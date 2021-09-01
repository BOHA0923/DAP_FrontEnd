import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Events, GridApi } from 'ag-grid-community';

@Component({
  selector: 'app-row-pagination',
  template: `
    <div>
      <dw-radio-group [(ngModel)]="rowSelection">
      <label dw-radio dwValue="single">單選</label>
      <label dw-radio dwValue="multiple">多選</label>
    </dw-radio-group></div>
    <ag-grid-angular
      #agGrid
      style="flex: 1;"
      id="myGrid"
      [rowData]="rowData"
      class="ag-theme-balham-dark"
      [columnDefs]="columnDefs"
      [debug]="true"
      [enableSorting]="true"
      [enableColResize]="true"
      [rowSelection]="rowSelection"
      [pagination]="true"
      [paginationPageSize]="paginationPageSize"
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
export class RowPaginationComponent {
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
        width: 120
      },
      {
        headerName: 'Year',
        field: 'year',
        width: 90
      },
      {
        headerName: 'Date',
        field: 'date',
        width: 110
      },
      {
        headerName: 'Sport',
        field: 'sport',
        width: 110
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
        width: 100,
        pinned: 'right'
      }
    ];

  }

  onGridReady(params: any): void {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.gridApi.addEventListener(Events.EVENT_SORT_CHANGED, (event: any) => {
      console.log(event.api.getSortModel());
    });
    this.http
      .get('showcase/demo2/ag-grid/grid-data')
      .subscribe((data: any): any => {
        this.rowData = data;
      });

    const sort = [
      {
        colId: 'age',
        sort: 'asc'
      }
    ];
    this.gridApi.setSortModel(sort);
  }

  onSelectionChanged(): void {
    const selectedRows = this.gridApi.getSelectedRows();

    this.dataInfo = selectedRows;
  }
}
