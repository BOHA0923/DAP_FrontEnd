import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DwModalService } from 'ng-quicksilver/modal';
import { DwTreeNode } from 'ng-quicksilver/tree';

import { TreeMenuService } from './service/tree-menu.service';

@Component({
  selector: 'app-dw-tree-menu',
  templateUrl: './tree-menu.component.html',
  styleUrls: ['./tree-menu.component.css']
})
export class TreeMenuComponent implements OnInit {

  treeItemSubject: BehaviorSubject<any>; // 傳遞給右側單頭+單身的點擊node item.
  // Tree ng-zorro-antd v1.6.0 畫面初始化時dwData不能給空陣列[]，否則背景會有警告訊息 ngModel only accepts an array and should be not empty.
  treeMenuData: DwTreeNode[] = null; // 樹狀 Nested 結構資料.
  expandKeys: string[] = []; // 根節點下的第 1 層的每個 node 的展開陣列清單.
  public isViewEvent: boolean = true; // 右側單頭+單身的編輯狀態.

  constructor(private treeMenuService: TreeMenuService,
    private dwModalService: DwModalService
  ) {
    this.treeItemSubject = new BehaviorSubject<any>(null);
  }

  ngOnInit(): void {
    this.treeMenuService.getTreeMenu().subscribe(
      (data: any) => {
        this.treeMenuData = [];

        data.forEach(item => {
          this.treeMenuData.push(new DwTreeNode(item));
        });
      }
    );
  }

  /**
   * 刪除樹狀的一個 node, 包括其子 node.
   *
   * @param $event 樹狀的一個 node
   * @memberof TreeMenuComponent
   */
  public doDeleteTreeMenu($event: DwTreeNode): void {
    const theKey = $event.origin.key;
    if ($event.parentNode) { // 刪除其他節點.
      const idx = $event.parentNode.children.findIndex(item => item.origin.key === theKey);
      $event.parentNode.children.splice(idx, 1);
    } else { // 刪除第一層節點(目前不允許刪除).
      const idx = this.treeMenuData.findIndex(item => item.origin.key === theKey);
      this.treeMenuData.splice(idx, 1);
    }

    this.treeItemSubject.next(null);
  }

  /**
   * [展開/縮合]樹狀節點, [記錄/移除]節點的key.
   *
   * @param e 被展開的 node.
   * @memberof TreeMenuComponent
   */
  public expandDataCache($event: any): void {
    const theKey = $event.node.origin.key;
    if ($event.node.isExpanded) { // 展開時.
      this.expandKeys.push(theKey);
    } else { // 縮合時.
      const idx = this.expandKeys.findIndex(value => value === theKey);
      this.expandKeys.splice(idx, 1);
    }
  }

  /**
   * 點擊樹狀節點後, 取得單頭與單身.
   *
* @param 被點擊的 node.
   * @returns {void}
   * @memberof TreeMenuComponent
   */
  public openDetail($event: any): void {
    if (!this.isViewEvent) {
      return;
    }

    this.treeItemSubject.next($event.node);
  }

  /**
   * 接收單頭的編輯狀態.
   *
   * @param  $event  是否是編輯狀態.
   * @returns void
   * @memberof TreeMenuComponent
   */
  public doIsViewEvent($event: boolean): void {
    this.isViewEvent = $event;
  }

}
