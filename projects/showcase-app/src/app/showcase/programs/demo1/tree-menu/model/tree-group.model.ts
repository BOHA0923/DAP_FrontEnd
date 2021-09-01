/**
 * 單頭
 *
 * @export
 * @class MasterModel
 */
export class TreeMasterModel {
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
export class TreeDetailsInfoModel  {
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

  static parseToArray(jsonArray: any[]): TreeDetailsInfoModel[] {
    const details: TreeDetailsInfoModel[] = [];
    jsonArray.forEach(
      (item) => { details.push(new TreeDetailsInfoModel(item)); }
    );
    return details;
  }
}
