import { OnInit } from '@angular/core';
import { MasterModel, DetailsInfoModel, DetailsChildInfoModel } from '../model';
import { AsisService } from '../service/asis.service';

export abstract class AbstractAsisAdd implements OnInit {

  public asisId: string;
  public master: MasterModel = new MasterModel({});
  public detail: DetailsInfoModel[] = <DetailsInfoModel[]>[];
  public detailSelected: DetailsInfoModel;
  public detailChildren: { 'itemId': string, 'detail': DetailsChildInfoModel[] }[] = [];
  public detailChildList: any[] = [];
  public childTableTitle: string = '';
  constructor(public asisService: AsisService) { }

  ngOnInit(): void {

  }


  /**
   * 新增明細
   *
   * @memberof AsisAddComponent
   */
  public addDetail(detail: DetailsInfoModel): void {
    // this.detail.push(detail);
    this.detail = [...this.detail, Object.assign({}, detail)];
    this.detailClick(detail);
  }
  public detailClick(detail: DetailsInfoModel): void {
    this.detail.forEach((_detail) => {
      _detail.selected = false;
    });
    detail.selected = true;
    this.detailSelected = detail;
    this.childTableTitle = detail.itemName;
    const child = this.detailChildren.filter((_child) => {
      return _child.itemId === detail.itemId;
    });
    this.detailChildList = child.length ? child[0].detail : [];
  }
  public addChild(child: DetailsChildInfoModel): void {
    // this.detailChildList.push(child);
    this.detailChildList = [...this.detailChildList, Object.assign({}, child)];
    const nowChild = this.detailChildren.filter((_child) => {
      return _child.itemId === this.detailSelected.itemId;
    });
    if (nowChild.length) {
      nowChild[0].detail.push(child);
    } else {
      this.detailChildren.push({
        'itemId': this.detailSelected.itemId,
        'detail': [child]
      });
    }
  }
  /**
   * 保存
   *
   * @memberof AsisAddComponent
   */
  public save(): void {
    this.onBeforeSaveAsis();
    this.asisService.addAsis(this.master, this.detail, this.detailChildren).subscribe(
      (response: any) => {
        this.onAfterSaveAsis(response);
      }
    );
  }

  /**
   * 保存資料前
   */
  abstract onBeforeSaveAsis(): void;

  /**
   * 保存資料後
   * @param result
   */
  abstract onAfterSaveAsis(result: any): void;
}
