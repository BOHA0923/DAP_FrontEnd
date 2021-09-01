/**
 * 作業參數資料來自API的格式
 */
export interface IDwOperationParamData {
  name: string; // 參數編號
  value: string; // 值
}

/**
 * 作業參數
 */
export interface IDwOperationParameter {
  [key: string]: any;
}

/**
 * 作業資訊
 */
export interface IDwProgram {
  module: string; // 模組編號。等同權限模組
  type: string; // 類型:帆軟報表='fineReport', 一般內嵌網頁='externalUrl'
  routerLink: string; // 頁面路由
  page: IDwProgramPageItem[]; // 子頁面
  action: IDwProgramActionItem[]; // 功能
  urlConfig?: string; // 外部連結網址佈署參數(業務中台應用前端網址)
}

/**
 * 作業資訊(含作業編號)
 */
export interface IDwProgramData extends IDwProgram {
  id: string; // 作業編號
}

export interface IDwOperationMap {
  [id: string]: IDwProgram;
}

/**
 * 作業子頁面
 */
export interface IDwProgramPage {
  programId: string;
  page: IDwProgramPageItem[];
}

export interface IDwProgramPageItem {
  id: string;
  routerLink: string;
}

/**
 * 作業功能
 */
export interface IDwProgramAction {
  programId: string;
  action: IDwProgramActionItem[];
}

export interface IDwProgramActionItem {
  id: string;
  name: string;
}
