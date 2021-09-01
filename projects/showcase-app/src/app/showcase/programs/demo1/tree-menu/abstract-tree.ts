import { OnInit } from '@angular/core';
import { TreeDetailsInfoModel, TreeMasterModel } from './model';
import { TreeMenuService } from './service/tree-menu.service';

export abstract class AbstractTree implements OnInit {

  public groupId: string;
  public master: TreeMasterModel = new TreeMasterModel({});
  public detail: TreeDetailsInfoModel[] = <TreeDetailsInfoModel[]>[];

  constructor(public treeMenuService: TreeMenuService) { }

  ngOnInit(): void {
    this.onBeforeGetTree();
    this.treeMenuService.getTreeDetail(this.groupId).subscribe(
      (data: any) => {
        this.master = new TreeMasterModel(data.master);
        this.master.groupDate = new Date(this.master.groupDate);
        this.detail = TreeDetailsInfoModel.parseToArray(data.detail);
        this.onAfterGetTree();
      }
    );
  }

  /**
   * 新增明細
   *
   * @memberof AbstractTree
   */
  public addDetail(detail: TreeDetailsInfoModel): void {
    this.detail = [ ...this.detail, detail];
    this.save();
  }

  /**
   * 保存
   *
   * @memberof AbstractTree
   */
  public save(): void {
    this.onBeforeSaveTree();
    this.treeMenuService.modifyTree(this.master, this.detail).subscribe(
      (response: any) => {
        this.onAfterSaveTree(response);
      }
    );
  }

  /**
   * 重新設定, 清空單頭+單身資料.
   *
   * @memberof AbstractTree
   */
  public resetTreeDetail(): void {
    this.master = new TreeMasterModel({});
    this.detail = [];
  }

  /**
   * 取得資料前
   */
  abstract onBeforeGetTree(): void;

  /**
   * 取得資料後
   */
  abstract onAfterGetTree(): void;

  /**
   * 保存資料前
   */
  abstract onBeforeSaveTree(): void;

  /**
   * 保存資料後
   * @param result
   */
  abstract onAfterSaveTree(result: any): void;
}
