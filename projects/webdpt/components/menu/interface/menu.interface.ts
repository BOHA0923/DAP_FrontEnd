import { IDwOperationParamData } from '@webdpt/framework/operation';

export interface IDwMenu {
  id: string; // 選單編號
  type: string; // 類型. 目錄='category', 作業='program', 'fineReport':報表, 外部網頁(另開)='externalUrl'
  name?: string; // 顯示名稱
  iconClass: string; // 圖示樣式
  level?: number; // 節點層級。從1開始，由程式自動產生，不用設定
  open: boolean; // 是否展開。預設false
  disabled?: boolean; // 是否禁用。預設false
  selected?: boolean; // 是否被選中。預設false
  programId: string; // 原始作業或報表編號，等於API回傳的code。type='program'時設定。
  url?: string; // 連結網址。type='externalUrl'時，設定外部網頁網址
  openMode?: string; // 外部連結開啟方式
  child: IDwMenu[]; // 子節點
  parameter?: IDwOperationParamData[]; // 作業參數
}

export interface IDwMenuConfigItem {
  type: string; // 類型. 目錄='category', 作業='program', 'fineReport':報表, 外部網頁(另開)='externalUrl'
  // name?: string; // 顯示名稱
  iconClass: string; // 圖示樣式
  level?: number; // 節點層級。從1開始，由程式自動產生，不用設定
  open: boolean; // 是否展開。預設false
  disabled: boolean; // 是否禁用。預設false
  selected: boolean; // 是否被選中。預設false
  programId: string; // 原始作業或報表編號，等於API回傳的code。type='program'時設定。
  url?: string; // 連結網址。type='externalUrl'時，設定外部網頁網址
  openMode?: string; // 外部連結開啟方式
  // child: IDwMenu[]; // 子節點
  parameter?: IDwOperationParamData[]; // 作業參數
}

/**
 * 選單設定對應表
 */
export interface IDwMenuConfigMap {
  [id: string]: IDwMenuConfigItem;
}
