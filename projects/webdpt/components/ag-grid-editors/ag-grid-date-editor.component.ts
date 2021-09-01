import { Component, OnDestroy } from '@angular/core';
import { ICellEditorAngularComp } from 'ag-grid-angular/src/interfaces';
import { IAfterGuiAttachedParams, ICellEditorParams } from 'ag-grid-community';
import { DwAgGridValidationEditorComponent } from './ag-grid-validation-editor';
import { FormBuilder, FormControl } from '@angular/forms';
import { TranslateParser } from '@ngx-translate/core';
import fnsFormat from 'date-fns/format';
import fnsParse from 'date-fns/parse';

@Component({
  selector: 'dw-cell-input-editor',
  template: `
    <div dw-tooltip dwTooltipPlacement="topLeft" dwTooltipOverlayClassName="ag-invalid-cell-overlay"
         [dwTooltipTitle]="errorContent" [dwTooltipVisible]="errorVisible"
         *ngIf="errorVisible"></div>
    <ng-template #errorContent>
      <div *ngFor="let msg of validationMessages">{{ msg.key | translate:msg.params }}</div>
    </ng-template>
    <form [formGroup]="validateForm">
      <dw-form-control>
        <dw-input-group>
          <dw-date-picker dwPlaceHolder=""
                          [dwFormat]="dateFormat"
                          [dwShowTime]="false"
                          [formControl]="formControl"
                          dwSize="default">
          </dw-date-picker>
        </dw-input-group>
      </dw-form-control>
    </form>
  `
})
export class DwAgGridDateEditorComponent extends DwAgGridValidationEditorComponent implements ICellEditorAngularComp, OnDestroy {

  dateFormat = 'yyyy/MM/dd';
  columnId;

  constructor(private fb: FormBuilder) {
    super();
  }

  agInit(params: ICellEditorParams | any): void {
    this.editType = params.api.gridOptionsWrapper.gridOptions.editType || '';
    this.columnId = params.column.getColId();
    this.validateForm = params.form;
    this.dateFormat = params.dateFormat ? params.dateFormat : this.dateFormat;
    const currentDate = fnsParse(params.value, this.dateFormat, new Date());
    this.formControl = new FormControl(currentDate, params.validators);
    if (!params.form) {
      this.validateForm = this.fb.group({});
    }
    this.validateForm.addControl(this.columnId, this.formControl);
    this.formControl.markAsDirty();
    super.init();
  }

  getValue(): any {
    return fnsFormat(this.formControl.value, this.dateFormat);
  }

  afterGuiAttached(): void {
  }

  focusIn(): void {
  }

  focusOut(): void {
  }

  isCancelAfterEnd(): boolean {
    return this.validationMessages.length > 0;
  }

  isCancelBeforeStart(): boolean {
    return false;
  }

  isPopup(): boolean {
    return false;
  }

  ngOnDestroy(): void {
    this.validateForm.removeControl(this.columnId);
  }
}
