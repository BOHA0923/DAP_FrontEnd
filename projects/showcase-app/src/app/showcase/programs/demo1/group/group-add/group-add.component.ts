import { Component, OnInit, TemplateRef, ViewChild, ElementRef, AfterViewInit, Inject } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DwMessageService } from 'ng-quicksilver/message';
import { DwModalService } from 'ng-quicksilver/modal';

import { DwRoutingMessageService } from '@webdpt/components/routing-message'; // 訊息傳遞
import { DwTabRoutingService } from '@webdpt/framework/routing-tabset'; // 訊息傳遞
import { DetailsInfoModel } from './../model';
import { GroupService } from '../service/group.service';
import { GroupDetailEditComponent } from './../group-detail-edit/group-detail-edit.component';
import { AbstractGroupAdd } from './group-add';
import { StatusModel, CurrencyModel, ExchangeSourceModel, ExchangeClassModel, ExchangeWayModel } from '../model';
import { Observable } from 'rxjs';
import fnsFormat from 'date-fns/format';
import { SaveService } from './../service/save.service';
import { DW_USING_TAB } from '@webdpt/framework/config';
@Component({
  selector: 'app-dw-group-add',
  templateUrl: './group-add.component.html',
  styleUrls: ['./group-add.component.css', '../group.component.css']
})
export class GroupAddComponent extends AbstractGroupAdd implements OnInit, AfterViewInit {

  // 是否顯示加載中
  public searchLoading: boolean;
  public validateForm: FormGroup;
  public isSaving: boolean = false;
  public isDeleting: boolean = false;
  // 狀態碼列舉
  public searchStatusOptions: Observable<StatusModel[]>;
  public currencyOptions: Observable<CurrencyModel[]>;
  // public getCurrencyOptionsFirst:CurrencyModel[];
  public exchangeSourceOptions: Observable<ExchangeSourceModel[]>;
  public exchangeClassOptions: Observable<ExchangeClassModel[]>;
  public exchangeWayOptions: Observable<ExchangeWayModel[]>;
  public currencyObj: any = {};
  @ViewChild('detailDiv') detailDiv: ElementRef;
  @ViewChild('maskDiv') maskDiv: ElementRef;
  // 訂單明細開窗用，僅為了展示開窗標題可以使用template
  @ViewChild('modifyDetailTitle') modifyDetailTitle: TemplateRef<any>;
  @ViewChild('addDetailTitle') addDetailTitle: TemplateRef<any>;

  constructor(public route: ActivatedRoute,
    public router: Router,
    public fb: FormBuilder,
    public dwModalService: DwModalService,
    public groupService: GroupService,
    public dwMessage: DwRoutingMessageService,
    public DwMessage: DwMessageService,
    public location: Location,
    public saveService: SaveService,
    private tabRoutingService: DwTabRoutingService,
    @Inject(DW_USING_TAB) private USING_TAB: boolean,
  ) {
    super(groupService);
  }

  get dwDateTimeFormat(): string {
    return this.groupService.getDateTimeFormat();
  }

  ngOnInit(): void {

    // 透過Http
    this.searchStatusOptions = StatusModel.getList(); // 狀態碼列舉初始化
    this.currencyOptions = CurrencyModel.getList();
    // CurrencyModel.getList().subscribe((result) => {
    //   this.getCurrencyOptionsFirst = result;
    // });
    this.exchangeClassOptions = ExchangeClassModel.getList();
    this.exchangeWayOptions = ExchangeWayModel.getList();
    this.exchangeSourceOptions = ExchangeSourceModel.getList();
    // 單頭Form欄位
    this.validateForm = this.fb.group({
      'masterGroupId': [this.master.groupId, Validators.required],
      'masterGroupName': [this.master.groupName, Validators.required],
      'masterCurrencyId': [this.master.currencyId],
      'masterSourceId': [this.master.sourceId],
      'masterExchangeWay': [this.master.exchangeWay],
      'masterExchangeClass': [this.master.exchangeClass],
      'masterExchangeSource': [this.master.exchangeSource],
      'masterStatus': [this.master.status, Validators.required],
      'masterGroupDate': fnsFormat(new Date(), this.dwDateTimeFormat)
    });
    this.master.status = 'Y';
    this.master.groupDate = this.validateForm.get('masterGroupDate').value;
    this.validateForm.get('masterStatus').setValue(this.master.status);
    this.validateForm.get('masterCurrencyId').valueChanges.subscribe((val) => {
      this.master.currencyId = val;
    });
    this.validateForm.get('masterSourceId').valueChanges.subscribe((val) => {
      this.master.sourceId = val;
    });
    this.validateForm.get('masterExchangeWay').valueChanges.subscribe((val) => {
      this.master.exchangeWay = val;
    });
    this.validateForm.get('masterExchangeClass').valueChanges.subscribe((val) => {
      this.master.exchangeClass = val;
    });
    this.validateForm.get('masterExchangeSource').valueChanges.subscribe((val) => {
      this.master.exchangeSource = val;
    });
    this.validateForm.get('masterStatus').valueChanges.subscribe((val) => {
      this.master.status = val;
    });
    super.ngOnInit();
  }
  ngAfterViewInit(): void {
    // console.log(this.maskDiv);
  }
  masterModify(): void {
    const maskDivNate = this.maskDiv.nativeElement;
    const detailDivNate = this.detailDiv.nativeElement;

    maskDivNate.style.height = detailDivNate.offsetHeight + 'px';
    maskDivNate.style.width = detailDivNate.offsetWidth + 'px';

  }
  /**
   * 取得FormControl
   *
   * @param name
   * @returns
   * @memberof GroupAddComponent
   */
  public getFormControl(name: string): any {
    return this.validateForm.controls[name];
  }


  public detailDelete(idx: number): void {
    this.detail.splice(idx, 1);
  }

  /**
   * 修改公司明細
   *
   * @param idx
   * @memberof GroupAddComponent
   */
  public detailModify(idx: number): void {
    let detailInfo: DetailsInfoModel;

    const viewFn = (): void => {
      this.detail[idx] = detailInfo;
    };
    this.dwModalService.create({
      dwTitle: this.modifyDetailTitle,
      dwContent: GroupDetailEditComponent,
      dwOnOk: (data: any): void => {
        const result = this.saveService.get();
        detailInfo = result;
        viewFn();
      },
      dwOnCancel(): void { },
      dwFooter: null,
      dwComponentParams: {
        cmd: 'view',
        groupDetail: new DetailsInfoModel(this.detail[idx])
      }
    });

  }
  public detailAdd(): void {
    let newCompnayInfo: any;

    const addDetailFn = (): void => {
      newCompnayInfo.seq = this.groupService.groupDetailMaxSeq(this.detail) + 1;
      super.addDetail(newCompnayInfo);
    };

    this.dwModalService.create({
      dwTitle: this.addDetailTitle,
      dwContent: GroupDetailEditComponent,
      dwOnOk: (data: any): void => {
        newCompnayInfo = this.saveService.get();
        addDetailFn();
      },
      dwOnCancel(): void { },
      dwFooter: null,
      dwComponentParams: { cmd: 'add' }
    });
  }
  public deleteMaster(): void {
    this.isDeleting = true;
    this.groupService.deleteGroupList({ 'groupIds': [this.master.groupId] }).subscribe(
      (result) => {
        this.isDeleting = false;
        this.msgAccess(result);
      });
  }

  public cancel(): void {
    this.tabRoutingService.navigateToOpenerOrCreate(['../'], { relativeTo: this.route }, true);
  }
  public msgAccess(result: any): void {
    const msg = result.description;
    if (result.status) {
      if (msg) {
        this.DwMessage.success(msg);
      }
      this.tabRoutingService.navigateToOpenerOrCreate(['../'], { relativeTo: this.route }, true);
    } else {
      if (msg) {
        this.DwMessage.error(msg); // 單一訊息顯示
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


  onBeforeSaveGroup(): void {
    this.isSaving = true;
    const currencyId = this.validateForm.controls['masterCurrencyId'].value;
    const option = CurrencyModel.staticLists.filter((_option) => {
      return _option.value === currencyId;
    });
    if (option.length) {
      this.master.currencyName = option[0].label;
    }
  }

  onAfterSaveGroup(result: any): void {
    this.isSaving = false;
    this.msgAccess(result);
  }

}
