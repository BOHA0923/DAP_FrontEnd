import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import {
  IFilterParams, RowNode, IFloatingFilterParams, SerializedTextFilter, IFloatingFilter, IAfterGuiAttachedParams
} from 'ag-grid-community';

import { AgFrameworkComponent } from 'ag-grid-angular/src/interfaces';

export interface TextFloatingFilterChange {
  model: any;
}

export interface TextFloatingFilterParams extends IFloatingFilterParams<SerializedTextFilter, TextFloatingFilterChange> {
  value: number;
}

@Component({
  selector: 'dw-ag-text-column-floating-filter',
  template: `
    <input dw-input placeholder="" [(ngModel)]="filterText" (ngModelChange)="filterChanged()" #filterInput>
  `,
  styles: []
})
export class DwAgTextColumnFloatingFilterComponent implements
  IFloatingFilter<SerializedTextFilter, TextFloatingFilterChange, TextFloatingFilterParams>, AgFrameworkComponent<TextFloatingFilterParams>,
  OnDestroy {
  params: TextFloatingFilterParams | any;

  filterText: any = null;

  @ViewChild('filterInput') filterInput: ElementRef;

  agInit(params: TextFloatingFilterParams): void {
    this.params = params;
  }

  filterChanged(): void {
    this.params.onFloatingFilterChanged(this.filterText);
  }

  afterGuiAttached(): void {
  }

  ngOnDestroy(): void {
  }

  onParentModelChanged(parentModel: any): void {
    this.filterText = parentModel ? parentModel.value : '';
  }
}
