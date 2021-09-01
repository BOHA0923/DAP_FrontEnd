const demo1GroupJson = require('./demo1-group.json');

// 單頭
interface IMockDemo1GroupMaster {
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
export interface IMockRDemo1GroupDetail {
  seq: number;
  companyId: string;
  companyName: string;
  currencyId: string;
  status: boolean;
  startDate: Date;
  endDate: Date;
}

interface IDemo1GroupModel {
  master?: Array<IMockDemo1GroupMaster>;
  detail?: Array<IMockRDemo1GroupDetail>;
}

/**
 * 集團資料
 *
 * @class Demo1GroupModel
 */
class Demo1GroupModel {
  private _mockData?: IDemo1GroupModel;

  constructor() {
    this._mockData = (<any>demo1GroupJson); // 資料初始化來自JSON檔
  }

  get mockData(): IDemo1GroupModel {
    const str = JSON.stringify(this._mockData);
    return JSON.parse(str);
  }

  set mockData(newData: IDemo1GroupModel) {
    this._mockData.master = newData.master;
    this._mockData.detail = newData.detail;
  }
}

export const demo1GroupModel = new Demo1GroupModel(); // Single Instance
