import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';

import { IAfterGuiAttachedParams, IDoesFilterPassParams, IFilterParams, RowNode } from 'ag-grid-community';
import { IFilterAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'dw-button-filter',
  template: `
    <form>
      <dw-form-control>
        <dw-input-group dwSearch [dwAddOnAfter]="suffix_2" dwSize="small">
          <input dw-input placeholder="請選擇" name="filterValue" [(ngModel)]="filterValue" #filterInput readonly>
        </dw-input-group>
      </dw-form-control>
    </form>
    <ng-template #suffix_2>
      <button dwSize="small" class="clearIcon" dw-button dwType="default" (click)="clear()">
        <i dw-icon dwType="close" dwTheme="outline"></i></button>
      <button dwSize="small" dw-button dwType="primary" dwSearch (click)="openModal()">
        <i dw-icon dwType="search" dwTheme="outline"></i>
      </button>
    </ng-template>
  `, styles: [
      `
      .clearIcon {
        height: 16px;
        border: none;
      }

      input {
        height: unset;
      }
    `
  ]
})
export class ButtonEditorFilterComponent implements IFilterAngularComp, AfterViewInit {

  params: IFilterParams | any;
  valueGetter: (rowNode: RowNode) => any;
  filterValue: any = null;
  modalService: any;

  @ViewChild('filterInput') filterInput: ElementRef;

  constructor() { }


  // The ag Framework expects to find the agInit (on the AgFilterComponent interface)
  // method on the created component, and uses it to supply the 'filter params'.
  agInit(params: IFilterParams): void {
    this.params = params;
    this.valueGetter = params.valueGetter;
    this.modalService = params['modalService'];
  }


  // 清除條件
  clear(): void {
    this.filterValue = null;
    this.filterChanged();
  }

  // 開窗
  openModal(): void {
    if (!this.modalService) {
      return;
    }
    // 變更開窗的設定
    if (typeof this.params.tableMultiSelect === 'boolean') {
      this.modalService.config.tableMultiSelect = this.params.tableMultiSelect;
    }
    if (this.params.tableIdField) {
      this.modalService.config.tableIdField = this.params.tableIdField;
    }

    this.modalService.open(this.filterValue).subscribe(
      (result) => {
        this.filterValue = result.length === 0 ? null : result;
        this.filterChanged();
      }
    );
  }

  private filterChanged(): void {
    this.params.filterChangedCallback();
  }


  afterGuiAttached(): void { }

  doesFilterPass(params: IDoesFilterPassParams): boolean {
    const columnValue = Array.prototype.concat(this.valueGetter((params.node)));

    for (let filterIdx = 0; filterIdx < this.filterValue.length; filterIdx++) {
      if (columnValue.includes(this.filterValue[filterIdx])) {
        return true;
      }
    }
  }

  getFrameworkComponentInstance(): any {
    return this;
  }

  getModel(): any {
    return {value: this.filterValue};
  }

  getModelAsString(model: any): string {
    return JSON.stringify(this.filterValue);
  }

  isFilterActive(): boolean {
    return this.filterValue !== null && this.filterValue !== undefined && this.filterValue !== '';
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.filterInput.nativeElement.focus();
    });
  }

  onFloatingFilterChanged(change: any): void {
    this.filterValue = change;
    this.params.filterChangedCallback();
  }

  onNewRowsLoaded(): void { }

  setModel(model: any): void {
    this.filterValue = model ? model.value : null;
  }

}
