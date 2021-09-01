import { Component } from '@angular/core';
import { IDateComp, IAfterGuiAttachedParams, IDateParams } from 'ag-grid-community';

@Component({
  selector: 'dw-ag-date-input',
  template: `
    <dw-date-picker dwPlaceHolder=""
                    dwFormat="dd/MM/yyyy"
                    [dwShowTime]="false"
                    (ngModelChange)="dateChange($event)"
                    [(ngModel)]="date" dwSize="default">
    </dw-date-picker>
  `
})
export class DwAgGridDateInputComponent implements IDateComp {
  autoFocus = false;
  date: Date;
  params: any;

  afterGuiAttached(): void { }

  destroy(): void { }

  getDate(): Date {
    return this.date;
  }

  getGui(): HTMLElement {
    return undefined;
  }

  agInit(params: IDateParams): Promise<void> | void {
    this.params = params;
  }

  setDate(date: Date): void {
    this.date = date;
  }

  dateChange(value: any): void {
    this.date = value;
    this.params.onDateChanged();
  }
}
