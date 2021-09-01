import { FormGroup, AbstractControl, AsyncValidatorFn, ValidatorFn, FormControl, FormBuilder } from '@angular/forms';
import { DwDataTable } from './data-table';

export class DwDataSet extends FormGroup {
  constructor(datasource: any,
    validatorOrOpts?: ValidatorFn | ValidatorFn[] | null,
    asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null) {

      const controls: {[key: string]: AbstractControl} = DwDataSet.parseToControl(datasource);
      super(controls, validatorOrOpts, asyncValidator);
    }

    get tables(): {[key: string]: AbstractControl} {
      return this.controls;
    }

    static parseToControl(data: any): {[key: string]: AbstractControl} {
      const tables: {[key: string]: AbstractControl} = {};
      for (const key in data) {
        if (key) {
          const table = new DwDataTable(data[key]);
          tables[key] = table;
        }
      }

      return tables;
    }
}
