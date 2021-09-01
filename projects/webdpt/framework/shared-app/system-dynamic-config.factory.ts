/**
 * 動態設定AppToken初始化
 * 用途：PAAS應用共用中心動態APP識別。共用中心的AppToken=''，是SSO時傳入。
 */
export const DwSystemDynamicConfigAppIdFactory = (initializer: any): any => {
  return initializer.configInit('dwAppId', 'dwAppId');
};

export const DwSystemDynamicConfigAppTokenFactory = (initializer: any): any => {
  return initializer.configInit('dwAppToken', 'dwAppAuthToken');
};
