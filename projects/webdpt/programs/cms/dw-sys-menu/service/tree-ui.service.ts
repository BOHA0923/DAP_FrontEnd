import { Injectable, Inject } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { switchMap, filter, distinctUntilChanged } from 'rxjs/operators';
import { DwTreeNode } from 'ng-quicksilver/tree';

import {
  DwProgramInfoLangLoaderService
} from '@webdpt/framework/program-info';
import { DwFinereportRepository } from '@webdpt/framework/finereport-core';
import { DwSysMenuRepository } from './menu-repository';
import { DwSysMenuNodeCreateModel } from '../model/menu.model';
import { DwSysMenuCreateService } from './create.service';

@Injectable()
export class DwSysMenuTreeUiService {

  constructor(
    private sysMenuRepository: DwSysMenuRepository,
    private sysMenuCreateService: DwSysMenuCreateService,
    private programInfoLangLoaderService: DwProgramInfoLangLoaderService,
    private sysReportRepository: DwFinereportRepository,
    // TODO：1.Menu編輯已不需要page和action 2.page和action不可使用token，用service才能包含平台作業
    // @Inject(DW_PROGRAM_PAGE) private programPageListJson: Array<any>, // 作業子頁面設定檔
    // @Inject(DW_PROGRAM_ACTION) private programActionListJson: Array<any> // 作業功能設定檔
  ) { }

  public sequenceMax(nodes: Array<any>, selfId: string): number {
    let seqMax = 0;
    nodes.forEach(
      node => {
        if (node.key !== selfId) {
          const sequence = node.origin.sequence ? node.origin.sequence : 0;
          if (sequence > seqMax) {
            seqMax = sequence;
          }
        }
      }
    );

    return seqMax;
  }

  public setMenuTreeName(language: string, menuTreeNodes: DwTreeNode[]): void {
    this.setMenuTreeNodeName(menuTreeNodes, {}, {}, {});

    this.sysMenuRepository.language(language).pipe(
      switchMap(
        (menuLangTrans: any) => {
          return this.programInfoLangLoaderService.getTranslation(language);
        },
        (menuLangTrans: any, programInfoLangTrans: any) => {
          this.sysReportRepository.language(language).subscribe(
            (frLangTrans: any) => {
              this.setMenuTreeNodeName(menuTreeNodes, menuLangTrans, programInfoLangTrans, frLangTrans);
            }
          );
        }
      )
    ).subscribe();
  }

  /**
   * 設定Menu節點多語言
   *
   * @param menuTreeNodes Menu樹狀結構節點
   * @param menuLangTrans Menu翻譯檔
   * @param programInfoLangTrans 作業翻譯檔
   * @param frLangTrans 報表翻譯檔
   */
  private setMenuTreeNodeName(menuTreeNodes: DwTreeNode[], menuLangTrans: any, programInfoLangTrans: any, frLangTrans: any): void {
    const len = menuTreeNodes.length;

    for (let i = 0; i < len; i++) {
      const obj = menuTreeNodes[i];
      const menuId = obj.key;
      const code = obj.origin.code;

      if (menuLangTrans[menuId]) {
        obj.origin.name = menuLangTrans[menuId];
      } else if (programInfoLangTrans[code]) {
        obj.origin.name = programInfoLangTrans[code];
      } else if (frLangTrans[code]) {
        obj.origin.name = frLangTrans[code];
      }

      if (obj.children.length > 0) {
        this.setMenuTreeNodeName(obj.children, menuLangTrans, programInfoLangTrans, frLangTrans);
      }
    }
  }

  /**
   * 節點新增保存
   * 同階層節點不可有相同的作業編號，但報表編號可重複
   */
  public addNodeSave(
    activedNode: DwTreeNode, dataC: DwSysMenuNodeCreateModel[], menuTreeNodes: DwTreeNode[]
  ): Observable<any> {

    const subject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
    let parentNode: DwTreeNode = null;
    const result = {
      parentNode: parentNode, // 新增成功要以父id刷新子樹，因為1.批次新增產生id 2.插入節點時其他節點可能改變順序
      parentId: '',
      success: false,
      message: ''
    };
    const dataCLen = dataC.length;
    let sibling: DwTreeNode[] = []; // 同階層節點
    const newList: DwSysMenuNodeCreateModel[] = []; // 可新增的節點

    if (dataCLen > 0) {
      let parentId = '';
      let maxSeq = 0;

      if (activedNode) {
        const isLeaf = activedNode.isLeaf;

        if (isLeaf) {
          parentNode = activedNode.getParentNode();
          if (parentNode) {
            parentId = parentNode.key;
            sibling = parentNode.children;
            maxSeq = activedNode.origin.sequence;
          } else {
            // 根節點
            sibling = menuTreeNodes;
            maxSeq = this.sequenceMax(sibling, null);
          }

        } else {
          parentNode = activedNode;
          parentId = activedNode.key;
          sibling = activedNode.children;
          maxSeq = this.sequenceMax(sibling, null);
        }
      } else {
        // 根節點
        sibling = menuTreeNodes;
        maxSeq = this.sequenceMax(sibling, null);
      }

      for (let i = 0; i < dataCLen; i++) {
        const isExist = this.addNodeIsExist(dataC[i].code, sibling);

        if (!isExist) {
          dataC[i].parent_id = parentId;
          maxSeq = maxSeq + 1;
          dataC[i].sequence = maxSeq;

          // if (dataC[i].type === 'program') {
          //   // 頁面權限基本資料
          //   const pageKeyLen = this.programPageListJson.length;
          //   for (let pageKeyIdx = 0; pageKeyIdx < pageKeyLen; pageKeyIdx++) {
          //     if (this.programPageListJson[pageKeyIdx].programId === dataC[i].code) {
          //       const pageList: Array<any> = this.programPageListJson[pageKeyIdx].page;
          //       pageList.forEach(
          //         pageItem => {
          //           dataC[i].page.push(
          //             {
          //               id: pageItem.id
          //             }
          //           );
          //         }
          //       );
          //     }
          //   }
          //   // 功能按鈕權限基本資料
          //   const actionKeyLen = this.programActionListJson.length;
          //   for (let actionKeyIdx = 0; actionKeyIdx < actionKeyLen; actionKeyIdx++) {
          //     if (this.programActionListJson[actionKeyIdx].programId === dataC[i].code) {
          //       const actionList: Array<any> = this.programActionListJson[actionKeyIdx].action;
          //       actionList.forEach(
          //         actionItem => {
          //           dataC[i].action.push(
          //             {
          //               id: actionItem.id
          //             }
          //           );
          //         }
          //       );
          //     }
          //   }
          // }

          newList.push(dataC[i]);
        }
      }

      const subscription = this.sysMenuCreateService.create(newList).subscribe(
        response => {
          result.parentNode = parentNode;
          result.parentId = parentId;
          result.success = response.success;
          result.message = response.message;
          subject.next(result);
        },
        error => {
        }
      );
    }

    return subject.asObservable().pipe(
      filter(obsData => obsData !== null), // 不廣播初始值
      distinctUntilChanged() // 有改變時才廣播
    );
  }

  /**
   * 新增時檢查同層節點是否已存在相同作業，但報表可重複
   */
  public addNodeIsExist(code: string, sibling: DwTreeNode[]): boolean {
    let isExist = false;
    if (code !== '') {
      sibling.forEach(
        s => {
          if (s.origin.type !== 'fineReport') {
            if (s.origin.code === code) {
              isExist = true;
            }
          }
        }
      );
    }

    return isExist;
  }
}
