import { IDwOrgTreeDefault } from '@webdpt/framework/organize-tree-core';
import { DwTreeNode } from 'ng-quicksilver/tree';

export const openOrgTreeModalDefault: IDwOrgTreeDefault<DwTreeNode> = {
  modalTitle: 'dw-organize-tree-title', // modal 標題.
  modalWidth: '80%', // modal 寬度.
  modalOkText: 'dw-determine', // 確認按鈕文字.
  modalCancelText: 'dw-cancel', // 取消按鈕文字.
  treeCheckable: true, // 是否在節點前新增 Checkbox 複選框.
  treeMultiple: false, // 是否支援點選多個節點（節點本身）.
  treeEnableSearch: true, // 是否開啟搜索.
  treeExpandAll: true, // 是否展開所有樹節點.
  treeExpandLevel: null, // 展開的層級, 必須依賴treeExpandAll=false, 當treeExpandAll=true時, 無作用..
  treeDataType: 'full', // 取得的資料類型, full:組織+人 或 org:組織, 預設 full.
  treeKeyType: 'id', // 指定tree 使用的 key 值, id 或 sid, 預設 id.
  treeSelectType: 'full', // 可以選取的節點, full:組織+人 或 user:人, 預設 full, 必須依賴dataType=full, 當dataType=org時不起作用.
  treeSortType: 'user', // 同階時以user|org那個為優先呈現順序
  treeLoaded: (treeNodes: DwTreeNode[]): void => {} // Tree 載入完成後回調-[作業定義].
};
