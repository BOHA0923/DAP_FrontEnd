import { Injectable, Inject } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { DwModalRef } from 'ng-quicksilver/modal';
import { DwModalService } from 'ng-quicksilver/modal';
import { DwTreeNode } from 'ng-quicksilver/tree';

import { DwOrganizeTreeModalComponent } from '../organize-tree-modal.component';
import { IDwOrgTreeModal, IDwOrgTreeConfig, IDwOrgTreeDefault, IDwOrgTreeNode, DW_ORGTREE_MODAL_DEFAULT } from '@webdpt/framework/organize-tree-core';


@Injectable({
  providedIn: 'root'
})
export class DwOrganizeTreeModalService {
  private modalConfig: IDwOrgTreeModal<DwOrganizeTreeModalComponent>; // 開窗的設定檔.
  private treeConfig: IDwOrgTreeConfig<DwTreeNode>; // 樹控件的設定檔.
  private modalSubject: Subject<any>;

  constructor(
    private dwModalService: DwModalService,
    private translateService: TranslateService,
    @Inject(DW_ORGTREE_MODAL_DEFAULT) private openOrgTreeModalDefault: IDwOrgTreeDefault<DwTreeNode>
  ) {
  }

  /**
   * 設定預設的開窗 modal與樹控件的參數.
   *
   */
  private getDefaultConfig(): IDwOrgTreeDefault<DwTreeNode> {
    return {
      modalTitle: 'dw-organize-tree-title', // modal 標題.
      modalWidth: '80%', // modal 寬度.
      modalOkText: 'dw-determine', // 確認按鈕文字.
      modalCancelText: 'dw-cancel', // 取消按鈕文字.
      modalOnOk: (): void => {}, // 點擊[確認]回調-[作業定義].
      modalOnCancel: (): void => {}, // 點擊[遮罩層]或[右上角叉]或[取消按鈕]的回調-[作業定義].
      modalAfterClose: (): void => {}, // Modal 完全關閉後的回調-[作業定義].
      modalAfterOpen: (): void => {}, // Modal 打開後的回調-[作業定義].
      treeCheckable: true, // 節點前新增 Checkbox 複選框.
      treeMultiple: false, // 支援點選多個節點（節點本身）.
      treeEnableSearch: true, // 開啟搜索.
      treeExpandAll: true, // 預設展開所有樹節點.
      treeExpandLevel: null, // 預設展開的層級, 必須依賴treeExpandAll=false, 當treeExpandAll=true時, 無作用.
      treeDataType: 'full', // 取得的資料類型, full:組織+人 或 org:組織, 預設 full.
      treeKeyType: 'id', // 指定tree 使用的 key 值, id 或 sid, 預設 id.
      treeSelectType: 'full', // 取得的資料類型, full:組織+人 或 org:組織, 預設 full.
      treeSortType: 'user', // 同階時以user|org那個為優先呈現順序
      treeLoaded: (treeNodes: DwTreeNode[]): void => {} // Tree 載入完成後回調-[作業定義].
    };
  }


  /**
   * 設定事件, 如果 config 裡也有註冊事件, 需調用.
   *
   */
  private setEvents(): void {
    // 點擊[確認]回調.
    this.modalConfig.dwOnOk = (result: DwOrganizeTreeModalComponent): void => {
      const selectedValue = result.getSelectedValue();
      this.modalSubject.next(selectedValue);
      this.modalSubject.complete();

      // 調用作業的 customOnOk.
      this.modalConfig.customOnOk();
    };


    // 點擊[遮罩層]或[右上角叉]或[取消按鈕]的回調.
    this.modalConfig.dwOnCancel = (result: DwOrganizeTreeModalComponent): void => {
      this.modalSubject.complete();

      // 調用作業的 customOnCancel.
      this.modalConfig.customOnCancel();
    };
  }


  /**
   * 調用 ng-zorro 的 create 開窗.
   *
   */
  private createModal(selected: Array<any>): DwModalRef {
    let dwModalRef: DwModalRef;

    const config: any = {
      dwTitle: this.modalConfig.dwTitle,
      dwContent: DwOrganizeTreeModalComponent,
      dwFooter: [
        {
          label: this.modalConfig.dwCancelText, // 取消按鈕文字.
          shape: 'default',
          onClick(): void {
            dwModalRef.triggerCancel();
          }
        },
        {
          label: this.modalConfig.dwOkText, // 確認按鈕文字.
          type: 'primary',
          onClick(): void {
            dwModalRef.triggerOk();
          }
        }
      ],
      dwComponentParams: {
        treeConfig: this.treeConfig,   // 樹控件的設定檔.
        selected: selected           // 已選取的清單.
      },
      ...this.modalConfig
    };

    dwModalRef = this.dwModalService.create(config);

    return dwModalRef;
  }


  /**
   * 設定開窗 modal 的參數.
   *
   */
  private setModalConfig(allConfig: IDwOrgTreeDefault<DwTreeNode>): void {

    this.modalConfig = Object.assign({}, {
      dwTitle: allConfig.modalTitle,
      dwWidth: allConfig.modalWidth,
      dwOkText: allConfig.modalOkText,
      dwCancelText: allConfig.modalCancelText,
      customOnOk: allConfig.modalOnOk,
      customOnCancel: allConfig.modalOnCancel,
      customAfterClose: allConfig.modalAfterClose,
      customAfterOpen: allConfig.modalAfterOpen
    });
  }


  /**
   * 設定樹控件的參數.
   *
   */
  private setTreeConfig(allConfig: IDwOrgTreeDefault<DwTreeNode>): void {

    this.treeConfig = Object.assign({}, {
      checkable: allConfig.treeCheckable,
      multiple: allConfig.treeMultiple,
      enableSearch: allConfig.treeEnableSearch,
      expandAll: allConfig.treeExpandAll,
      expandLevel: allConfig.treeExpandLevel,
      dataType: allConfig.treeDataType,
      keyType: allConfig.treeKeyType,
      selectType: allConfig.treeSelectType,
      loaded: allConfig.treeLoaded,
      sortType: allConfig.treeSortType
    });
  }


  /**
   * 取得開窗 merge 後的設定檔.
   *
   */
  private setConfig(config: IDwOrgTreeDefault<DwTreeNode>): void {
    // config 的優先順序, 3.service 2. shard/default 1. open(config).
    const defaultConfig = this.getDefaultConfig();
    const allConfig = {...defaultConfig, ...this.openOrgTreeModalDefault, ...config};

    // 開窗 modal 的參數.
    this.setModalConfig(allConfig);

    // 樹控件的參數.
    this.setTreeConfig(allConfig);
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
   * 開窗.
   *
   */
  open(selected: IDwOrgTreeNode[], config: IDwOrgTreeDefault<DwTreeNode> = {}): Observable<any> {
    this.modalSubject = new Subject();

    // 分析設定檔.
    this.setConfig(config);

    // 多語.
    this.translateConfig();

    // 設定觸發事件.
    this.setEvents();

    const dwModalRef: DwModalRef = this.createModal(selected);

    dwModalRef.afterClose.subscribe(() => {
      this.modalConfig.customAfterClose();
    });

    dwModalRef.afterOpen.subscribe(() => {
      this.modalConfig.customAfterOpen();
    });

    return this.modalSubject.asObservable();
  }


}
