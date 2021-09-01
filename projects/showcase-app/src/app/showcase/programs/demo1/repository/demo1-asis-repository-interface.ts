export interface IGetAsisDetailParam {
  asisId: string;
}

/**
 * 查詢條件欄位
 *
 */
export class IDemo1AsisSearchField {
  asisId: string;
  asisName: string;
  currencyId: string;
  currencyName: string;
  sourceId: string;
  status: string;
}

export interface IDemo1AsisSortSet {
  sortName: string; // 排序欄位
  sortExpression: string; // 排序順序
}

/**
 * 查詢列表傳入參數
 */
export interface IGetAsisListParam {
  pageSize: number;
  currentPage: number;
  param: IDemo1AsisSearchField;
  sortSet: IDemo1AsisSortSet[];
}


