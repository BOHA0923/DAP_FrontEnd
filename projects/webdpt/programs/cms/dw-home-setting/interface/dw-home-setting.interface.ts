export interface IDwHomeSettingTabs {
  active: boolean;
  id: string;
  nameId: string;
  icon: string;
  disabled: boolean;
  init: boolean;
  level: string; // 首頁層級,'common':共用, 'user':用戶自身, '':用戶使用的自定義首頁
}


export interface IDwHomeSettingProgramOptions {
  check: boolean;
  menuType: string;
  key: string;
  name: string;
  isMatched: boolean;
}

// export interface IDwHomeSettingParam {
//   name: string;
//   value: string;
// }
