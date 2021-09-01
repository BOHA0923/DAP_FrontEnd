import { AfterViewInit, Component, ElementRef, OnDestroy, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';
import { ICellEditorAngularComp } from 'ag-grid-angular';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { IAfterGuiAttachedParams, ICellEditorParams } from 'ag-grid-community';
import { DwInputNumberComponent } from 'ng-quicksilver/input-number';
import { DwAgGridValidationEditorComponent } from './ag-grid-validation-editor';
import { TranslateParser } from '@ngx-translate/core';

@Component({
  selector: 'dw-ag-number-cell-editor',
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
          <dw-input-number dw-input
                           [dwMin]="dwMin"
                           [dwMax]="dwMax"
                           [dwStep]="dwStep"
                           [formControl]="formControl"
                           placeholder=""
                           #cellInput></dw-input-number>
        </dw-input-group>
      </dw-form-control>
    </form>
  `
})
export class DwAgNumberCellEditorComponent extends DwAgGridValidationEditorComponent
  implements ICellEditorAngularComp, AfterViewInit, OnDestroy {
  columnId;
  dwMin;
  dwMax;
  dwStep;
  value;
  @ViewChild('cellInput') cellInput: DwInputNumberComponent;

  constructor(private fb: FormBuilder) {
    super();
  }

  ngAfterViewInit(): void {

    const valueChange = (value: number): void => {
      this.formControl.setValue(value);
      this.formControl.markAsDirty({onlySelf: true});
    };

    this.cellInput.registerOnChange(valueChange);
    this.cellInput.inputElement.nativeElement.addEventListener('keyup', (event: any) => {
      valueChange(event.target.value);
    });
  }

  // Gets called once after GUI is attached to DOM.
  // Useful if you want to focus or highlight a component
  // (this is not possible when the element is not attached)
  afterGuiAttached(): void {
    if (this.cellInput && !this.isFullRowEdit()) {
      this.cellInput.dwAutoFocus = true;
    }
  }

  // gets called once after the editor is created
  agInit(params: ICellEditorParams | any): void {
    this.editType = params.api.gridOptionsWrapper.gridOptions.editType || '';
    this.columnId = params.column.getColId();
    this.formControl = new FormControl(params.value, params.validators);
    this.validateForm = params.form;
    this.dwMin = params.dwMin;
    this.dwMax = params.dwMax;
    this.dwStep = params.dwStep;
    if (!params.form) {
      this.validateForm = this.fb.group({});
    }
    this.validateForm.addControl(this.columnId, this.formControl);
    this.formControl.markAsDirty();
    super.init();
  }

  // If doing full row edit, then gets called when tabbing into the cell.
  focusIn(): void {
  }

  // If doing full row edit, then gets called when tabbing out of the cell.
  focusOut(): void {
  }

  // Should return the final value to the grid, the result of the editing
  getValue(): any {
    return this.formControl.value;
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
