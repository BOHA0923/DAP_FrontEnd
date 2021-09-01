import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { IAfterGuiAttachedParams, IDoesFilterPassParams, IFilterParams, RowNode } from 'ag-grid-community';
import { IFilterAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'dw-ag-text-column-filter',
  template: `
    <input dw-input placeholder="" [(ngModel)]="filterText" (ngModelChange)="filterChanged()" #filterInput>
  `,
  styles: []
})
export class DwAgTextColumnFilterComponent implements IFilterAngularComp, OnDestroy {
  params: IFilterParams | any;
  valueGetter: (rowNode: RowNode) => any;
  filterText: any = null;
  columnId;
  @ViewChild('filterInput') filterInput: ElementRef;

  constructor() {
  }

  afterGuiAttached(): void {
    if (this.filterInput) {
      this.filterInput.nativeElement.focus();
    }
  }

  agInit(params: IFilterParams): void {
    this.params = params;
    this.columnId = params.column.getColId();
    this.valueGetter = params.valueGetter;
  }

  doesFilterPass(params: IDoesFilterPassParams): boolean {
    const cellValue = this.valueGetter(params.node);

    return cellValue.toString().toLowerCase().indexOf(this.filterText.toString().toLowerCase()) >= 0;
  }

  getFrameworkComponentInstance(): any {
    return this;
  }

  getModel(): any {
    return {value: this.filterText};
  }

  setModel(model: any): void {
    this.filterText = model ? model.value : '';
  }

  isFilterActive(): boolean {
    return this.filterText !== null &&
      this.filterText !== undefined &&
      this.filterText !== '';
  }

  ngOnDestroy(): void {
  }

  onFloatingFilterChanged(change: any): void {
    this.filterText = change;
    this.params.filterChangedCallback();
  }

  onNewRowsLoaded(): void {
  }

  filterChanged(): void {
    this.params.filterChangedCallback();
  }
}
