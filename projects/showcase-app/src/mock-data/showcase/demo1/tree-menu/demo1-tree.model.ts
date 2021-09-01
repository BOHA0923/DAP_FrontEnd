const demo1TreeJson = require('./demo1-tree.json');

// 單頭
interface IMockDemo1TreeMaster {
  groupId: string;
  groupName: string;
  currencyId: string;
  currencyName: string;
  sourceId: string;
  exchangeWay: string;
  exchangeSource: string;
  exchangeClass: string;

  groupDate: Date;
}

// 單身
export interface IMockRDemo1TreeDetail {
  seq: number;
  companyId: string;
  companyName: string;
  currencyId: string;
  status: boolean;
  startDate: Date;
  endDate: Date;
}

interface IDemo1TreeModel {
  master?: Array<IMockDemo1TreeMaster>;
  detail?: Array<IMockRDemo1TreeDetail>;
}

/**
 * 集團資料
 *
 * @class Demo1GroupModel
 */
class Demo1TreeModel {
  private _mockData?: IDemo1TreeModel;

  constructor() {
    this._mockData = (<any>demo1TreeJson); // 資料初始化來自JSON檔
  }

  get mockData(): IDemo1TreeModel {
    const str = JSON.stringify(this._mockData);
    return JSON.parse(str);
  }

  set mockData(newData: IDemo1TreeModel) {
    this._mockData.master = newData.master;
    this._mockData.detail = newData.detail;
  }
}

export const demo1TreeModel = new Demo1TreeModel(); // Single Instance
