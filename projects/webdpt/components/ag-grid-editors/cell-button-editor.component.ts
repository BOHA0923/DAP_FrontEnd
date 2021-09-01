import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { ICellEditorAngularComp } from 'ag-grid-angular';
import { FormBuilder, FormControl } from '@angular/forms';
import { IAfterGuiAttachedParams, ICellEditorParams } from 'ag-grid-community';
import { DwAgGridValidationEditorComponent } from './ag-grid-validation-editor';

@Component({
  selector: 'dw-country-button-editor',
  template: `
    <div dw-tooltip dwTooltipPlacement="topLeft" dwTooltipOverlayClassName="ag-invalid-cell-overlay"
         [dwTooltipTitle]="errorContent" [dwTooltipVisible]="errorVisible"
         *ngIf="errorVisible"></div>
    <ng-template #errorContent>
      <div *ngFor="let msg of validationMessages">{{ msg.key | translate:msg.params }}</div>
    </ng-template>
    <form [formGroup]="validateForm">
      <dw-form-control>
        <dw-input-group dwSearch [dwAddOnAfter]="suffix_2">
          <input [formControl]="formControl" dw-input placeholder="" #cellInput>
        </dw-input-group>
      </dw-form-control>
    </form>
    <ng-template #suffix_2>
      <button dw-button dwType="primary" dwSearch (click)="openModal()">
        <i dw-icon dwType="search" dwTheme="outline"></i>
      </button>
    </ng-template>
  `,
  styles: [
      `.ant-input {
      padding: 4px 11px 0 11px;
    }

    .ant-input-affix-wrapper {
      top: -5px;
    }
    `
  ]
})
export class DwCellButtonEditorComponent extends DwAgGridValidationEditorComponent
  implements ICellEditorAngularComp, OnDestroy {
  columnId;
  editParams: ICellEditorParams | any;
  modalService;
  multiSelection = false;
  @ViewChild('cellInput') cellInput: ElementRef;

  constructor(private fb: FormBuilder) {
    super();
  }

  // gets called once after the editor is created
  agInit(params: ICellEditorParams | any): void {
    this.editType = params.api.gridOptionsWrapper.gridOptions.editType || '';
    const currentValue = this.valueTransfer(params.value);
    this.columnId = params.column.colId;
    this.editParams = params;
    this.modalService = params['modalService'];
    this.formControl = new FormControl(currentValue, params.validators);
    this.validateForm = params.form;
    if (!params.form) {
      this.validateForm = this.fb.group({});
    }
    // // 變更開窗的設定
    // if (this.modalService) {
    //   if (typeof params['tableMultiSelect'] === 'boolean') {
    //     this.modalService.config.tableMultiSelect = params['tableMultiSelect'];
    //   }
    //   if (params['tableIdField']) {
    //     this.modalService.config.tableIdField = params['tableIdField'];
    //   }
    // }
    this.validateForm.addControl(this.columnId, this.formControl);
    super.init();
  }

  openModal(): void {
    if (!this.modalService) {
      return;
    }

    // 變更開窗的設定
    if (typeof this.editParams.tableMultiSelect === 'boolean') {
      this.modalService.config.tableMultiSelect = this.editParams.tableMultiSelect;
    }
    if (this.editParams.tableIdField) {
      this.modalService.config.tableIdField = this.editParams.tableIdField;
    }

    this.modalService.open(this.formControl.value).subscribe(
      (result) => {
        this.setSelectedValue(result);
      }
    );
  }

  // Gets called once after GUI is attached to DOM.
  // Useful if you want to focus or highlight a component
  // (this is not possible when the element is not attached)
  afterGuiAttached(): void {
    if (this.cellInput && !this.isFullRowEdit()) {
      this.cellInput.nativeElement.focus();
    }
  }

  private valueTransfer(value: any): any {
    let currentValue = value;
    if (this.multiSelection) {
      if (typeof value === 'string') {
        currentValue = value.split(',').map(
          v => v.trim()
        );
      }
    } else {
      if (Array.isArray(value)) {
        currentValue = value.join();
      }
    }
    return currentValue;
  }

  getSelectedValue(): any {
    return this.formControl.value;
  }

  setSelectedValue(value: any): any {
    this.formControl.setValue(value);
  }

  // If doing full row edit, then gets called when tabbing into the cell.
  focusIn(): void {
    console.log('focusIn');
  }

  // If doing full row edit, then gets called when tabbing out of the cell.
  focusOut(): void {
    console.log('focusOut');
  }

  // Should return the final value to the grid, the result of the editing
  getValue(): any {
    return this.getSelectedValue();
  }

  // Gets called once before editing starts, to give editor a chance to
  // cancel the editing before it even starts.
  isCancelBeforeStart(): boolean {
    return false;
  }

  // Gets called once when editing is finished (eg if enter is pressed).
  // If you return true, then the result of the edit will be ignored.
  isCancelAfterEnd(): boolean {
    return this.validationMessages.length > 0;
  }

  // Gets called once after initialised.
  // If you return true, the editor will appear in a popup
  isPopup(): boolean {
    return false;
  }

  ngOnDestroy(): void {
    this.validateForm.removeControl(this.columnId);
  }

}
