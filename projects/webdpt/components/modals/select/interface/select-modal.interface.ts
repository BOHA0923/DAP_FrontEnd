import { Type, PipeTransform, InjectionToken } from '@angular/core';
import { ModalButtonOptions } from 'ng-quicksilver/modal';

import { IDwSelectModalDataSource } from './select-modal-datasource.interface';

// 開窗服務的共用設定值
export const DW_SELECT_MODAL_DEFAULT: InjectionToken<IDwSelectModalConfig<any>> = new InjectionToken(
  'dwSystemConfig.dwSelectModalDefault',
  {
    providedIn: 'root',
    factory: (): any => []
  });

/**
 * 開窗的設定.
 *
 */
export interface IDwSelectModalModal<T> {
  dwTitle?: string; // modal 標題.
  dwWidth?: string; // modal 寬度.
  dwOkText?: string; // 確認按鈕文字.
  dwCancelText?: string; // 取消按鈕文字.
  onOk?(): void; // 點擊[確認]回調-[作業定義].
  onCancel?(): void; // 點擊[遮罩層]或[右上角叉]或[取消按鈕]的回調-[作業定義].
  afterClose?(): void; // Modal 完全關閉後的回調-[作業定義].
  afterOpen?(): void; // Modal 打開後的回調-[作業定義].
  dwOnOk?(result: T): void; // 點擊[確認]回調-[Modal定義].
  dwOnCancel?(result: T): void; // 點擊[遮罩層]或[右上角叉]或[取消按鈕]的回調-[Modal定義].
}

/**
 * 開窗裡table的設定.
 *
 */
export interface IDwSelectModalTable {
  idField: string; // table 內使用 id 的對應欄位.
  nameField: string; // table 內使用 name 的對應欄位.
  colDefs: Array<IDwSelectModalTableColDefs>; // table 的欄位定義.
  dwPageSize?: number; // 每頁展示多少數據.
  dwPageIndex?: number; // 當前頁碼.
  dwTotal?: number; // 當前總數據.
  multiSelect?: boolean; // 單選或多選.
  showTag?: boolean; // 下方是否顯示 tag.
  isFilter?: boolean; // 是否顯示上方的 filter
  dwShowPagination?: boolean; // 是否顯示分頁器.
  dwShowSizeChanger?: boolean; // 是否可以改變 dwPageSize.
  pageIndexChange?(pageIndex: number): void; // 當前頁碼改版時的回調函式-[作業定義].
  pageSizeChange?(pageSize: number): void; // 頁數改變時的回調函式-[作業定義].
  currentPageDataChange?(datas: any[]): void; // 當前頁面展示數據改變的回調函式-[作業定義].
  dwFrontPagination?: boolean; // 是否在前端對數據進行分頁.
  dwNoResult?: string; // 無數據時顯示內容.
  dwPageSizeOptions?: number[]; // 頁數選擇器可選值
}

/**
 * 開窗完整的設定.
 *
 */
export interface IDwSelectModalConfig<T> {
  modalConfig: IDwSelectModalModal<T>; // Modal對話框-設定檔.
  tableDefs: IDwSelectModalTable; // Table表格-設定檔.
  dataSource: IDwSelectModalDataSource; // 資料源 service.
}


/**
 * ng-zorro 的 create 開窗傳參.
 *
 */
export interface IDwModalServiceCreate<T> {
  dwTitle?: string; // modal 標題.
  dwWidth?: string; // modal 寬度.
  dwOkText?: string; // 確認按鈕文字.
  dwCancelText?: string; // 取消按鈕文字.
  dwOnOk?(result: T): void; // 點擊[確認]回調-[Modal定義].
  dwOnCancel?(result: T): void; // 點擊[遮罩層]或[右上角叉]或[取消按鈕]的回調-[Modal定義].
  onOk?(): void; // 點擊[確認]回調-[作業定義].
  onCancel?(): void; // 點擊[遮罩層]或[右上角叉]或[取消按鈕]的回調-[作業定義].
  afterClose?(): void; // Modal 完全關閉後的回調-[作業定義].
  afterOpen?(): void; // Modal 打開後的回調-[作業定義].
  dwContent: Type<T>; // dwModal 內容.
  dwFooter: Array<ModalButtonOptions>; // dwMoal 底部內容.
  dwComponentParams: object; // dwMoal 當dwContent為元件類(Component)時，該參數中的屬性將傳入dwContent實例中.
}

/**
 * IDwSelectModalDataSource getDataList() 的 return 資料格式
 *
 */
export interface ISelectModalDataSourceResponse {
  currentPage: number; // 當前頁碼.
  datas: Array<{}>; // 資料集.
  pageCount: number; // 總頁數.
  pageSize: number; // 每頁展示多少數據.
  rowCount: number; // 總筆數.
}

/**
 * 攤平後的選擇開窗入參.
 *
 */
export interface IDwSelectModalCustomizeConfig {
  modalTitle: string; // modal 標題.
  modalWidth?: string; // modal 寬度.
  modalOkText?: string; // 確認按鈕文字.
  modalCancelText?: string; // 取消按鈕文字.
  modalOnOk?(): void; // 點擊[確認]回調-[作業定義].
  modalOnCancel?(): void; // 點擊[遮罩層]或[右上角叉]或[取消按鈕]的回調-[作業定義].
  modalAfterClose?(): void; // Modal 完全關閉後的回調-[作業定義].
  modalAfterOpen?(): void; // Modal 打開後的回調-[作業定義].
  tableIdField: string; // 使用的 id 欄位.
  tableNameField: string; // 使用的 name 欄位.
  tableColDefs: Array<IDwSelectModalTableColDefs>; // 表格欄位定義.
  tableMultiSelect?: boolean; // 多選或單選.
  tableShowTag?: boolean; // 是否顯示下方的 tag.
  tableIsFilter?: boolean; // 是否提供搜尋.
  tablePageSize?: number; // 每頁展示多少數據，可雙向繫結.
  tableShowPagination?: boolean; // 是否顯示分頁器.
  tableShowSizeChanger?: boolean; // 是否可以改變 dwPageSize.
  tablePageIndexChange?(pageIndex: number): void; // 當前頁碼改版時的回調函式.
  tablePageSizeChange?(pageSize: number): void; // 頁數改變時的回調函式.
  tableCurrentPageDataChange?(datas: any[]): void; // 當前頁面展示數據改變的回調函式.
  tableNoResult?: string; // 無數據時顯示內容, 空值則使用預設值.
  tablePageSizeOptions?: Array<number>; // 頁數選擇器可選值.
  dataSource: IDwSelectModalDataSource; // 資料源 service.
}


/**
 * 表格欄位定義.
 *
 */
export interface IDwSelectModalTableColDefs {
  title: string; // 表格 th 的顯示標題.
  field: string; // 表格 td 對應的資料字段.
  width?: string; // 表格 td 寬度.
  isSort?: boolean; // 是否提供排序.
  dataPipe?: string; // 內建的 pipe 在 html 裡使用的名稱.
  dataEnum?: IDwSelectModalTableDataEnum; // 當 dataPipe 為 i18nSelect 時的枚舉值.
  customPipe?: PipeTransform; // 自定義的 pipe.
  dataClass?: string; // 指定的 CSS class.
}

/**
 * 枚舉值的字段.
 *
 */
export interface IDwSelectModalTableDataEnum {
  [key: number]: string;

  [key: string]: string;
}
