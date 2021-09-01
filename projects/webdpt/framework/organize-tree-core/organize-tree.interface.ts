import { InjectionToken } from '@angular/core';

// 組織人員樹開窗元件
export const DW_ORGTREE_MODAL_DEFAULT: InjectionToken<IDwOrgTreeDefault<any>> = new InjectionToken(
  'dwSystemConfig.dwOrgTreeModalDefault',
  {
    providedIn: 'root',
    factory: (): any => {
      return {};
    }
  }
);

/**
 * 組織人員樹開窗元件的預設參數.
 *
 */
export interface IDwOrgTreeDefault<T> {
  modalTitle?: string; // modal 標題.
  modalWidth?: string; // modal 寬度.
  modalOkText?: string; // 確認按鈕文字.
  modalCancelText?: string; // 取消按鈕文字.
  modalOnOk?(): void; // 點擊[確認]回調-[作業定義].
  modalOnCancel?(): void; // 點擊[遮罩層]或[右上角叉]或[取消按鈕]的回調-[作業定義].
  modalAfterClose?(): void; // Modal 完全關閉後的回調-[作業定義].
  modalAfterOpen?(): void; // Modal 打開後的回調-[作業定義].
  treeCheckable?: boolean; // 是否在節點前新增 Checkbox 複選框.
  treeMultiple?: boolean; // 是否支援點選多個節點（節點本身）.
  treeEnableSearch?: boolean; // 是否開啟搜索.
  treeExpandAll?: boolean; // 是否展開所有樹節點.
  treeExpandLevel?: number | null; // 展開的層級, 必須依賴treeExpandAll=false, 當treeExpandAll=true時, 無作用.
  treeDataType?: string; // 取得的資料類型, full:組織+人 或 org:組織, 預設 full.
  treeKeyType?: string; // 指定tree 使用的 key 值, id 或 sid, 預設 id.
  treeSelectType?: string; // 指定可選取的節點, full:組織+人 或 user:人, 預設 full; 當值為user時, 必須依賴dataType=full, 當dataType=org時, 無作用.
  treeSortType?: string; // 同階時以user|org那個為優先呈現順序,預設為user
  treeLoaded?(treeNodes: T[]): void; // Tree 載入完成後回調-[作業定義].
}


/**
 * 開窗元件的預設參數.
 *
 */
export interface IDwOrgTreeModal<T> {
  dwTitle: string; // modal 標題.
  dwWidth: string; // modal 寬度.
  dwOkText: string; // 確認按鈕文字.
  dwCancelText: string; // 取消按鈕文字.
  customOnOk?(): void; // 點擊[確認]回調-[作業定義].
  customOnCancel?(): void; // 點擊[遮罩層]或[右上角叉]或[取消按鈕]的回調-[作業定義].
  customAfterClose?(): void; // Modal 完全關閉後的回調-[作業定義].
  customAfterOpen?(): void; // Modal 打開後的回調-[作業定義].
  dwOnOk?(result: T): void; // 點擊[確認]回調-[Modal定義].
  dwOnCancel?(result: T): void; // 點擊[遮罩層]或[右上角叉]或[取消按鈕]的回調-[Modal定義].
}


/**
 * 樹控件的預設參數.
 *
 */
export interface IDwOrgTreeConfig<T> {
  checkable: boolean; // 是否在節點前新增 Checkbox 複選框.
  multiple: boolean; // 是否支援點選多個節點（節點本身）.
  enableSearch: boolean; // 是否開啟搜索.
  expandAll: boolean; // 是否展開所有樹節點.
  expandLevel: number | null; // 展開的層級, 必須依賴treeExpandAll=false, 當treeExpandAll=true時, 無作用.
  dataType: string; // 取得的資料類型, full:組織+人 或 org:組織, 預設 full.
  keyType: string; // 指定tree 使用的 key 值, id 或 sid, 預設 id.
  selectType: string;  // 指定可選取的節點, full:組織+人 或 user:人, 預設 full; 當值為user時, 必須依賴dataType=full, 當dataType=org時, 無作用.
  sortType: string; // 同階時以user|org那個為優先呈現順序
  loaded?(treeNodes: T[]): void; // Tree 載入完成後回調-[作業定義].
}


/**
 * 樹控件的選取結果.
 *
 */
export interface IDwOrgTreeNode {
  type: string; // 節點型態.
  key?: string; // 整個樹範圍內的所有節點的 key 值不能重複且不為空.
  title?: string; // 標題.
  id?: string; // user Id 或是組織 Id.
  sid?: string | number; // sid.
  parentKey?: string; // 父節點的 key 值.
  parentTitle?: string; // 父節點的標題.
  parentSid?: string | number; // 父節點的sid.
  children?: IDwOrgTreeNode[]; // 子節點.
  expanded?: boolean; // 是否展開.
  icon?: string; // icon className
}


/**
 * 組織樹的資料型態.
 *
 */
export interface IDwOrgTreeDataMode {
  dataType?: string; // 取得的資料類型, full:組織+人 或 org:組織, 預設 full.
  keyType?: string; // 指定tree 使用的 key 值, id 或 sid, 預設 id.
  selectType?: string; // 指定可選取的節點類型, full:組織+人 或 user:人, 預設 full; 當值為user時, 必須依賴dataType=full, 當dataType=org時, 無作用.
  expandAll?: boolean; // 是否展開所有樹節點.
  sortType?: string; // 同階時以user|org那個為優先呈現順序
}
