import { Component, ViewEncapsulation } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-column-sorting',
  template: `
    <ag-grid-angular
      #agGrid
      style="flex: auto;"
      id="myGrid"
      [rowData]="rowData"
      class="ag-theme-material"
      [columnDefs]="columnDefs"
      [debug]="true"
      [enableSorting]="true"
      [enableColResize]="true"
      (gridReady)="onGridReady($event)"
    ></ag-grid-angular>
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
      }
    `
  ]
})
export class RowSortingComponent {
  private gridApi;
  private gridColumnApi;
  rowData: any;

  columnDefs;

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

    this.http
      .get('https://api.myjson.com/bins/ztxog')
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

  clearPinned(): void {
    this.gridColumnApi.setColumnPinned('rowNum', null);
    this.gridColumnApi.setColumnPinned('athlete', null);
    this.gridColumnApi.setColumnPinned('age', null);
    this.gridColumnApi.setColumnPinned('country', null);
    this.gridColumnApi.setColumnPinned('total', null);
  }

  resetPinned(): void {
    this.gridColumnApi.setColumnPinned('rowNum', 'left');
    this.gridColumnApi.setColumnPinned('athlete', 'left');
    this.gridColumnApi.setColumnPinned('age', 'left');
    this.gridColumnApi.setColumnPinned('country', null);
    this.gridColumnApi.setColumnPinned('total', 'right');
  }

  pinCountry(): void {
    this.gridColumnApi.setColumnPinned('rowNum', null);
    this.gridColumnApi.setColumnPinned('athlete', null);
    this.gridColumnApi.setColumnPinned('age', null);
    this.gridColumnApi.setColumnPinned('country', 'left');
    this.gridColumnApi.setColumnPinned('total', null);
  }
}
