import { Component, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs';

import { TranslateService } from '@ngx-translate/core';
import { DwTreeNode } from 'ng-quicksilver/tree';

import { DwOrganizeTreeModalService } from '@webdpt/components/modals/organize-tree';
import {
  DwOrganizeTreeService,
  IDwOrgTreeNode,
  IDwOrgTreeDataMode,
  IDwOrgTreeDefault
} from '@webdpt/framework/organize-tree-core';


@Component({
  selector: 'app-organize-tree',
  templateUrl: './organize-tree.component.html',
  styleUrls: ['./organize-tree.component.css']
})
export class OrganizeTreeComponent implements OnDestroy {
  private subscription: Subscription = new Subscription();

  // 用戶ID與租戶ID
  // // 儲存節點必要資訊的範例
  // multiple: IDwOrgTreeNode[] = [
  //   { type: 'org', key: 'AA0001', title: '服務部', sid: '100002', parentSid: null },
  //   { type: 'org', key: 'ABA002', title: '測試組', sid: '100012', parentSid: '100003' },
  //   { type: 'user', key: 'ABA001', title: '沈海', sid: '100001', parentSid: '100011' },
  //   { type: 'user', key: 'AC0001', title: '李志江', sid: '100002', parentSid: '100004' }
  // ];
  // multipleLists: IDwOrgTreeNode[] = [
  //   { type: 'org', key: 'AA0001', title: '服務部', sid: '100002', parentSid: null },
  //   { type: 'org', key: 'ABA002', title: '測試組', sid: '100012', parentSid: '100003' },
  //   { type: 'user', key: 'ABA001', title: '沈海', sid: '100001', parentSid: '100011' },
  //   { type: 'user', key: 'AC0001', title: '李志江', sid: '100002', parentSid: '100004' }
  // ];
  multiple: IDwOrgTreeNode[] = [];
  multipleLists: IDwOrgTreeNode[] = [];
  single: IDwOrgTreeNode[] = [];
  singleLists: IDwOrgTreeNode[] = [];


  // 用戶Sid與租戶Sid
  sidMultiple: IDwOrgTreeNode[] = [];
  sidMultipleLists: IDwOrgTreeNode[] = [];
  sidSingle: IDwOrgTreeNode[] = [];
  sidSingleLists: IDwOrgTreeNode[] = [];


  // 用戶Sid與租戶Sid - 只選人員
  // sidMultipleOnlyuser: IDwOrgTreeNode[] = []; // 與UX操作情境不符合, 不建議使用此設定展開組織樹
  // sidMultipleListsOnlyuser: IDwOrgTreeNode[] = []; // 與UX操作情境不符合, 不建議使用此設定展開組織樹
  sidSingleOnlyuser: IDwOrgTreeNode[] = [];
  sidSingleListsOnlyuser: IDwOrgTreeNode[] = [];

  constructor(
    private translateService: TranslateService,
    private dwOrganizeTreeModalService: DwOrganizeTreeModalService,
    private dwOrganizeTreeService: DwOrganizeTreeService
  ) {
  }


  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }


  /**
   * 當 ngModel 為 object 陣列時需要用這判斷是否為已選取.
   *
   */
  compareWith(o1: any, o2: any): boolean {
    return (o1 && o2) ? ((o1.type + o1.key) === (o2.type + o2.key)) : (JSON.stringify(o1) === JSON.stringify(o2));
  }


  /**
   * 開啟多選窗-用戶ID與租戶ID.
   *
   */
  openMultiple($event: any): void {
    $event.preventDefault();
    this.subscription.add(
      this.dwOrganizeTreeModalService.open(this.multiple).subscribe(
        (retMultiple) => {
          this.multiple = retMultiple;
        }
      )
    );
  }


  /**
   * 開啟單選窗-用戶ID與租戶ID.
   *
   */
  openSingle($event: any): void {
    $event.preventDefault();

    const _config: IDwOrgTreeDefault<DwTreeNode> = {
      modalTitle: this.translateService.instant('dw-organize-tree-org-title'),
      treeDataType: 'org',
      treeCheckable: false,
      treeEnableSearch: false
    };

    this.subscription.add(
      this.dwOrganizeTreeModalService.open(this.single, _config).subscribe(
        (retSingle) => {
          this.single = retSingle;
        }
      )
    );
  }


  /**
   * 取得組織結構清單-多選-用戶ID與租戶ID.
   *
   */
  getMultipleNodeLists(): void {
    this.multipleLists = [];

    this.subscription.add(
      this.dwOrganizeTreeService.getNodeLists(this.multiple).subscribe(
        (ret) => {
          this.multipleLists = ret;
          console.log('convertedTotree>>>>', this.dwOrganizeTreeService.convertedTotree(this.multipleLists));
      })
    );
  }


  /**
   * 取得組織結構清單-單選-用戶ID與租戶ID.
   *
   */
  getSingleNodeLists(): void {
    this.singleLists = [];
    const _config: IDwOrgTreeDataMode = {
      dataType: 'org'
    };

    this.subscription.add(
      this.dwOrganizeTreeService.getNodeLists(this.single, _config).subscribe(
        (ret) => {
          this.singleLists = ret;
          console.log('convertedTotree>>>>', this.dwOrganizeTreeService.convertedTotree(this.singleLists));
      })
    );
  }


  /**
   * 開啟多選窗-用戶Sid與租戶Sid.
   *
   */
  openSidMultiple($event: any): void {
    $event.preventDefault();
    const _config: IDwOrgTreeDefault<DwTreeNode> = {
      treeKeyType: 'sid'
    };

    this.subscription.add(
      this.dwOrganizeTreeModalService.open(this.sidMultiple, _config).subscribe(
        (retSidMultiple) => {
          this.sidMultiple = retSidMultiple;
        }
      )
    );
  }


  /**
   * 開啟單選窗-用戶Sid與租戶Sid.
   *
   */
  openSidSingle($event: any): void {
    $event.preventDefault();
    const _config: IDwOrgTreeDefault<DwTreeNode> = {
      modalTitle: this.translateService.instant('dw-organize-tree-org-title'),
      treeKeyType: 'sid',
      treeDataType: 'org',
      treeCheckable: false,
      treeEnableSearch: false
    };

    this.subscription.add(
      this.dwOrganizeTreeModalService.open(this.sidSingle, _config).subscribe(
        (retSidSingle) => {
          this.sidSingle = retSidSingle;
        }
      )
    );
  }


  /**
   * 取得組織結構清單-多選-用戶Sid與租戶Sid.
   *
   */
  getSidMultipleNodeLists(): void {
    this.sidMultipleLists = [];
    const _config: IDwOrgTreeDataMode = {
      keyType: 'sid'
    };

    this.subscription.add(
      this.dwOrganizeTreeService.getNodeLists(this.sidMultiple, _config).subscribe(
        (ret) => {
          this.sidMultipleLists = ret;
          console.log('convertedTotree>>>>', this.dwOrganizeTreeService.convertedTotree(this.sidMultipleLists));
      })
    );
  }


  /**
   * 取得組織結構清單-單選-用戶Sid與租戶Sid.
   *
   */
  getSidSingleNodeLists(): void {
    this.sidSingleLists = [];
    const _config: IDwOrgTreeDataMode = {
      dataType: 'org',
      keyType: 'sid'
    };

    this.subscription.add(
      this.dwOrganizeTreeService.getNodeLists(this.sidSingle, _config).subscribe(
        (ret) => {
          this.sidSingleLists = ret;
          console.log('convertedTotree>>>>', this.dwOrganizeTreeService.convertedTotree(this.sidSingleLists));
      })
    );
  }


  /**
   * 開啟多選窗-用戶Sid與租戶Sid - 只選人員 - 與UX操作情境不符合, 不建議使用此設定展開組織樹.
   *
   */
  // openSidMultipleOnlyuser($event: any): void {
  //   $event.preventDefault();
  //   const _config: IDwOrgTreeDefault = {
  //     treeKeyType: 'sid',
  //     treeSelectType: 'user',
  //     treeExpandAll: false, // 是否展開所有樹節點
  //     // treeExpandLevel: 0, // 展開第 0 層, 會看到第1層, 展開的層級, 必須依賴treeExpandAll=false, 當treeExpandAll=true時, 無作用.
  //     treeLoaded: this.treeAfterLoaded
  //   };

  //   this.subscription.add(
  //     this.dwOrganizeTreeModalService.open(this.sidMultipleOnlyuser, _config).subscribe(
  //       (retSidMultipleOnlyuser) => {
  //         console.log('retSidMultipleOnlyuser>>>', retSidMultipleOnlyuser);
  //         this.sidMultipleOnlyuser = retSidMultipleOnlyuser;
  //       }
  //     )
  //   );
  // }


  /**
   * 組織樹載入完成後, 可以獲取元件DwTreeNode節點.
   * 範例 - 在 treeExpandAll: false 時, 展開根節點, 在 treeExpandAll: true 時, 無作用.
   *
   */
  private treeAfterLoaded(treeNodes: DwTreeNode[]): void {
    treeNodes.forEach((node: DwTreeNode) => {
      node.isExpanded = true;
    });
  }


  /**
   * 開啟單選窗-用戶Sid與租戶Sid - 只選人員.
   *
   */
  openSidSingleOnlyuser($event: any): void {
    $event.preventDefault();
    const _config: IDwOrgTreeDefault<DwTreeNode> = {
      modalTitle: this.translateService.instant('dw-organize-tree-org-title'),
      treeKeyType: 'sid',
      treeSelectType: 'user',
      treeCheckable: false,
      treeEnableSearch: false,
      treeExpandAll: true, // 是否展開所有樹節點
      treeLoaded: this.treeAfterLoaded
    };

    this.subscription.add(
      this.dwOrganizeTreeModalService.open(this.sidSingleOnlyuser, _config).subscribe(
        (retSidSingleOnlyuser) => {
          this.sidSingleOnlyuser = retSidSingleOnlyuser;
        }
      )
    );
  }


  /**
   * 取得組織結構清單-多選-用戶Sid與租戶Sid - 只選人員 - 與UX操作情境不符合, 不建議使用此設定展開組織樹.
   *
   */
  // getSidMultipleNodeListsOnlyuser(): void {
  //   this.sidMultipleListsOnlyuser = [];
  //   const _config: IDwOrgTreeDataMode = {
  //     keyType: 'sid',
  //     selectType: 'user'
  //   };

  //   this.subscription.add(
  //     this.dwOrganizeTreeService.getNodeLists(this.sidMultipleOnlyuser, _config).subscribe(
  //       (ret) => {
  //         this.sidMultipleListsOnlyuser = ret;
  //         console.log('convertedTotree>>>>', this.dwOrganizeTreeService.convertedTotree(this.sidMultipleListsOnlyuser));
  //     })
  //   );
  // }


  /**
   * 取得組織結構清單-單選-用戶Sid與租戶Sid - 只選人員.
   *
   */
  getSidSingleNodeListsOnlyuser(): void {
    this.sidSingleListsOnlyuser = [];
    const _config: IDwOrgTreeDataMode = {
      keyType: 'sid',
      selectType: 'user'
    };

    this.subscription.add(
      this.dwOrganizeTreeService.getNodeLists(this.sidSingleOnlyuser, _config).subscribe(
        (ret) => {
          this.sidSingleListsOnlyuser = ret;
          console.log('convertedTotree>>>>', this.dwOrganizeTreeService.convertedTotree(this.sidSingleListsOnlyuser));
      })
    );
  }
}
