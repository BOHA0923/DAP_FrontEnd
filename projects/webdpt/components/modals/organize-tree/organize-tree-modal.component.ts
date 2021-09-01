import { Component, Input, OnDestroy, ViewChild, OnInit, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';
import { DwFormatEmitEvent } from 'ng-quicksilver/tree';
import { DwTreeComponent } from 'ng-quicksilver/tree';
import { DwTreeNode } from 'ng-quicksilver/tree';

import { DwOrganizeTreeService } from '@webdpt/framework/organize-tree-core';
import { IDwOrgTreeConfig, IDwOrgTreeNode, IDwOrgTreeDataMode } from '@webdpt/framework/organize-tree-core';


@Component({
  selector: 'app-organize-tree-modal',
  templateUrl: './organize-tree-modal.component.html',
  styleUrls: ['./organize-tree-modal.component.css']
})
export class DwOrganizeTreeModalComponent implements OnInit, OnDestroy {
  private subscription: Subscription = new Subscription();

  searchValue: string;

  defaultCheckedKeys: Array<string> = [];
  defaultSelectedKeys: Array<string> = [];
  defaultExpandedKeys: Array<string> = [];
  // Tree ng-zorro-antd v1.6.0 畫面初始化時nodes不能給空陣列[]，否則背景會有警告訊息 ngModel only accepts an array and should be not empty.
  nodes: IDwOrgTreeNode[] = null;
  private _config: IDwOrgTreeDataMode = null;

  @ViewChild('treeCom') treeCom: DwTreeComponent;
  @Input() treeConfig: IDwOrgTreeConfig<DwTreeNode>; // 樹控件的設定檔.
  @Input() selected: IDwOrgTreeNode[];


  constructor(
    private dwOrganizeTreeService: DwOrganizeTreeService
  ) {

  }


  ngOnInit(): void {
    this._config = {
      dataType: this.treeConfig.dataType, // 取得的資料類型, full:組織+人 或 org:組織, 預設 full.
      keyType: this.treeConfig.keyType, // 指定tree 使用的 key 值, id 或 sid, 預設 id.
      selectType: this.treeConfig.selectType, // 指定可選取的節點類型, full:組織+人 或 user:人, 預設 full; 當值為user時, 必須依賴dataType=full, 當dataType=org時, 無作用.
      expandAll: this.treeConfig.expandAll, // 是否展開所有樹節點.
      sortType: this.treeConfig.sortType // 排序依據
    };

    this.subscription.add(
      this.dwOrganizeTreeService.getOrganizeTree(this._config).subscribe(
        (params: IDwOrgTreeNode) => {
          // 需要clone一份原始值, 因當空值時, 不會觸發變更檢測.
          this.nodes = JSON.parse(JSON.stringify(params));
          const _value = this.dwOrganizeTreeService.getKeys(this.selected);

          this.setDefaultValue(_value);

          // 展開樹節點
          this.setExpandTreeNodes();

          // 組織樹載入完成後, 調用定義的loaded()
          this.loaded();
        }
      )
    );
  }


  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }


  /**
   * 點擊展開樹節點圖標觸發.
   *
   */
  expandChange(event: DwFormatEmitEvent): void {
    if (event.node.getChildren().length === 0) {
      event.node.isLeaf = true;
    }

    if (event.node.getChildren().length > 0 || !event.node.isExpanded) {
      return;
    }

  }


  /**
   * modal 取值.區分多選與單選, 要取出資料, 不能直接回.
   *
   */
  getSelectedValue(): IDwOrgTreeNode[] {
    const result: IDwOrgTreeNode[] = [];

    if (this.treeConfig.checkable) { // 多選時取值.
      this.treeCom.getCheckedNodeList().forEach(item => {
        result.push(this.dwOrganizeTreeService.getNodeOriginValue(item.origin as IDwOrgTreeNode));
      });
    } else { // 單選時取值.
      this.treeCom.getSelectedNodeList().forEach(item => {
        result.push(this.dwOrganizeTreeService.getNodeOriginValue(item.origin as IDwOrgTreeNode));
      });
    }

    return result;
  }


  /**
   * 重新載入緩存.
   *
   */
  reloadCache(): void {
    // 最後的選取結果
    const _value = this.dwOrganizeTreeService.getKeys(this.getSelectedValue());

    this.subscription.add(
      this.dwOrganizeTreeService.reloadCache(this._config).subscribe(
        (params: IDwOrgTreeNode) => {
          // 需要clone一份原始值, 因當空值時, 不會觸發變更檢測.
          this.nodes = JSON.parse(JSON.stringify(params));

          // 因為 node 是新的 object, 關連已消失, 需重新指定.
          this.setDefaultValue(_value);

          // 展開樹節點
          this.setExpandTreeNodes();

          // 組織樹載入完成後, 調用定義的loaded()
          this.loaded();
      })
    );
  }


  /**
   * 設定預選值-只有在組織人員樹資料更新後, 設定一次.
   *
   */
  private setDefaultValue(_value: Array<string>): void {
    if (this.treeConfig.checkable) {
      this.defaultCheckedKeys = _value;
    } else {
      this.defaultSelectedKeys = _value;
    }

  }


  /**
   * 展開樹節點的層級.
   *
   */
  private setExpandTreeNodes(): void {
    // 當有設定展開
    if (!this.treeConfig.expandAll && this.treeConfig.expandLevel !== null && this.treeConfig.expandLevel >= 0) {
      // 需等待執行完本次的變更檢測後, 才能再進行值變更.
      setTimeout(() => {
        this.dwOrganizeTreeService.setExpandTreeNodes(this.treeCom.getTreeNodes(), this.treeConfig.expandLevel);
      });
    }

  }


  /**
   * 組織樹載入完成後, 調用定義的loaded().
   *
   */
  private loaded(): void {
    // 需等待執行完本次的變更檢測後, 才能取到 tree nodes 值.
    setTimeout(() => {
      this.treeConfig.loaded(this.treeCom.getTreeNodes());
    });
  }
}
