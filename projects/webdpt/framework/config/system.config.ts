import { InjectionToken } from '@angular/core';
import { IDWDmcUserInfo } from './interface/upload-file.interface';


export const DW_APP_TYPE: InjectionToken<string> = new InjectionToken('dwAppType'); // 應用類型 'SharedApp':業務中台應用
export const DW_APP_ID: InjectionToken<string> = new InjectionToken('dwSystemConfig.dwAppId'); // Application ID(對應到互聯應用管理中心)
export const APP_DEFAULT: InjectionToken<string> = new InjectionToken('dwSystemConfig.defaultApp'); // 首頁路徑
export const Logo_Path: InjectionToken<string> = new InjectionToken('dwSystemConfig.dwLogoPath'); // Logo圖檔路徑
export const APP_DATE_FORMAT: InjectionToken<string> = new InjectionToken('dwSystemConfig.dwDateFormat'); // 日期格式
export const APP_TIME_FORMAT: InjectionToken<string> = new InjectionToken('dwSystemConfig.dwTimeFormat'); // 時間格式
export const DW_MOCK: InjectionToken<{ db, methods }> = new InjectionToken<{ db, methods }>('DW_MOCK'); // mock data config

export const DW_SYSTEM_CONFIG_APP_ID_KEY: InjectionToken<string> = new InjectionToken<string>('dwAppId', {
  providedIn: 'root',
  factory: (): string => 'dwAppId'
});
export const DW_SYSTEM_CONFIG_DEFAULT_APP_KEY: InjectionToken<string> = new InjectionToken<string>('defaultApp', {
  providedIn: 'root',
  factory: (): string => 'defaultApp'
});
export const DW_SYSTEM_CONFIG_LOGO_PATH_KEY: InjectionToken<string> = new InjectionToken<string>('dwLogoPath', {
  providedIn: 'root',
  factory: (): string => 'dwLogoPath'
});
export const DW_SYSTEM_CONFIG_DATE_FORMAT_KEY: InjectionToken<string> = new InjectionToken<string>('dwDateFormat', {
  providedIn: 'root',
  factory: (): string => 'dwDateFormat'
});
export const DW_SYSTEM_CONFIG_TIME_FORMAT_KEY: InjectionToken<string> = new InjectionToken<string>('dwTimeFormat', {
  providedIn: 'root',
  factory: (): string => 'dwTimeFormat'
});
export const DW_SYSTEM_CONFIG_USING_TAB_KEY: InjectionToken<string> = new InjectionToken<string>('dwUsingTab', {
  providedIn: 'root',
  factory: (): string => 'dwUsingTab'
});
export const DW_SYSTEM_CONFIG_TAB_MULTI_OPEN_KEY: InjectionToken<string> = new InjectionToken<string>('dwTabMultiOpen', {
  providedIn: 'root',
  factory: (): string => 'dwTabMultiOpen'
});
export const DW_SYSTEM_CONFIG_DEFAULT_LOGIN_KEY: InjectionToken<string> = new InjectionToken<string>('defaultLogin', {
  providedIn: 'root',
  factory: (): string => 'defaultLogin'
});
export const DW_SYSTEM_CONFIG_APP_AUTH_TOKEN_KEY: InjectionToken<string> = new InjectionToken<string>('dwAppAuthToken', {
  providedIn: 'root',
  factory: (): string => 'dwAppAuthToken'
});
export const DW_SYSTEM_CONFIG_LOAD_MASK_HTTP_KEY: InjectionToken<string> = new InjectionToken<string>('dwLoadMaskHttp', {
  providedIn: 'root',
  factory: (): string => 'dwLoadMaskHttp'
});
export const DW_SYSTEM_CONFIG_LOAD_MASK_DELAY_KEY: InjectionToken<string> = new InjectionToken<string>('dwLoadMaskDelay', {
  providedIn: 'root',
  factory: (): string => 'dwLoadMaskDelay'
});
export const DW_SYSTEM_CONFIG_DMC_USER_INFO_KEY: InjectionToken<string> = new InjectionToken<string>('dwDmcUserInfo', {
  providedIn: 'root',
  factory: (): string => 'dwDmcUserInfo'
});

// 作業清單靜態設定檔
export const DW_PROGRAM_JSON: InjectionToken<Array<any>> = new InjectionToken('dwSystemConfig.dwProgramList', {
  providedIn: 'root',
  factory: (): []  => []
});

// 作業子頁面設定檔
export const DW_PROGRAM_PAGE: InjectionToken<Array<any>> = new InjectionToken('dwSystemConfig.dwProgramPageList', {
  providedIn: 'root',
  factory: (): []  => []
});

// 作業功能設定檔
export const DW_PROGRAM_ACTION: InjectionToken<Array<any>> = new InjectionToken('dwSystemConfig.dwProgramActionList', {
  providedIn: 'root',
  factory: (): []  => []
});

// Menu靜態設定檔
export const DW_MENU_JSON: InjectionToken<Array<any>> = new InjectionToken('dwSystemConfig.dwMenuJson', {
  providedIn: 'root',
  factory: (): []  => []
});

export const DW_USING_TAB: InjectionToken<boolean> = new InjectionToken<boolean>('systemConfig.dwUsingTab'); // 是否啟用多頁佈局
export const DW_TAB_STORE_STRATEGY: InjectionToken<'session' | 'local' | 'none'> =
  new InjectionToken<'session' | 'local' | 'none'>('systemConfig.dwTabStoreStrategy'); // 多頁佈局儲存策略
export const DW_SYSTEM_CONFIG_TAB_STORE_STRATEGY_KEY: InjectionToken<string> = new InjectionToken<string>(
  'systemConfig.dwTabStoreStrategy', {
  providedIn: 'root',
  factory: (): string => 'dwTabStoreStrategy'
}); // 多頁佈局儲存策略
export const DW_TAB_MULTI_OPEN: InjectionToken<boolean> = new InjectionToken('dwSystemConfig.dwTabMultiOpen'); // 多頁佈局預設是否可重覆開啟作業

// 多頁佈局預設開啟作業
export const DW_TAB_ROUTE_CONFIG_JSON: InjectionToken<Array<any>> = new InjectionToken('dwSystemConfig.dwTabRouteConfigJson', {
  providedIn: 'root',
  factory: (): []  => []
});
/**
 * 關閉所有的頁籤後，是否自動開啟首頁？
 * true(default)：開啟首頁
 * false：沒任何頁籤後，頁籤組件自動隱藏
 */
export const DW_OPEN_DEFAULT_WHEN_CLOSE_TABS: InjectionToken<boolean> = new InjectionToken(
  'dwSystemConfig.openDefaultWhenCloseAllTabs',
  { providedIn: 'root', factory: (): boolean => true}
  );

export const DW_LANGUAGE_JSON: InjectionToken<Array<any>> = new InjectionToken('dwSystemConfig.dwLanguageJson'); // 可用語言清單
export const DW_LANG_LOADER: InjectionToken<any> = new InjectionToken('DW_LANG_LOADER'); // 翻譯檔載入器
export const DW_SSO_LOGIN: InjectionToken<any> = new InjectionToken('DW_SSO_LOGIN'); // IDwSsoLogin 的 interface[], ssologin 時 可以 loop 調用.
export const LONIG_DEFAULT: InjectionToken<string> = new InjectionToken('dwSystemConfig.defaultLogin'); // 登入頁路徑
export const DW_APP_AUTH_TOKEN: InjectionToken<string> = new InjectionToken('dwSystemConfig.dwAppAuthToken'); // IAM的[各應用系統的AppToken].
export const DW_LOAD_MASK_HTTP: InjectionToken<boolean> = new InjectionToken('dwSystemConfig.dwLoadMaskHttp'); // HTTP加載遮罩是否啟用
export const DW_LOAD_MASK_DELAY: InjectionToken<number> = new InjectionToken('dwSystemConfig.dwLoadMaskDelay'); // 延遲顯示加載效果的時間毫秒

// 用來傳遞 app/config/system-config.ts 的值
export const APP_SYSTEM_CONFIG: InjectionToken<any> = new InjectionToken('APP_SYSTEM_CONFIG');


// 開發環境變數
export const DW_SYSTEM_CONFIG: any = {
  dwVersion: '3.0.0.1',
  dwAppId: '',
  defaultApp: '/',
  dwLogoPath: './assets/img/i18n/zh_TW/logo/dwLogo.svg',
  dwDateFormat: 'yyyy/MM/dd',
  dwTimeFormat: 'HH:mm:ss',
  dwUsingTab: false,
  dwTabMultiOpen: false,
  defaultLogin: '/login',
  dwMultiTenant: false,
  dwAppAuthToken: '',
  dwLoadMaskHttp: false,
  dwLoadMaskDelay: 0,
  dwDmcUserInfo: {
    username: 'sampleApp1',
    password: 'sampleApp1'
  }
};

// 文檔中心的登入帳密
export const DW_DMC_USERINFO: InjectionToken<IDWDmcUserInfo> = new InjectionToken('dwSystemConfig.dwDmcUserInfo');
