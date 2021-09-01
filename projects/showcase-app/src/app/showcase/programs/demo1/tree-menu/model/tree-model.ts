// 樹狀節點
export interface TreeMenuModel {
  key: number;
  name: string;
  children?: TreeMenuModel[];

}

// 樹狀節點展開
export interface TreeModel extends TreeMenuModel {
  parent?: TreeModel;
  level?: number;
  expand?: boolean;
}

export interface IGetTreeDetailParam {
  groupId: string;
}
