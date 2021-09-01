import {
  Component, OnInit, OnDestroy, ViewChild, ElementRef, TemplateRef, HostListener, Input,
  EventEmitter, Output, Inject
} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { DwModalService } from 'ng-quicksilver/modal';
import { DwTreeNode } from 'ng-quicksilver/tree';
import { DwRoutingMessageService } from '@webdpt/components/routing-message';
import { DOCUMENT } from '@angular/common';
import { DwDivMaskComponent } from '@webdpt/components/load-mask';
import { debounceTime } from 'rxjs/operators';
import { AbstractTree } from '../abstract-tree';
import {
  TreeCurrencyModel, TreeDetailsInfoModel,
  TreeExchangeClassModel,
  TreeExchangeSourceModel,
  TreeExchangeWayModel,
  TreeStatusModel
} from '../model';
import { TreeMenuService } from '../service/tree-menu.service';
import { DetailEditComponent } from '../detail-edit/detail-edit.component';

@Component({
  selector: 'app-dw-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent extends AbstractTree implements OnInit, OnDestroy {

  public searchLoading: boolean; // 是否顯示加載中.
  public validateForm: FormGroup; // 單頭Form欄位.
  public isView: boolean = true; // 單頭+單身是否在瀏覽狀態.
  public isCanEdit: boolean = true; // 是否允許單頭編輯+單身新增+刪除整筆.
  public isCanDelete: boolean = true; // 是否可以刪除整筆時, 當level = 0 時, 不提供刪除.
  public isSaving: boolean = false; // 單頭進行保存時, 顯示 loading.
  public isDeleting: boolean = false; // 進行刪除整筆時, 顯示 loading.
  private masterItem: DwTreeNode; // 左側樹狀點擊的 node.

  // 狀態碼列舉
  public searchStatusOptions: Observable<TreeStatusModel[]>;
  public currencyOptions: Observable<TreeCurrencyModel[]>;
  public exchangeSourceOptions: Observable<TreeExchangeSourceModel[]>;
  public exchangeClassOptions: Observable<TreeExchangeClassModel[]>;
  public exchangeWayOptions: Observable<TreeExchangeWayModel[]>;
  public showLabel: (id: string, modelName: string) => Observable<any>;
  public currencyObj: any = {};
  public maskTriggers: HTMLElement[] = [];
  @ViewChild(DwDivMaskComponent) dwDivMaskComponent: DwDivMaskComponent;
  @Input() treeItemObserve: Observable<any>; // 左側的點擊的Observable.
  @Output() deleteTreeMenu = new EventEmitter(); // 傳遞刪除的樹狀 node.
  @Output() isViewEvent = new EventEmitter(); // 傳遞單頭是否編輯.

  @ViewChild('detailDiv') detailDiv: ElementRef;
  // @ViewChild('maskDiv') maskDiv: ElementRef;
  // 訂單明細開窗用，僅為了展示開窗標題可以使用template
  @ViewChild('modifyDetailTitle') modifyDetailTitle: TemplateRef<any>;
  @ViewChild('addDetailTitle') addDetailTitle: TemplateRef<any>;

  // HostListener 是屬性裝飾器，用來為宿主元素新增事件監聽.
  // 單頭在編輯狀態下, 進行視窗改變大小時, 確保遮罩能正確的覆蓋在單身上面.
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
    public treeMenuService: TreeMenuService,
    @Inject(DOCUMENT) private doc: any,
    public dwMessage: DwRoutingMessageService
  ) {
    super(treeMenuService);
    this.searchStatusOptions = this.treeMenuService.searchStatusOptions;
    this.currencyOptions = this.treeMenuService.currencyOptions;
    this.exchangeSourceOptions = this.treeMenuService.exchangeSourceOptions;
    this.exchangeClassOptions = this.treeMenuService.exchangeClassOptions;
    this.exchangeWayOptions = this.treeMenuService.exchangeWayOptions;
    this.isViewEvent.emit(true);
  }

  ngOnInit(): void {
    this.treeItemObserve.subscribe(
      response => {
        this.masterItem = response;
        this.isCanEdit = false;
        this.isCanDelete = true;
        if (this.masterItem) {
          if (response.level === 0) {
            this.isCanDelete = false;
          }
          this.groupId = response.origin.key; // 此 key 為 number, 在比對時, 需轉換[toString()]成字串.
          this.isCanEdit = true;
          super.ngOnInit();
        }

        // 因為 dw-input 有使用 *ngIf, 當使用FormBuilder建立表單元件時, formControlName 此時不存在, 無法進行初始化, 需先為 this.validateForm 建立一個空的FormGroup.
        this.validateForm = this.fb.group({});
        const menuDiv = this.doc.querySelector('.dw-header-left');
        if (menuDiv) {
          this.maskTriggers.push(menuDiv);
        }

      },
      (error: any) => {
      }
    );

  }

  ngOnDestroy(): void {
    // window.removeEventListener('scroll', this.onScroll.bind(this), true);
  }

  /**
   * 捲軸捲動事件, 單頭在編輯狀態下, 進行捲動時, 確保遮罩能正確的覆蓋在單身上面.
   *
   * @memberof ListComponent
   */
  // public onScroll(): void {
  //   if (!this.isView) {
  //     const maskDivNate = this.maskDiv.nativeElement;
  //     const detailDivNate = this.detailDiv.nativeElement;
  //     maskDivNate.style.top = detailDivNate.getBoundingClientRect().top + detailDivNate.scrollTop + 'px';
  //     maskDivNate.style.left = detailDivNate.getBoundingClientRect().left + detailDivNate.scrollLeft + 'px';
  //   }
  // }

  /**
   * 編輯單頭, 並讓單身設定遮罩.
   *
   * @memberof ListComponent
   */
  public masterModify(): void {
    this.isViewEvent.emit(false);
    this.isView = false;
    // const maskDivNate = this.maskDiv.nativeElement;
    // const detailDivNate = this.detailDiv.nativeElement;
    // maskDivNate.style.height = detailDivNate.offsetHeight + 'px';
    // maskDivNate.style.width = detailDivNate.offsetWidth + 'px';

    // 表單欄位可視後, 使用FormBuilder建立表單元件.
    this.validateForm = this.fb.group({
      'groupId': [this.master.groupId, Validators.required],
      'groupName': [this.master.groupName, Validators.required],
      'currencyId': [this.master.currencyId],
      'sourceId': [this.master.sourceId],
      'exchangeWay': [this.master.exchangeWay],
      'exchangeClass': [this.master.exchangeClass],
      'exchangeSource': [this.master.exchangeSource],
      'status': [this.master.status, Validators.required]
    });
    // 表單變化重設mask位置
    this.validateForm.statusChanges.pipe(
      debounceTime(200)
    ).subscribe((val) => {
      this.dwDivMaskComponent.adjustMask(100);
    });
  }

  /**
   * 刪除單身一筆資料.
   *
   * @param  idx 陣列 index.
   * @memberof ListComponent
   */
  public detailDelete(idx: number): void {
    this.detail = this.detail.filter(item => item.seq !== idx);
    super.save();
  }

  /**
   * 修改單身一筆資料.
   *
   * @param  idx 陣列 index.
   * @memberof ListComponent
   */
  public detailModify(idx: number): void {
    const dwModalRef = this.dwModalService.create({
      dwTitle: this.modifyDetailTitle,
      dwContent: DetailEditComponent,
      dwOnCancel(): void { },
      dwFooter: null,
      dwComponentParams: {
        cmd: 'view',
        groupDetail: new TreeDetailsInfoModel(this.detail[idx])
      }
    });

    dwModalRef.afterClose.subscribe(result => {
      if (!result) {
        return;
      }

      this.detail[idx] = Object.assign(this.detail[idx], result.data);
    });

  }

  /**
   * 新增單身一筆資料.
   *
   * @memberof ListComponent
   */
  public detailAdd(): void {
    let newCompnayInfo: TreeDetailsInfoModel;

    const dwModalRef = this.dwModalService.create({
      dwTitle: this.addDetailTitle,
      dwContent: DetailEditComponent,
      dwOnCancel(): void { },
      dwFooter: null,
      dwComponentParams: { cmd: 'add' }
    });

    dwModalRef.afterClose.subscribe(result => {
      if (!result) {
        return;
      }
      newCompnayInfo = result.data;
      newCompnayInfo.seq = this.treeMenuService.treeDetailMaxSeq(this.detail) + 1;
      super.addDetail(newCompnayInfo);
    });
  }

  /**
   * 刪除右側單頭+單身
   *
   * @memberof ListComponent
   */
  public deleteMaster(): void {
    const that = this;
    this.dwModalService.confirm({
      dwIconType: 'close-circle',
      dwTitle: '刪除資料會將會一併刪除子項目，確定刪除?',
      // content: '<b>一些解释</b>',
      dwOnOk(): void {
        that.isDeleting = true;
        that.treeMenuService.deleteTreeList({ 'groupIds': [that.master.groupId] }).subscribe(
          (result) => {
            that.isDeleting = false;
            that.onResetTreeDetail();
            that.deleteTreeMenu.emit(that.masterItem); // 通知左側刪除樹狀 node.
          });
      },
      dwOnCancel(): void {
      }
    });
  }

  /**
   * 重新設定, 清空單頭+單身資料.
   *
   * @memberof ListComponent
   */
  private onResetTreeDetail(): void {
    super.resetTreeDetail();
  }

  /**
   * 取消不保存.
   *
   * @memberof ListComponent
   */
  public cancel(): void {
    this.isViewEvent.emit(true);
    this.isView = true;
  }

  onBeforeGetTree(): void {
    this.searchLoading = true; // 是否顯示加載中
  }

  onAfterGetTree(): void {
    this.searchLoading = false; // 是否顯示加載中
  }

  onBeforeSaveTree(): void {
    this.isSaving = true;

    // 取得[ReactiveForm]的表單資料, merge 至 單頭.
    this.master = Object.assign(this.master, this.validateForm.value);

    const option = TreeCurrencyModel.staticLists.filter((_option) => {
      return _option.value === this.master.currencyId;
    });
    if (option.length) {
      this.master.currencyName = option[0].label;
    }
  }

  onAfterSaveTree(result: any): void {
    // this.masterItem.title = this.master.groupName; // 如果有需要改 tree title 名稱時, 改此值.
    this.isSaving = false;
    this.isViewEvent.emit(true);
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
  }

}
