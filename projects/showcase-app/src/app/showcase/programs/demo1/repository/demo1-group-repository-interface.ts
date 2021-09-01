export interface IGetGroupDetailParam {
  groupId: string;
}

/**
 * 查詢條件欄位
 *
 * @export
 */
export class IDemo1GroupSearchField {
  groupId: string;
  groupName: string;
  currencyId: string;
  currencyName: string;
  sourceId: string;
  status: string;
}

export interface IDemo1GroupSortSet {
  sortName: string; // 排序欄位
  sortExpression: string; // 排序順序
}

/**
 * 查詢列表傳入參數
 *
 * @export
 */
export interface IGetGroupListParam {
  pageSize: number;
  currentPage: number;
  param: IDemo1GroupSearchField;
  sortSet: IDemo1GroupSortSet[];
}

/**
 * 單身
 *
 * @export
 * @class CompanyInfoModel
 */
// export class CompanyInfoModel {

//   public distributionStatus = '';
//   public companyCode = '';
//   public companyName = '';

//   constructor(object: any) {
//     if (object) {
//       Object.assign(this, object);
//     }
//   }

//   private _price = 0;

//   get price(): number {
//     return this._price;
//   }

//   set price(value: number) {
//     this._price = value;
//     this.onChange();
//   }

//   protected onChange(): void { }
// }
