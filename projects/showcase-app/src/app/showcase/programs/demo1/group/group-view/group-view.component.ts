import {
  Component, OnInit, TemplateRef, ViewChild, ElementRef,
  AfterViewInit, HostListener, OnDestroy, Inject
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { DwMessageService } from 'ng-quicksilver/message';
import { DwModalService } from 'ng-quicksilver/modal';
import { DwRoutingMessageService } from '@webdpt/components/routing-message'; // 訊息傳遞
import { DwTabRoutingService } from '@webdpt/framework/routing-tabset'; // 訊息傳遞
import { DetailsInfoModel } from './../model';
import { GroupService } from '../service/group.service';
import { GroupDetailEditComponent } from './../group-detail-edit/group-detail-edit.component';
import { AbstractGroupView } from './group-view';
import { StatusModel, CurrencyModel, ExchangeSourceModel, ExchangeClassModel, ExchangeWayModel } from '../model';
import { Observable } from 'rxjs';
import { SaveService } from './../service/save.service';
import { DW_USING_TAB } from '@webdpt/framework/config';
import { DOCUMENT } from '@angular/common';
import { DwDivMaskComponent } from '@webdpt/components/load-mask';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-dw-group-view',
  templateUrl: './group-view.component.html',
  styleUrls: ['./group-view.component.css', '../group.component.css']
})
export class GroupViewComponent extends AbstractGroupView implements OnInit, AfterViewInit, OnDestroy {

  // 是否顯示加載中
  public searchLoading: boolean;
  public validateForm: FormGroup;
  public isView: boolean = true;
  public isSaving: boolean = false;
  public isDeleting: boolean = false;
  // 狀態碼列舉
  public searchStatusOptions: Observable<StatusModel[]>;
  public currencyOptions: Observable<CurrencyModel[]>;
  // public getCurrencyOptionsFirst:CurrencyModel[];
  public exchangeSourceOptions: Observable<ExchangeSourceModel[]>;
  public exchangeClassOptions: Observable<ExchangeClassModel[]>;
  public exchangeWayOptions: Observable<ExchangeWayModel[]>;
  public showLabel: (id: string, modelName: string) => Observable<any>;
  public currencyObj: any = {};
  public maskTriggers: HTMLElement[] = [];
  @ViewChild(DwDivMaskComponent) dwDivMaskComponent: DwDivMaskComponent;
  @ViewChild('detailDiv') detailDiv: ElementRef;
  // @ViewChild('maskDiv') maskDiv: ElementRef;
  // 訂單明細開窗用，僅為了展示開窗標題可以使用template
  @ViewChild('modifyDetailTitle') modifyDetailTitle: TemplateRef<any>;
  @ViewChild('addDetailTitle') addDetailTitle: TemplateRef<any>;
  // @HostListener('window:resize', ['$event'])
  // onResize($event: any): void {
  //   const maskDivNate = this.maskDiv.nativeElement;
  //   const detailDivNate = this.detailDiv.nativeElement;
  //   maskDivNate.style.height = detailDivNate.offsetHeight + 'px';
  //   maskDivNate.style.width = detailDivNate.offsetWidth + 'px';
  // }

  constructor(public route: ActivatedRoute,
    public router: Router,
    public fb: FormBuilder,
    public dwModalService: DwModalService,
    public groupService: GroupService,
    public dwMessage: DwRoutingMessageService,
    public DwMessage: DwMessageService,
    public saveService: SaveService,
    private tabRoutingService: DwTabRoutingService,
    @Inject(DOCUMENT) private doc: any,
    @Inject(DW_USING_TAB) private USING_TAB: boolean
  ) {
    super(groupService);
    this.searchStatusOptions = this.groupService.searchStatusOptions;
    this.currencyOptions = this.groupService.currencyOptions;
    this.exchangeSourceOptions = this.groupService.exchangeSourceOptions;
    this.exchangeClassOptions = this.groupService.exchangeClassOptions;
    this.exchangeWayOptions = this.groupService.exchangeWayOptions;

  }


  get dwDateFormat(): string {
    return this.groupService.getDateFormat();
  }

  ngOnInit(): void {
    // 單頭Form欄位
    this.validateForm = this.fb.group({
      'masterGroupId': [this.master.groupId, Validators.required],
      'masterGroupName': [this.master.groupName, Validators.required],
      'masterCurrencyId': [this.master.currencyId],
      'masterSourceId': [this.master.sourceId],
      'masterExchangeWay': [this.master.exchangeWay],
      'masterExchangeClass': [this.master.exchangeClass],
      'masterExchangeSource': [this.master.exchangeSource],
      'masterStatus': [this.master.status, Validators.required]
    });
    // 重設mask位置
    this.validateForm.statusChanges.pipe(
      debounceTime(200)
    ).subscribe((val) => {
      this.dwDivMaskComponent.adjustMask(100);
    });

    const menuDiv = this.doc.querySelector('.dw-header-left');
    if (menuDiv) {
      this.maskTriggers.push(menuDiv);
    }
    // window.addEventListener('scroll', this.onScroll.bind(this), true);

    // 取得路由參數
    this.route.queryParamMap.subscribe(
      params => {
        this.groupId = params.get('groupId') || '';
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
    // this.validateForm.get('masterGroupId').setValue(this.master.groupId);
    // this.validateForm.get('masterGroupName').setValue(this.master.groupName);
    // this.validateForm.get('masterCurrencyId').setValue(this.master.currencyId);
    // this.validateForm.get('masterSourceId').setValue(this.master.sourceId);
    // this.validateForm.get('masterExchangeWay').setValue(this.master.exchangeWay);
    // this.validateForm.get('masterExchangeClass').setValue(this.master.exchangeClass);
    // this.validateForm.get('masterExchangeSource').setValue(this.master.exchangeSource);
    // this.validateForm.get('masterStatus').setValue(this.master.status);
  }
  /**
   * 取得FormControl
   *
   * @param name
   * @returns
   * @memberof GroupViewComponent
   */
  public getFormControl(name: string): any {
    return this.validateForm.controls[name];
  }


  public detailDelete(idx: number): void {
    // this.detail.splice(idx, 1);
    const id = this.detail[idx].companyId;
    this.detail = this.detail.filter(d => d.companyId !== id);
    super.save();
  }

  /**
   * 修改公司明細
   *
   * @param idx
   * @memberof GroupViewComponent
   */
  public detailModify(idx: number): void {
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
      dwContent: GroupDetailEditComponent,
      dwOnOk: (data: any): void => {
        const result = this.saveService.get();
        detailInfo = result;
        modifyFn();
      },
      dwOnCancel(): void { },
      dwFooter: null,
      dwComponentParams: {
        cmd: 'view',
        groupDetail: new DetailsInfoModel(this.detail[idx])
      }
    })
      ;

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
        const result = this.saveService.get();
        newCompnayInfo = result;
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
    this.isView = true;
    // this.maskDiv.nativeElement.style.display = 'none';
  }
  public goList(): void {
    this.tabRoutingService.navigateToOpenerOrCreate(['../'], { relativeTo: this.route });
  }
  public msgAccess(result: any): void {
    const msg = result.description;
    if (result.status) {
      if (msg) {
        this.DwMessage.success(msg);
      }
      this.tabRoutingService.navigateOrCreate(['../'], { relativeTo: this.route });
    } else {
      if (msg) {
        this.DwMessage.error(msg); // 單一訊息顯示
      }
    }
  }

  // showLabel(id: string, modelName: string): Observable<any> {
  //   return Observable.create(observer => {
  //     this[modelName].subscribe((result) => {
  //       const filteredOption = result.filter((option) => {
  //         return option.value === id;
  //       });
  //       if (filteredOption.length) {
  //         observer.next(filteredOption[0].label);
  //         observer.complete();
  //       } else {
  //         observer.next('');
  //         observer.complete();
  //       }
  //     });
  //   });
  // }

  onBeforeGetGroup(): void {
    this.searchLoading = true; // 是否顯示加載中
  }

  onAfterGetGroup(): void {
    this.searchLoading = false; // 是否顯示加載中

    this.validateForm.get('masterGroupId').setValue(this.master.groupId);
    this.validateForm.get('masterGroupName').setValue(this.master.groupName);
    this.validateForm.get('masterCurrencyId').setValue(this.master.currencyId);
    this.validateForm.get('masterSourceId').setValue(this.master.sourceId);
    this.validateForm.get('masterExchangeWay').setValue(this.master.exchangeWay);
    this.validateForm.get('masterExchangeClass').setValue(this.master.exchangeClass);
    this.validateForm.get('masterExchangeSource').setValue(this.master.exchangeSource);
    this.validateForm.get('masterStatus').setValue(this.master.status);
  }

  onBeforeSaveGroup(): void {
    this.isSaving = true;
    this.master.groupId = this.validateForm.controls['masterGroupId'].value;
    this.master.groupName = this.validateForm.controls['masterGroupName'].value;
    this.master.currencyId = this.validateForm.controls['masterCurrencyId'].value;
    this.master.sourceId = this.validateForm.controls['masterSourceId'].value;
    this.master.exchangeWay = this.validateForm.controls['masterExchangeWay'].value;
    this.master.exchangeClass = this.validateForm.controls['masterExchangeClass'].value;
    this.master.exchangeSource = this.validateForm.controls['masterExchangeSource'].value;
    this.master.status = this.validateForm.controls['masterStatus'].value;
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
    // this.msgAccess(result);
    const msg = result.description;
    if (result.status) {
      if (msg) {
        this.DwMessage.success(msg);
        this.isView = true;
      }
    } else {
      if (msg) {
        this.DwMessage.error(msg); // 單一訊息顯示
      }
    }
    // this.maskDiv.nativeElement.style.display = 'none';
  }
}
