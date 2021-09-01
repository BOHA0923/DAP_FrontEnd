import { Component, Renderer2 } from '@angular/core';

import { IAfterGuiAttachedParams, IFloatingFilter, RowNode, SerializedNumberFilter } from 'ag-grid-community';

import { IFloatingFilterParams } from 'ag-grid-community';
import { AgFrameworkComponent } from 'ag-grid-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


export interface ButtonEditorFloatingFilterChange {
  model: SerializedNumberFilter;
}

export interface ButtonEditorFloatingFilterParams
  extends IFloatingFilterParams<SerializedNumberFilter, ButtonEditorFloatingFilterChange> {
  value: Array<string>;
}

@Component({
  selector: 'dw-floating-button-filter',
  template: `
      <dw-input-group dwSearch [dwAddOnAfter]="suffix_2" dwSize="small" class="ag-floating-button">
        <input dwSize="small" dw-input placeholder="" name="filterValue" [(ngModel)]="filterValue" #filterInput readonly>
      </dw-input-group>

    <ng-template #suffix_2>
      <span dwSize="small" class="clearIcon" dw-button dwType="default" (click)="clear()" *ngIf="filterValue">
        <i dw-icon dwType="close-circle" dwTheme="outline"></i>
      </span>
      <span dwSize="small" dw-button dwType="primary" (click)="openModal()" class="searchButton">
        <i dw-icon dwType="search" dwTheme="outline"></i>
      </span>
    </ng-template>
  `, styles: [`
    .clearIcon {
      border: none;
      height: 18px;
      width: 22px;
    }
    .searchButton {
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
      height: 20px;
    }
    .ag-floating-button {
      line-height: 1.4;
      height: 20px;
    }
    ::ng-deep .ag-floating-button .ant-input-suffix {
      right: 0;
    }
  `]
})
export class FloatingButtonEditorFilterComponent
  implements IFloatingFilter<SerializedNumberFilter, ButtonEditorFloatingFilterChange, ButtonEditorFloatingFilterParams>,
    AgFrameworkComponent<ButtonEditorFloatingFilterParams> {

  params: IFloatingFilterParams<any, any> | any;
  filterValue: any = null;
  modalService: any;

  onParentModelChanged(parentModel: any): void {
    this.filterValue = parentModel ? parentModel.value : null;
  }

  agInit(params: IFloatingFilterParams<any, any>): void {
    this.params = params;
    this.modalService = params['modalService'];
    this.filterValue = params.currentParentModel().value;
  }

  // 清除條件
  clear(): void {
    this.filterValue = null;
    this.params.onFloatingFilterChanged(this.filterValue);
  }

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

    this.params.modalService.open(this.filterValue).subscribe(
      (result) => {
        console.log(result);
        this.filterValue = result.length === 0 ? null : result;
        this.params.onFloatingFilterChanged(this.filterValue);
      }
    );
  }

  afterGuiAttached(): void { }
}
