import { Observable } from 'rxjs';
import { Subject } from 'rxjs';
import { Injectable, Inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DwMessageService } from 'ng-quicksilver/message';
import { DwModalRef } from 'ng-quicksilver/modal';
import { DwModalService } from 'ng-quicksilver/modal';

import { DwSelectModalComponent } from '../select-modal.component';
import {
  IDwSelectModalConfig,
  IDwSelectModalModal,
  IDwSelectModalTable,
  IDwModalServiceCreate,
  IDwSelectModalCustomizeConfig,
  IDwSelectModalTableColDefs,
  DW_SELECT_MODAL_DEFAULT
} from '../interface/select-modal.interface';
import { IDwSelectModalDataSource } from '../interface/select-modal-datasource.interface';


@Injectable({
  providedIn: 'root'
})
export class DwSelectModalService {
  private modalConfig: IDwSelectModalModal<DwSelectModalComponent>; // 共用+作業的開窗設定檔.
  private tableDefs: IDwSelectModalTable; // 共用+作業的Table設定檔.
  private modalSubject: Subject<any>;

  constructor(private dwModalService: DwModalService,
    private translateService: TranslateService,
    private dwMessage: DwMessageService,
    @Inject(DW_SELECT_MODAL_DEFAULT) private openSelectModalDefault: IDwSelectModalConfig<DwSelectModalComponent>
  ) {
  }


  /**
   * 默認的開窗 modal與table的參數.
   *
   */
  private getDefaultConfig(): IDwSelectModalCustomizeConfig {
    return {
      modalTitle: 'default', // modal 標題.
      modalWidth: '80%', // modal 寬度.
      modalOkText: 'dw-determine', // 確認按鈕文字.
      modalCancelText: 'dw-cancel', // 取消按鈕文字.
      modalOnOk: (): void => {}, // 點擊[確認]回調-[作業定義].
      modalOnCancel: (): void => {}, // 點擊[遮罩層]或[右上角叉]或[取消按鈕]的回調-[作業定義].
      modalAfterClose: (): void => {}, // Modal 完全關閉後的回調-[作業定義].
      modalAfterOpen: (): void => {}, // Modal 打開後的回調-[作業定義].
      tableIdField: '', // 使用的 id 欄位.
      tableNameField: '', // 使用的 name 欄位.
      tableColDefs: [], // 表格欄位定義.
      tableMultiSelect: true, // 多選或單選.
      tableShowTag: true, // 是否顯示下方的 tag.
      tableIsFilter: true, // 是否提供搜尋.
      tablePageSize: 50, // 每頁展示多少數據，可雙向繫結.
      tableShowPagination: true, // 是否顯示分頁器.
      tableShowSizeChanger: true, // 是否可以改變 dwPageSize.
      tableNoResult: '', // 無數據時顯示內容, 空值則使用預設值.
      tablePageSizeOptions: [5, 10, 15, 20], // 頁數選擇器可選值.
      tablePageIndexChange: (): void => {},
      tablePageSizeChange: (): void => {},
      tableCurrentPageDataChange: (): void => {},
      dataSource: null // 資料源 service.
    };
  }

  /**
   * 檢查開窗的設定檔
   *
   */
  private _checkCustomizeConfig(config: IDwSelectModalCustomizeConfig): boolean {
    // 檢查資料來源.
    if (!config.hasOwnProperty('dataSource')) {
      this.dwMessage.error(this.translateService.instant('dw-select-modal-error-dataSource'));
      return false;
    }

    // 使用的 id 欄位不得為空值.
    if (!config.tableIdField) {
      this.dwMessage.error(this.translateService.instant('dw-select-modal-error-tableIdField'));
      return false;
    }

    // 使用的 name 欄位不得為空值.
    if (!config.tableNameField) {
      this.dwMessage.error(this.translateService.instant('dw-select-modal-error-tableNameField'));
      return false;
    }

    // 表格欄位定義不得為空值.
    if (!config.tableColDefs.length) {
      this.dwMessage.error(this.translateService.instant('dw-select-modal-error-tableColDefs'));
      return false;
    }

    const arrError = [];
    config.tableColDefs.forEach((val) => {
      if (!val.hasOwnProperty('title') || !val.title) {
        arrError.push(this.translateService.instant('dw-select-modal-error-tableColDefs-title'));
      }
      if (!val.hasOwnProperty('field') || !val.field) {
        arrError.push(this.translateService.instant('dw-select-modal-error-tableColDefs-field'));
      }
    });
    if (arrError.length) {
      this.dwMessage.error(arrError.join('\\n'));
      return false;
    }

    return true;
  }


  /**
   * 取得開窗 modal 的默認參數.
   *
   */
  private setModalConfig(config: IDwSelectModalCustomizeConfig): void {

    this.modalConfig = Object.assign({}, {
      dwTitle: config.modalTitle,
      dwWidth: config.modalWidth,
      dwOkText: config.modalOkText,
      dwCancelText: config.modalCancelText,
      onOk: config.modalOnOk,
      onCancel: config.modalOnCancel,
      afterClose: config.modalAfterClose,
      afterOpen: config.modalAfterOpen
    });

  }


  /**
   * 取得開窗 table 的 tableColDefs 默認參數.
   *
   */
  private getTableColDefs(config: IDwSelectModalTableColDefs[]): IDwSelectModalTableColDefs[] {
    const _config: IDwSelectModalTableColDefs[] = [];

    config.forEach((val) => {
      const _val = Object.assign({}, val);

      // ===增加控制參數===//
      // 是否排序.
      if (!_val.hasOwnProperty('isSort') || typeof _val.isSort !== 'boolean') {
        _val.isSort = true;
      }

      // dataPipe.
      if (!_val.hasOwnProperty('dataPipe')) {
        _val.dataPipe = null;
      }

      // dataEnum
      if (!_val.hasOwnProperty('dataEnum')) {
        _val.dataEnum = null;
      }

      // 自定義的 pipe
      if (!_val.hasOwnProperty('customPipe')) {
        _val.customPipe = null;
      }

      _config.push(_val);
    });

    return _config;
  }

  /**
   * 取得開窗 table 的默認參數.
   *
   */
  private setTableConfig(config: IDwSelectModalCustomizeConfig): void {
    const tableColDefs = this.getTableColDefs(config.tableColDefs);

    this.tableDefs = Object.assign({}, {
      idField: config.tableIdField,
      nameField: config.tableNameField,
      colDefs: tableColDefs,
      multiSelect: config.tableMultiSelect,
      dwPageSize: config.tablePageSize,
      showTag: config.tableShowTag,
      isFilter: config.tableIsFilter,
      dwShowPagination: config.tableShowPagination,
      dwShowSizeChanger: config.tableShowSizeChanger,
      pageIndexChange: config.tablePageIndexChange,
      pageSizeChange: config.tablePageSizeChange,
      currentPageDataChange: config.tableCurrentPageDataChange,
      dwNoResult: config.tableNoResult,
      dwPageSizeOptions: config.tablePageSizeOptions
    });

  }

  /**
   * 取得開窗 merge 後的設定檔.
   *
   */
  private setConfig(config: IDwSelectModalCustomizeConfig): void {
    // config 的優先順序, 3.service 2. shard/default 1. open(config).
    const defaultConfig = this.getDefaultConfig();
    // 允許作業的 tableDefs override defaultDefs.
    const allConfig = {...defaultConfig, ...this.openSelectModalDefault, ...config};

    // 開窗 modal 的參數.
    this.setModalConfig(allConfig);

    // 開窗 table 的作業用設定參數.
    this.setTableConfig(allConfig);
  }


   /**
    * 多語(利用KEY值, 取值).
    *
    */
  private translateConfig(): void {
    this.modalConfig.dwTitle = this.translateService.instant(this.modalConfig.dwTitle);
    this.modalConfig.dwOkText = this.translateService.instant(this.modalConfig.dwOkText);
    this.modalConfig.dwCancelText = this.translateService.instant(this.modalConfig.dwCancelText);
  }

  /**
   * 取得將傳入dwContent實例中的預選值 selected.
   *
   */
  private getSelected(selected: Array<any>): Array<any> {
    let _selected = [];
    if (selected) {
      _selected = selected;
      if (typeof selected === 'string') {
        _selected = [selected];
      }
    }

    return _selected;
  }


  /**
   * 新增註冊事件, 如果 defs 裡也有註冊事件, 需調用.
   *
   */
  private setEvents(): any {
    // 點擊[確認]回調.
    this.modalConfig.dwOnOk = (result: DwSelectModalComponent): void => {
      const selectedValue = result.getSelectedValue();
      this.modalSubject.next(selectedValue);
      this.modalSubject.complete();

      // 調用作業的 onOk.
      this.modalConfig.onOk();
    };


    // 點擊[遮罩層]或[右上角叉]或[取消按鈕]的回調.
    this.modalConfig.dwOnCancel = (result: DwSelectModalComponent): void => {
      this.modalSubject.complete();

      // 調用作業的 onCancel.
      this.modalConfig.onCancel();
    };

    // 提出來是為了要 return 給 dwModalRef 用.
    const _regEvent = {
      afterClose: this.modalConfig.afterClose,
      afterOpen: this.modalConfig.afterOpen
    };

    delete this.modalConfig.afterClose;
    delete this.modalConfig.afterOpen;

    return _regEvent;
  }


  /**
   * 調用 ng-zorro 的 create 開窗.
   *
   */
  private createModal(dataSource: IDwSelectModalDataSource, selected: Array<any>): DwModalRef {
    // 建立的開窗，都會返回一個 DwModalRef 物件.
    let _dwModalRef: DwModalRef;

    // 最終開窗的設定檔(為了作業的設定可以被保留在 this.modalConfig 裡).
    const _config: IDwModalServiceCreate<DwSelectModalComponent> = {
      dwContent: DwSelectModalComponent,
      dwFooter: [
        {
          label: this.modalConfig.dwCancelText, // 取消按鈕文字.
          shape: null,
          onClick(): void {
            _dwModalRef.triggerCancel();
          }
        },
        {
          label: this.modalConfig.dwOkText, // 確認按鈕文字.
          type: 'primary',
          onClick(): void {
            _dwModalRef.triggerOk();
          }
        }
      ],
      dwComponentParams: {            // 傳遞給 DwSelectModalComponent 的參數.
        tableDefs: this.tableDefs,    // dwTable設定檔.
        selected: selected,           // 已選取的清單.
        dataSource: dataSource        // 資料源(後端服務).
      },
      ...this.modalConfig
    };

    _dwModalRef = this.dwModalService.create(_config);

    return _dwModalRef;
  }



  /**
   * 開窗.
   *
   */
  public open(config: IDwSelectModalCustomizeConfig, selected: Array<any>): Observable<any> {
    this.modalSubject = new Subject();

    // 檢查開窗的設定檔.
    if (!this._checkCustomizeConfig(config)) {
      this.modalSubject.complete();
      return this.modalSubject;
    }

    // 分析設定檔.
    this.setConfig(config);

    // 多語.
    this.translateConfig();

    // 設定觸發事件.
    const _regEvent = this.setEvents();

    // 取得傳遞給 DwSelectModalComponent 的預選值 selected.
    const _selected: Array<any> = this.getSelected(selected);

    const _dwModalRef: DwModalRef = this.createModal(config.dataSource, _selected);

    _dwModalRef.afterClose.subscribe(() => {
      _regEvent.afterClose();
    });

    _dwModalRef.afterOpen.subscribe(() => {
      _regEvent.afterOpen();
    });

    return this.modalSubject.asObservable();
  }
}
