import { Component, OnInit, TemplateRef, ViewChild, ElementRef, AfterViewInit, OnDestroy, HostListener, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { DwModalService } from 'ng-quicksilver/modal';
import { DwRoutingMessageService } from '@webdpt/components/routing-message'; // 訊息傳遞
import { DwTabRoutingService } from '@webdpt/framework/routing-tabset'; // 訊息傳遞
import { DetailsInfoModel, DetailsChildInfoModel } from './../model';
import { AsisService } from '../service/asis.service';
import { AsisDetailEditComponent } from './../asis-detail-edit/asis-detail-edit.component';
import { AsisDetailChildEditComponent } from './../asis-detail-child-edit/asis-detail-child-edit.component';
import { AbstractAsisAdd } from './asis-add';
import { StatusModel } from '../model';
import { Observable } from 'rxjs';
import fnsFormat from 'date-fns/format';
import { SaveService } from './../service/save.service';
import { DW_USING_TAB } from '@webdpt/framework/config';

@Component({
  selector: 'app-dw-asis-add',
  templateUrl: './asis-add.component.html',
  styleUrls: ['./asis-add.component.css', '../asis.component.css']
})
export class AsisAddComponent extends AbstractAsisAdd implements OnInit, AfterViewInit, OnDestroy {

  // 是否顯示加載中
  public searchLoading: boolean;
  public validateForm: FormGroup;
  public isSaving: boolean = false;
  public isDeleting: boolean = false;
  // 狀態碼列舉
  public searchStatusOptions: Observable<StatusModel[]>;

  @ViewChild('detailDiv') detailDiv: ElementRef;

  // 訂單明細開窗用，僅為了展示開窗標題可以使用template
  @ViewChild('modifyDetailTitle') modifyDetailTitle: TemplateRef<any>;
  @ViewChild('addDetailTitle') addDetailTitle: TemplateRef<any>;

  constructor(public route: ActivatedRoute,
    public router: Router,
    public fb: FormBuilder,
    public dwModalService: DwModalService,
    public asisService: AsisService,
    public dwMessage: DwRoutingMessageService,
    public saveService: SaveService,
    private tabRoutingService: DwTabRoutingService,
    @Inject(DW_USING_TAB) private _usingTab: boolean
  ) {
    super(asisService);
  }

  get dwDateTimeFormat(): string {
    return this.asisService.getDateTimeFormat();
  }

  ngOnInit(): void {

    // 透過Http
    this.searchStatusOptions = StatusModel.getList(); // 狀態碼列舉初始化
    // 單頭Form欄位
    this.validateForm = this.fb.group({
      'masterAsisId': [null, Validators.required],
      'masterAsisName': [null, Validators.required],
      'masterNote': [null],
      'masterStatus': [null, Validators.required],
      'masterAsisDate': fnsFormat(new Date(), this.dwDateTimeFormat)
    });
    this.master.status = 'Y';
    this.validateForm.get('masterStatus').setValue(this.master.status);
    this.validateForm.get('masterStatus').valueChanges.subscribe((val) => {
      this.master.status = val;
    });
    this.master.asisDate = this.validateForm.get('masterAsisDate').value;
    console.log(this.master);
    super.ngOnInit();
  }
  ngOnDestroy(): void {
  }
  ngAfterViewInit(): void {
  }

  /**
   * 取得FormControl
   *
   * @param name
   * @returns
   * @memberof AsisAddComponent
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
    } else {
      this.detailSelected = null;
    }
  }

  /**
   * 修改公司明細
   *
   * @param idx
   * @memberof AsisAddComponent
   */
  public detailModify(idx: number): void {
    this.detailClick(this.detail[idx]);
    let detailInfo: DetailsInfoModel;
    const viewFn = (): void => {
      this.detail[idx] = detailInfo;
      this.detail = this.detail.filter((d) => {
        return d;
      });
    };
    this.dwModalService.create({
      dwTitle: this.modifyDetailTitle,
      dwContent: AsisDetailEditComponent,
      dwOnOk: (data: any): void => {
        detailInfo = this.saveService.get();
        viewFn();
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
    let newDetailInfo: any;

    const addDetailFn = (): void => {
      newDetailInfo.seq = this.asisService.asisDetailMaxSeq(this.detail) + 1;
      super.addDetail(newDetailInfo);
    };

    this.dwModalService.create({
      dwTitle: this.addDetailTitle,
      dwContent: AsisDetailEditComponent,
      dwOnOk: (data: any): void => {
        newDetailInfo = this.saveService.get();
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
  public detailChildDelete(idx: number): void {
    const id = this.detailChildList[idx].biId;
    this.detailChildList.splice(idx, 1);
    this.detailChildList = this.detailChildList.filter(d => d.biId !== id);
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
    if (this._usingTab) {
      this.tabRoutingService.close();
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
        this.tabRoutingService.close();
      } else {
        this.router.navigate(['../'], { relativeTo: this.route }); // 相對路徑導頁
      }
    } else {
      if (msg) {
        this.dwMessage.error(msg); // 單一訊息顯示
      }
    }
  }

  showLabel(id: string, modelName: string): Observable<any> {
    return Observable.create(observer => {
      this[modelName].subscribe((result) => {
        const filteredOption = result.filter((option) => {
          return option.value === id;
        });
        if (filteredOption.length) {
          observer.next(filteredOption[0].label);
          observer.complete();
        } else {
          observer.next('');
          observer.complete();
        }
      });
    });
  }


  onBeforeSaveAsis(): void {
    this.isSaving = true;
  }

  onAfterSaveAsis(result: any): void {
    this.isSaving = false;
    this.msgAccess(result);
  }

}
