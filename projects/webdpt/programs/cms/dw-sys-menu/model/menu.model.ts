import { CREATE, UPDATE } from '@webdpt/framework/document';

export interface IDwSysMenuNodeModel {
  dw_menu: IDwSysMenuNode[];
}

export interface IDwSysMenuNode {
  version: number; // 版本號
  id: string; // 節點編號
  // parentId: string; // 父節點編號
  sequence: number; // 順序
  type: string; // 類型. 目錄='category', 作業='program', 外部網頁(另開)='externalUrl'
  icon_class: string; // 圖示樣式
  // url: string; // 連結網址。type='externalUrl'時，設定外部網頁網址
  code: string; // 參考編號
  // defaultExpand: boolean; // 預設展開
  // openMode: string; // 開啟方式

  // name: string; // 顯示名稱
  child: IDwSysMenuNodeModel; // 子節點
}

export class DwSysMenuNodeCreateModel {
  // public version: number; // 版本號
  public $state: string;
  // public id: string; // 節點編號
  public parent_id: string; // 父節點編號
  public sequence: number; // 順序
  public type: string; // 類型. 目錄='category', 作業='program', 外部網頁(另開)='externalUrl'
  public icon_class: string; // 圖示樣式
  public url: string; // 連結網址。type='externalUrl'時，設定外部網頁網址
  public code: string; // 參考編號
  public default_expand: boolean; // 預設展開
  public open_mode: string; // 開啟方式
  public dw_menu_language: DwTMenuLangCModel[];
  public page: Array<object>;
  public action: Array<object>;

  constructor() {
    // this.version = 0;
    this.$state = CREATE;
    // this.id = '';
    this.parent_id = '';
    this.sequence = 0;
    this.type = '';
    this.icon_class = '';
    this.url = '';
    this.code = '';
    this.default_expand = false;
    this.open_mode = '';
    this.dw_menu_language = [];
    this.page = [];
    this.action = [];
  }
}

export class DwSysMenuNodeUpdateModel {
  public version: number; // 版本號
  public $state: string;
  public id: string; // 節點編號
  // public parent_id: string; // 父節點編號
  // public sequence: number; // 順序
  public type: string; // 類型. 目錄='category', 作業='program', 外部網頁(另開)='externalUrl'
  public icon_class: string; // 圖示樣式
  public url: string; // 連結網址。type='externalUrl'時，設定外部網頁網址
  public code: string; // 參考編號
  public default_expand: boolean; // 預設展開
  public open_mode: string; // 開啟方式
  public dw_menu_language: DwTMenuLangUModel[];
  public dw_menu_parameter: DwTMenuParamUModel[];
  public page: Array<object>;
  public action: Array<object>;

  constructor() {
    this.version = 0;
    this.$state = UPDATE;
    this.id = '';
    // this.parent_id = '';
    // this.sequence = 0;
    this.type = '';
    this.icon_class = '';
    this.url = '';
    this.code = '';
    this.default_expand = false;
    this.open_mode = '';
    this.dw_menu_language = [];
    this.dw_menu_parameter = [];
    this.page = [];
    this.action = [];
  }
}

export class DwTMenuLangCModel {
  $state: string;
  language: string;
  name: string;

  constructor() {
    this.$state = CREATE;
    this.language = '';
    this.name = '';
  }
}

export class DwTMenuLangUModel {
  menu_id: string;
  $state: string;
  language: string;
  name: string;

  constructor() {
    this.menu_id = '';
    this.$state = '';
    this.language = '';
    this.name = '';
  }
}

export class DwTMenuParamUModel {
  menu_id: string;
  $state: string;
  name: string;
  value: string;

  constructor() {
    this.menu_id = '';
    this.$state = '';
    this.name = '';
    this.value = '';
  }
}
