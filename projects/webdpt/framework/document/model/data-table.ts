import { FormArray, AbstractControl, ValidatorFn, AsyncValidatorFn, FormBuilder } from '@angular/forms';
import { DwDataRow, DELETE, CREATE } from './data-row';


export class DwDataTable extends FormArray {
  private _activeRows: DwDataRow[];

  constructor(datasource: {[key: string]: any}[]) {
    // const controls: AbstractControl[] = DwDataTable.parseToControl(datasource);
    const controls: AbstractControl[] = [];
    for (const row of datasource) {
      controls.push(new DwDataRow(row));
    }
    super(controls);
    this._activeRows = (controls as DwDataRow[]).filter(row => row.$state !== DELETE);
  }

  get rows(): DwDataRow[] {
    return (this.controls as DwDataRow[]);
  }

  get activeRows(): DwDataRow[] {
    // 以下這一行: 當UI的ngFor綁定 activeRows 時, 會造成大量循環迴圈
    // return (this.controls as DwDataRow[]).filter(row => row.$state !== DELETE);
    return this._activeRows;
  }

  insertRow (index: number, data: {[key: string]: any} | DwDataRow): void {
    const control: DwDataRow = (data instanceof DwDataRow) ? data : new DwDataRow(data);
    control.markAsCreate();
    this.insert(index, control);

    this._activeRows = (this.controls as DwDataRow[]).filter(row => row.$state !== DELETE);
  }

  pushRow(data: {[key: string]: any} | DwDataRow, isMarkAsCreate: boolean = true): void {
    const control: DwDataRow = (data instanceof DwDataRow) ? data : new DwDataRow(data);

    if (isMarkAsCreate) {
      control.markAsCreate();
    }

    this.push(control);

    this._activeRows = (this.controls as DwDataRow[]).filter(row => row.$state !== DELETE);
  }

  updateRow (index: number, data: {[key: string]: any} | DwDataRow): void {
    if (this.rows[index]) {
      if (data instanceof DwDataRow) {
        this.rows[index] = data;
      } else {
        this.rows[index].setValue(data);
      }
      this.rows[index].markAsUpdate();

      this._activeRows = (this.controls as DwDataRow[]).filter(row => row.$state !== DELETE);
    } else {
      throw new Error(`Must supply a value for form control at index: ${index}.`);
    }

  }

  batchColumnsValidator (validators: {[key: string]: ValidatorFn | ValidatorFn[]}): void {
    this.rows.forEach(row => {
      row.batchColumnsValidator(validators);
    });
  }

  deleteRow (index: number): void {
    if (this.controls[index]) {
      // 在前端新增尚未保存的資料，直接刪除
      if (this.controls[index]['$state'] === CREATE) {
        // this.removeAt(index);
        this.controls.splice(index, 1);
      } else {
        (this.controls[index] as DwDataRow).markAsDelete();
      }
    }

    this._activeRows = (this.controls as DwDataRow[]).filter(row => row.$state !== DELETE);
  }
}
