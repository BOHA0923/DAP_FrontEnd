import { OnInit } from '@angular/core';
import { MasterModel, DetailsInfoModel, DetailsChildInfoModel } from '../model';
import { AsisService } from '../service/asis.service';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { DwRoutingMessageService } from '@webdpt/components/routing-message'; // 訊息傳遞
export abstract class AbstractAsisView implements OnInit {
  abstract router: Router;
  abstract _route: ActivatedRoute;
  abstract dwMessage: DwRoutingMessageService;
  abstract asisService: AsisService;
  public asisId: string;
  public master: MasterModel = new MasterModel({});
  public detail: DetailsInfoModel[] = <DetailsInfoModel[]>[];
  public detailChildren: { 'itemId': string, 'detail': DetailsChildInfoModel[] }[] = [];
  public detailChildList: any[] = [];
  public childTableTitle: string = '';

  constructor() { }

  ngOnInit(): void {
    this.onBeforeGetAsis();
    this.asisService.getAsisDetail(this.asisId).subscribe(
      (data: any) => {
        this.master = new MasterModel(data.master);
        this.master.asisDate = new Date(this.master.asisDate);
        this.detail = DetailsInfoModel.parseToArray(data.detail);
        this.detailChildren = data.detailChildren;
        if (this.detail.length) {
          this.detail.forEach((detail) => {
            detail.selected = false;
          });
          this.detail[0].selected = true;
          this.childTableTitle = this.detail[0].itemName;
          const child = this.detailChildren.filter((_child) => {
            return _child.itemId === this.detail[0].itemId;
          });
          this.detailChildList = child.length ? child[0].detail : [];
        }
        this.onAfterGetAsis();
      },
      (error) => {
        this.dwMessage.error('查詢資料錯誤'); // 單一訊息顯示
        this.router.navigate(['../'], { relativeTo: this._route });
      }
    );
  }


  /**
   * 新增明細
   *
   * @memberof AsisViewComponent
   */
  public addDetail(detail: DetailsInfoModel): void {
    // this.detail.push(detail);
    this.detail = [...this.detail, Object.assign({}, detail)];
    this.detailClick(detail);
    this.save();
  }
  public detailClick(detail: DetailsInfoModel): void {
    this.detail.forEach((_detail) => {
      _detail.selected = false;
    });
    detail.selected = true;
    this.childTableTitle = detail.itemName;
    const child = this.detailChildren.filter((_child) => {
      return _child.itemId === detail.itemId;
    });
    this.detailChildList = child.length ? child[0].detail : [];
  }
  public addChild(child: DetailsChildInfoModel): void {
    // this.detailChildList.push(child);
    this.detailChildList = [...this.detailChildList, Object.assign({}, child)];
    const detailSelected = this.detail.filter((detail) => {
      return detail.selected === true;
    });
    const nowChild = this.detailChildren.filter((_child) => {
      return _child.itemId === detailSelected[0].itemId;
    });
    if (nowChild.length) {
      nowChild[0].detail = this.detailChildList;
    } else {
      this.detailChildren.push({
        'itemId': detailSelected[0].itemId,
        'detail': [...this.detailChildList]
      });
    }
    this.save();
  }
  /**
   * 保存
   *
   * @memberof AsisViewComponent
   */
  public save(): void {
    this.onBeforeSaveAsis();
    this.asisService.modifyAsis(this.master, this.detail, this.detailChildren).subscribe(
      (response: any) => {
        this.onAfterSaveAsis(response);
      }
    );
  }

  /**
   * 取得資料前
   */
  abstract onBeforeGetAsis(): void;

  /**
   * 取得資料後
   */
  abstract onAfterGetAsis(): void;

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
