/**
 * 單頭
 *
 * @export
 * @class MasterModel
 */
export class MasterModel {
  asisId: string = '';
  asisName: string = '';
  note: string = '';
  status: string = '';
  asisDate: Date;
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
export class DetailsInfoModel {
  seq = 0;
  itemId: string = '';
  itemName: string = '';
  upperId1: string = '';
  upperName1: string = '';
  upperId2: string = '';
  upperName2: string = '';
  status: string = '';
  selected: boolean = false;
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
export class DetailsChildInfoModel {
  seq: any = '';
  biId: string = '';
  biName: string = '';
  status: string = '';
  constructor(object: any) {
    Object.assign(this, object);
  }
  static parseToArray(jsonArray: any[]): DetailsChildInfoModel[] {
    const detailsChildren: DetailsChildInfoModel[] = [];
    jsonArray.forEach(
      (item) => { detailsChildren.push(new DetailsChildInfoModel(item)); }
    );
    return detailsChildren;
  }
}
