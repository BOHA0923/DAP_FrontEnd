import { HttpHeaders, HttpParams } from '@angular/common/http';

export interface IDwRequestUiOptions {
  loadMaskCfg: IDwLoadMaskCfg; // 加載遮罩設定值
}

export interface IDwRequestOptions {
  headers?: HttpHeaders | { [header: string]: string | string[] };
  observe?: 'body' | 'events' | 'response';
  params?: HttpParams | { [param: string]: string | string[] };
  reportProgress?: boolean;
  body?: any;
  responseType?: 'arraybuffer' | 'blob' | 'json' | 'text';
  withCredentials?: boolean;
  uiOptions?: IDwRequestUiOptions; // 前端參數
}

/**
 * 加載遮罩設定值
 */
export interface IDwLoadMaskCfg {
  spinning: boolean; // 是否顯示
  delay: number; // 延遲顯示加載效果的時間毫秒（防止閃爍）
  tip: string; // 描述
}

/**
 * 加載遮罩設定
 */
export interface IDwLoadMaskItem {
  id: string; // 加載遮罩編號
  config: IDwLoadMaskCfg; // 加載遮罩設定值
}
