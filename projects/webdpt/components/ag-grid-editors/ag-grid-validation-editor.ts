import { FormControl, FormGroup } from '@angular/forms';
import { TranslateParser } from '@ngx-translate/core';
import { Component, HostListener, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'dw-ag-grid-validateion-editor',
  template: ' ',
  styles: [
    `
      .cell-overlay .ant-tooltip-arrow {
        border-bottom-color: red;
        border-top-color: red;
        border-right-color: red;
        border-left-color: red;
      }
      .cell-overlay .ant-tooltip-inner {
        background-color: red;
      }
    `
  ],
  encapsulation: ViewEncapsulation.None
})
export class DwAgGridValidationEditorComponent {
  validateForm: FormGroup;
  formControl: FormControl;
  editType = '';
  validationMessages: Array<{key: string, params: any}> = [];
  _errorVisible: boolean = false;
  overlayStyle = {
    color: 'red'
  };
  @HostListener('mouseover') onMouseOver(): void {
    this.errorVisible = true;
  }
  @HostListener('mouseout') onMouseOut(): void {
    this.errorVisible = false;
  }
  set errorVisible(visible: boolean) {
    this._errorVisible = visible;
  }
  get errorVisible(): boolean {
    return this.validationMessages.length > 0 && this._errorVisible;
  }
  init(): void {
    if (this.formControl) {
      this.formControl.statusChanges.subscribe(data => this.updateValidateStatus(data));
    }
  }
  private updateValidateStatus(status: any): void {
    const errors = this.formControl.errors;
    const errorKeys = [];
    // this.validateStatus = status;
    // const errorKeys = [];
    // const errors = this.control.errors;
    /* tslint:disable-next-line: forin */
    for (const key in errors) {
      const error = errors[key];
      errorKeys.push({
        key: key,
        params: error
      });
    }
    this.validationMessages = errorKeys;
  }

  isFullRowEdit(): boolean {
    return this.editType === 'fullRow';
  }
}
