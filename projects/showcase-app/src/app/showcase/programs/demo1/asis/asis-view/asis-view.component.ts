import { AfterViewInit, Component, ElementRef, Inject, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { DwModalService } from 'ng-quicksilver/modal';
import { DW_USING_TAB } from '@webdpt/framework/config';
import { DwComponent } from '@webdpt/components/redevelop'; // 訊息傳遞
import { DwRoutingMessageService } from '@webdpt/components/routing-message'; // 訊息傳遞
import { DwTabRoutingService } from '@webdpt/framework/routing-tabset'; // 訊息傳遞
import { DetailsChildInfoModel, DetailsInfoModel } from './../model';
import { AsisService } from '../service/asis.service';
import { AsisDetailEditComponent } from './../asis-detail-edit/asis-detail-edit.component';
import { AsisDetailChildEditComponent } from './../asis-detail-child-edit/asis-detail-child-edit.component';
import { AbstractAsisView } from './asis-view';
import { StatusModel } from '../model';
import { Observable } from 'rxjs';
import { SaveService } from './../service/save.service';
import { DOCUMENT } from '@angular/common';
import { debounceTime } from 'rxjs/operators';
import { DwDivMaskComponent } from '@webdpt/components/load-mask';

@Component({
  selector: 'app-dw-asis-view',
  templateUrl: './asis-view.component.html',
  styleUrls: ['./asis-view.component.css', '../asis.component.css']
})
export class AsisViewComponent extends AbstractAsisView implements OnInit, AfterViewInit, OnDestroy {

  // 是否顯示加載中
  public searchLoading: boolean;
  public validateForm: FormGroup;
  public isView: boolean = true;
  public isSaving: boolean = false;
  public isDeleting: boolean = false;
  // 狀態碼列舉
  public searchStatusOptions: Observable<StatusModel[]>;
  public showLabel: (id: string, modelName: string) => Observable<any>;
  public customStyle = { background: '#000000', opacity: 0.1 };
  public maskTriggers: HTMLElement[] = [];
  @ViewChild(DwDivMaskComponent) dwDivMaskComponent: DwDivMaskComponent;
  @ViewChild('detailDiv') detailDiv: ElementRef;
  //// 遮罩改用dw-div-mask元件設定
  // @ViewChild('maskDiv') maskDiv: ElementRef;
  // 訂單明細開窗用，僅為了展示開窗標題可以使用template
  @ViewChild('modifyDetailTitle') modifyDetailTitle: TemplateRef<any>;
  @ViewChild('addDetailTitle') addDetailTitle: TemplateRef<any>;

  constructor(public route: ActivatedRoute,
    public router: Router,
    public _route: ActivatedRoute,
    public fb: FormBuilder,
    public dwModalService: DwModalService,
    public asisService: AsisService,
    public dwMessage: DwRoutingMessageService,
    public saveService: SaveService,
    private tabRoutingService: DwTabRoutingService,
    @Inject(DOCUMENT) private doc: any,
    @Inject(DW_USING_TAB) private _usingTab: boolean
  ) {
    super();
    this.searchStatusOptions = this.asisService.searchStatusOptions;

  }


  get dwDateFormat(): string {
    return this.asisService.getDateFormat();
  }

  ngOnInit(): void {
    // 單頭Form欄位
    this.validateForm = this.fb.group({
      'masterAsisId': [null, [Validators.required]],
      'masterAsisName': [null, [Validators.required]],
      'masterNote': [null],
      'masterStatus': [null, [Validators.required]]
      // 'masterAsisDate': [this.master.asisDate, Validators.required],
    });
    // 重設mask位置
    this.validateForm.statusChanges.pipe(
      debounceTime(200)
    ).subscribe((val) => {
      this.dwDivMaskComponent.adjustMask(100);
    });

    // window.addEventListener('scroll', this.onScroll.bind(this), true);
    const menuDiv = this.doc.querySelector('.dw-header-left');
    if (menuDiv) {
      this.maskTriggers.push(menuDiv);
    }

    // 取得路由參數
    this.route.queryParamMap.subscribe(
      params => {
        this.asisId = params.get('asisId') || '';
        super.ngOnInit();
      }
    );

  }
  ngOnDestroy(): void {
    // window.removeEventListener('scroll', this.onScroll.bind(this), true);
  }
  ngAfterViewInit(): void {
  }

  masterModify(): void {
    this.isView = false;
    // this.validateForm.get('masterAsisId').setValue(this.master.asisId);
    // this.validateForm.get('masterAsisName').setValue(this.master.asisName);
    // this.validateForm.get('masterNote').setValue(this.master.note);
    // this.validateForm.get('masterStatus').setValue(this.master.status);
  }
  /**
   * 取得FormControl
   *
   * @param  name
   * @returns
   * @memberof AsisViewComponent
   */
  public getFormControl(name: string): any {
    return this.validateForm.controls[name];
  }


  public detailDelete(idx: number): void {
    let childIdx = -1;
    for (let i = 0; i < this.detailChildren.length; i++) {
      if (this.detailChildren[i].itemId === this.detail[idx].itemId) {
        childIdx = i;
        break;
      }
    }
    // 刪除子表
    if (childIdx >= 0) {
      this.detailChildren.splice(childIdx, 1);
      this.detailChildList = [];
    }
    const id = this.detail[idx].itemId;
    // this.detail.splice(idx, 1);
    this.detail = this.detail.filter(d => d.itemId !== id);
    if (this.detail.length) {
      this.detailClick(this.detail[0]);
    }
    super.save();
  }
  public detailChildDelete(idx: number): void {
    const id = this.detailChildList[idx].biId;
    this.detailChildList.splice(idx, 1);
    this.detailChildList = this.detailChildList.filter(d => d.biId !== id);
    super.save();
  }
  /**
   * 修改明細
   *
   * @param  idx
   * @memberof AsisViewComponent
   */
  public detailModify(idx: number): void {
    this.detailClick(this.detail[idx]);
    let detailInfo: DetailsInfoModel;
    const modifyFn = (): void => {
      this.detail[idx] = detailInfo;
      this.detail = this.detail.filter((d) => {
        return d;
      });
      super.save();
    };
    this.dwModalService.create({
      dwTitle: this.modifyDetailTitle,
      dwContent: AsisDetailEditComponent,
      dwOnOk: (data: any): void => {
        detailInfo = this.saveService.get();
        modifyFn();
      },
      dwOnCancel(): void { },
      dwFooter: null,
      dwComponentParams: {
        cmd: 'view',
        asisDetail: new DetailsInfoModel(this.detail[idx])
      }
    });

  }
  public detailAdd(): void {
    let newCompnayInfo: any;

    const addDetailFn = (): void => {
      newCompnayInfo.seq = this.asisService.asisDetailMaxSeq(this.detail) + 1;
      super.addDetail(newCompnayInfo);
    };

    this.dwModalService.create({
      dwTitle: this.addDetailTitle,
      dwContent: AsisDetailEditComponent,
      dwOnOk: (data: any): void => {
        newCompnayInfo = this.saveService.get();
        addDetailFn();
      },
      dwOnCancel(): void { },
      dwFooter: null,
      dwComponentParams: { cmd: 'add' }
    });
  }
  public detailChildModify(idx: number): void {
    let detailChildInfo: DetailsChildInfoModel;

    const modifyFn = (): void => {
      this.detailChildList[idx] = detailChildInfo;
      this.detailChildList = this.detailChildList.filter((d) => {
        return d;
      });
      super.save();
    };
    this.dwModalService.create({
      dwTitle: this.childTableTitle + '細部修改',
      dwContent: AsisDetailChildEditComponent,
      dwOnOk: (data: any): void => {
        detailChildInfo = this.saveService.get();
        modifyFn();
      },
      dwOnCancel(): void { },
      dwFooter: null,
      dwComponentParams: {
        cmd: 'view',
        asisDetailChild: new DetailsChildInfoModel(this.detailChildList[idx])
      }
    });

  }
  public detailChildAdd(): void {
    let newChildInfo: DetailsChildInfoModel;

    const addChildFn = (): void => {
      super.addChild(newChildInfo);
    };

    this.dwModalService.create({
      dwTitle: this.childTableTitle + '細部新增',
      dwContent: AsisDetailChildEditComponent,
      dwOnOk: (data: any): void => {
        newChildInfo = this.saveService.get();
        addChildFn();
      },
      dwOnCancel(): void { },
      dwFooter: null,
      dwComponentParams: { cmd: 'add' }
    });
  }
  public deleteMaster(): void {
    this.isDeleting = true;
    this.asisService.deleteAsisList({ 'asisIds': [this.master.asisId] }).subscribe(
      (result) => {
        this.isDeleting = false;
        this.msgAccess(result);
      });
  }

  public cancel(): void {
    this.isView = true;
  }
  public goList(): void {
    if (this._usingTab) {
      this.tabRoutingService.navigateToOpenerOrCreate(['../'], { relativeTo: this.route });
    } else {
      this.router.navigate(['../'], { relativeTo: this.route }); // 相對路徑導頁
    }
  }
  public msgAccess(result: any): void {
    const msg = result.description;
    if (result.status) {
      if (msg) {
        this.dwMessage.addToRoute(msg);
      }
      if (this._usingTab) {
        this.tabRoutingService.navigateToOpenerOrCreate(['../'], { relativeTo: this.route });
      } else {
        this.router.navigate(['../'], { relativeTo: this.route }); // 相對路徑導頁
      }
    } else {
      if (msg) {
        this.dwMessage.error(msg); // 單一訊息顯示
      }
    }
  }


  onBeforeGetAsis(): void {
    this.searchLoading = true; // 是否顯示加載中
  }

  onAfterGetAsis(): void {
    this.searchLoading = false; // 是否顯示加載中
    this.validateForm.get('masterAsisId').setValue(this.master.asisId);
    this.validateForm.get('masterAsisName').setValue(this.master.asisName);
    this.validateForm.get('masterNote').setValue(this.master.note);
    this.validateForm.get('masterStatus').setValue(this.master.status);
  }

  onBeforeSaveAsis(): void {
    this.isSaving = true;
    this.master.asisId = this.validateForm.controls['masterAsisId'].value;
    this.master.asisName = this.validateForm.controls['masterAsisName'].value;
    this.master.note = this.validateForm.controls['masterNote'].value;
    this.master.status = this.validateForm.controls['masterStatus'].value;
  }

  onAfterSaveAsis(result: any): void {
    this.isSaving = false;
    // this.msgAccess(result);
    const msg = result.description;
    if (result.status) {
      if (msg) {
        this.dwMessage.success(msg);
        this.isView = true;
      }
    } else {
      if (msg) {
        this.dwMessage.error(msg); // 單一訊息顯示
      }
    }
    // this.maskDiv.nativeElement.style.display = 'none';
  }

}
