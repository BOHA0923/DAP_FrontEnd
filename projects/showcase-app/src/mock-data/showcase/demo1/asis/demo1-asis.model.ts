const demo1AsisJson = require('./demo1-asis.json');

// 單頭
interface IMockDemo1AsisMaster {
  asisId: string;
  asisName: string;
  note: string;
  status: string;

  asisDate: Date;
}

// 單身
export interface IMockRDemo1AsisDetail {
  seq: number;
  itemId: string;
  itemName: string;
  upperId1: string;
  upperName1: string;
  upperId2: string;
  upperName2: string;
  status: boolean;
}
// 單身明細
export interface IMockRDemo1AsisDetailChild {
  seq: number;
  biId: string;
  biName: string;
  status: boolean;
}
interface IDemo1AsisModel {
  master?: Array<IMockDemo1AsisMaster>;
  detail?: Array<IMockRDemo1AsisDetail>;
  detailChildren?: Array<IMockRDemo1AsisDetailChild>;
}

/**
 * 資料
 *
 * @class Demo1AsisModel
 */
class Demo1AsisModel {
  private _mockData?: IDemo1AsisModel;

  constructor() {
    this._mockData = (<any>demo1AsisJson); // 資料初始化來自JSON檔
  }

  get mockData(): IDemo1AsisModel {
    const str = JSON.stringify(this._mockData);
    return JSON.parse(str);
  }

  set mockData(newData: IDemo1AsisModel) {
    this._mockData.master = newData.master;
    this._mockData.detail = newData.detail;
    this._mockData.detailChildren = newData.detailChildren;
  }
}

export const demo1AsisModel = new Demo1AsisModel(); // Single Instance
