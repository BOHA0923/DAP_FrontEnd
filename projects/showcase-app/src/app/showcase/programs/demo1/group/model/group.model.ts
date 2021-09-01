/**
 * 單頭
 *
 * @export
 * @class MasterModel
 */
export class MasterModel {
  groupId: string = '';
  groupName: string = '';
  currencyId: string = '';
  currencyName: string = '';
  sourceId: string = '';
  exchangeWay: string = '';
  exchangeSource: string = '';
  exchangeClass: string = '';
  status: string = '';
  groupDate: Date;
  checked?: boolean = false;
  constructor(values: any) {
    Object.assign(this, values);
  }
}

/**
 * 單身
 *
 * @export
 * @class DetailsInfoModel
 */
export class DetailsInfoModel  {
  seq = 0;
  companyId: string = '';
  companyName: string = '';
  currencyId: string = '';
  currencyName: string = '';
  status: string = '';
  startDate: string = '';
  endDate: string = '';
  constructor(object: any) {
    Object.assign(this, object);
  }
  static parseToArray(jsonArray: any[]): DetailsInfoModel[] {
    const details: DetailsInfoModel[] = [];
    jsonArray.forEach(
      (item) => { details.push(new DetailsInfoModel(item)); }
    );
    return details;
  }
}
