import { Injectable, Pipe, PipeTransform } from '@angular/core';
import {
  CurrencyPipe,
  DatePipe,
  DecimalPipe,
  I18nSelectPipe,
  JsonPipe,
  LowerCasePipe,
  PercentPipe,
  SlicePipe,
  UpperCasePipe,
  TitleCasePipe
} from '@angular/common';
import { IDwSelectModalTableDataEnum } from '../interface/select-modal.interface';


@Pipe({
  name: 'DwSelectModalCustomFilterPipe'
})
export class DwSelectModalCustomFilterPipe implements PipeTransform {

  private retValue: any;
  private dataEnum: IDwSelectModalTableDataEnum;
  private customPipe: PipeTransform;

  constructor(
    private currencyPipe: CurrencyPipe,
    private datePipe: DatePipe,
    private decimalPipe: DecimalPipe,
    private i18nSelectPipe: I18nSelectPipe,
    private jsonPipe: JsonPipe,
    private lowerCasePipe: LowerCasePipe,
    private percentPipe: PercentPipe,
    private slicePipe: SlicePipe,
    private upperCasePipe: UpperCasePipe,
    private titleCasePipe: TitleCasePipe
  ) {
  }

  transform(value?: any, pipeArgs?: string, enumArgs?: IDwSelectModalTableDataEnum, customPipe?: PipeTransform): any {
    if (value === null || value === undefined || value === '') {
      return value;
    }

    this.retValue = value;

    this.dataEnum = null;
    this.customPipe = null;
    if (enumArgs !== null) {
      this.dataEnum = enumArgs;
    }

    if (customPipe !== null) {
      this.customPipe = customPipe;
    }

    // 指定 pipe 時,範例: date:fullDate|uppercase.
    const dataPipes = pipeArgs.split('|');
    dataPipes.forEach((val) => {
      this.converData(val);
    });

    return this.retValue;
  }


  /**
   * 利用 pipe 進行格式化.
   *
   */
  private converData(val: string): void {
    const _pipes = val.split(':');
    switch (_pipes[0]) {
      case 'date':
        this.retValue = this.datePipe.transform(this.retValue, _pipes[1], _pipes[2], _pipes[3]);
        break;

      case 'currency':
        this.retValue = this.currencyPipe.transform(this.retValue, _pipes[1], _pipes[2], _pipes[3], _pipes[4]);
        break;

      case 'uppercase':
        this.retValue = this.upperCasePipe.transform(this.retValue);
        break;

      case 'lowercase':
        this.retValue = this.lowerCasePipe.transform(this.retValue);
        break;

      case 'titlecase':
        this.retValue = this.titleCasePipe.transform(this.retValue);
        break;

      case 'number':
        this.retValue = this.decimalPipe.transform(this.retValue, _pipes[1]);
        break;

      case 'percent':
        this.retValue = this.percentPipe.transform(this.retValue, _pipes[1], _pipes[2]);
        break;

      case 'slice':
        this.retValue = this.slicePipe.transform(this.retValue, Number(_pipes[1]), Number(_pipes[2]));
        break;

      case 'json':
        this.retValue = this.jsonPipe.transform(this.retValue);
        break;

      case 'i18nSelect':
        if (this.dataEnum !== null) {
          this.retValue = this.i18nSelectPipe.transform(this.retValue.toString(), this.dataEnum);
        }
        break;

      case 'custom':
        // _pipes 一定不為空, 一定會有一個pipe類型的元素.
        const _customPipe = JSON.parse(JSON.stringify(_pipes));
        // 移除代表pipe類型的陣列的第一個元素,
        _customPipe.shift();
        this.retValue = this.customPipe.transform(this.retValue, _customPipe);
        break;

    }

  }

}
