import { AbstractControl, FormGroup, ValidatorFn } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { DwDataColumn } from './data-column';

export const DELETE = 'd';
export const CREATE = 'c';
export const UPDATE = 'u';

export class DwDataRow extends FormGroup {
  private _childs: { [key: string]: DwDataRow[] };
  modifyState: string;
  constructor(datasource: any) {
    const controls: { [key: string]: AbstractControl } = {};
    Object.keys(datasource).forEach(controlName => {
      controls[controlName] = new DwDataColumn(datasource[controlName]);
    });

    super(controls);

    this.modifyState = '';
    this._childs = {};
  }

  get columns(): { [key: string]: DwDataColumn } {
    return (this.controls as { [key: string]: DwDataColumn });
  }

  get $state(): string {
    return this.modifyState;
  }

  addChild(name: string, table: DwDataRow[]): void {
    this._childs[name] = table;
  }

  addChildRow(name: string, row: DwDataRow): void {
    if (!this._childs[name]) {
      this._childs[name] = [];
    }

    this._childs[name].push(row);
  }

  markAsDirty(): void {
    this.markAsUpdate();
    super.markAsDirty();
  }

  markAsPristine(): void {
    if (this.modifyState === UPDATE) { this.modifyState = ''; }
    super.markAsPristine();
  }

  markAsDelete(force: boolean = false): void {
    // if (this.modifyState === '' || force) {
      this.modifyState = DELETE;
    // }
  }

  markAsCreate(force: boolean = false): void {
    if (this.modifyState === '' || force) {
      this.modifyState = CREATE;
    }
  }

  markAsUpdate(force: boolean = false): void {
    if (this.modifyState === '' || force) {
      this.modifyState = UPDATE;
    }
  }

  get active(): boolean {
    return (this.modifyState !== DELETE);
  }

  batchColumnsValidator (validators: {[key: string]: ValidatorFn | ValidatorFn[]}): void {
    Object.keys(this.columns).forEach(columnName => {
      if (!validators[columnName]) {
        return;
      }

      const column = this.columns[columnName];
      column.setValidators(validators[columnName]);
    });
  }

  getRawValue(): any {
    const raw = super.getRawValue();
    raw['$state'] = this.modifyState;
    if ('child' in raw) {
      delete raw.child;
    }

    Object.keys(raw).forEach(
      rawKey => {
        if (raw[rawKey] instanceof Date) {
          raw[rawKey] = (new DatePipe('zh_tw')).transform(raw[rawKey], 'yyyy/MM/dd HH:mm:ss');
        }
      }
    );

    return raw;
  }
}
