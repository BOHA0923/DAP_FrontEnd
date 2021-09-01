import { Component, EventEmitter, forwardRef, Inject, Input, Optional, Output, SkipSelf } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { MasterModel, SearchConditionModel, StatusModel } from '../model';
import { GroupService } from '../service/group.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { DW_USING_TAB } from '@webdpt/framework/config';
import { DwComponent } from '@webdpt/components/redevelop';
import { DwTabClose, DwTabRoutingService } from '@webdpt/framework/routing-tabset';
import { DwModalService } from 'ng-quicksilver/modal';
import { Observable } from 'rxjs';
import { find, map, skipWhile } from 'rxjs/operators';

@Component({
  selector: 'app-dw-group-list',
  templateUrl: './group-list.component.html',
  styleUrls: ['../group.component.css', './group-list.component.css'],
  providers: [
    { provide: DwComponent, useExisting: forwardRef(() => GroupListComponent) }
  ]
})
export class GroupListComponent extends DwComponent {

  allChecked: boolean = false;
  disabledButton: boolean = true;
  checkedNumber: number = 0;
  checkedDescription: string = '';
  status: string = '';
  operating: boolean = false;
  indeterminate: boolean = false;
  public searchStatusOptions: Observable<StatusModel[]>; // 狀態碼列舉

  // 查詢列表
  public rowCount = 0; // 總筆數
  public dataSet = []; // 查詢列表資料

  searchForm: FormGroup;


  // 進階查詢開合 true:關閉, false:打開
  @Input()
  isCollapse = true;

  // 是否查詢載入中
  @Input()
  searchLoading = true;

  // 排序欄位方式 for UI
  @Input()
  sortMap = {
    currencyId: null,
  };

  @Output() beforeSearch = new EventEmitter();
  @Output() afterSearch = new EventEmitter();
  @Output() init = new EventEmitter();
  @Output() pageIndexChange = new EventEmitter();
  @Output() pageSizeChange = new EventEmitter();

  public search: SearchConditionModel = new SearchConditionModel();
  private readonly tabEventSubscription;
  private viewDataTabId: string;
  private addDataTabId: string = 'group-add-tab'; // 新增頁面的頁籤編號

  constructor(
    protected router: Router,
    protected fb: FormBuilder,
    protected _route: ActivatedRoute,
    protected groupService: GroupService,
    private dwModalService: DwModalService,
    @Inject(DW_USING_TAB) private USING_TAB: boolean,
    private tabRoutingService: DwTabRoutingService,
    @SkipSelf() @Optional() _parentDwComponent: DwComponent) {
    super(_parentDwComponent);
    // this.search.pageSize = 1;
    // 初始化表單欄位

    if (this.USING_TAB) {
      // 監聽多頁籤的事件
      // 如果是關閉的事件，且為從此作業開啟的新增，則刷新數據
      this.tabEventSubscription = this.tabRoutingService.events.subscribe((event) => {
        const isTabClose = event instanceof DwTabClose;
        const isReloadTab = (event.tabId === this.addDataTabId || event.tabId === this.viewDataTabId);
        if (isTabClose && isReloadTab) {
          this.searchData(false);
        }
      });
    }
  }

  /**
   * 排序
   *
   * @param  sortName
   * @param  sortExpression
   * @memberof GroupComponent
   */
  public sortBy(sortName: string, sortExpression: string): void {

    this.search.clearSortSet();
    Object.keys(this.sortMap).forEach(key => {
      if (key !== sortName) {
        this.sortMap[key] = null;
      } else {
        this.sortMap[key] = sortExpression;
        if (sortExpression !== null) {
          this.search.addSortSet({
            sortName: key, // 排序欄位
            sortExpression: sortExpression // 排序順序
          });
        }
      }
    });

    this.searchData(true);
  }


  /**
   * 查詢資料
   *
   * @param  [reset=false] 是否重新指定當前頁碼為第一頁
   * @memberof GroupComponent
   */
  public searchData(reset: boolean = false): void {

    this.onBeforeSearch();

    if (reset) { // 是否重新指定當前頁碼為第一頁
      this.search.pageIndex = 1;
    }

    this.groupService.getGroupList(this.search.pageIndex, this.search.pageSize, this.searchForm.value, this.search.sortSet).subscribe(
      (response: any) => {
        this.rowCount = response.rowCount; // 總筆數
        this.dataSet = response.datas || []; // 資料
        this.onAfterSearch();
      }
    );
  }


  /**
   * 清除
   *
   * @memberof GroupComponent
   */
  public resetForm(): void {
    // 查詢條件欄位初始化
    this.searchForm.reset(this.search.clear());
  }


  /**
   * 每頁筆數改變
   *
   * @memberof GroupComponent
   */
  public onPageSizeChange(): void {
    this.searchData(true);
    this.pageSizeChange.emit();
  }

  /**
   * 當前頁碼改變
   *
   * @param  pageIndex 當前頁碼
   * @memberof GroupComponent
   */
  public onPageIndexChange(pageIndex: number): void {
    console.log(pageIndex);
    this.search.pageIndex = pageIndex;
    this.pageIndexChange.emit();
    this.searchData(false);
  }

  public view(groupId: string): void {
    const navigationExtras: NavigationExtras = {
      relativeTo: this._route, // 相對路徑導頁
      queryParams: { 'groupId': groupId }
    };

    this.viewDataTabId = this.tabRoutingService.navigateOrCreate(
      ['../dw-group-view'],
      navigationExtras,
      this.viewDataTabId
    );
  }

  public addDataModal(): void {
    this.addDataTabId = this.tabRoutingService.navigateOrCreate(
      ['../dw-group-add'],
      { relativeTo: this._route },
      this.addDataTabId,
      'page.dw-group-add' // 標題：多語言編號，對應到翻譯檔的key。可以不用傳入此參數，預設以作業編號翻譯。
    );
  }

  public operateData(command: string): void {
    if (command === 'delete') {
      console.log(this.dataSet);
      const items = this.dataSet.filter(value => value.checked);
      const that = this;
      this.dwModalService.confirm({
        dwIconType: 'close-circle',
        dwTitle: '刪除資料會將會一併刪除子項目，確定刪除?',
        // content: '<b>一些解释</b>',
        dwOnOk(): void {
          console.log(items);
          that.operating = true;
          const deletedIds: string[] = [];
          for (let i = 0; i < items.length; i++) {
            deletedIds.push(items[i].groupId);
          }
          that.deleteGroups(deletedIds);
        },
        dwOnCancel(): void {
        }
      });
    }
  }

  public deleteGroups(groupIds: string[]): void {
    this.groupService.deleteGroupList({ 'groupIds': groupIds }).subscribe(
      (result) => {
        this.operating = false;
        this.checkedNumber = 0;
        this.searchData(true);
      });
  }

  public deleteOriginItem(item: MasterModel): void {
    const idx = this.dataSet.findIndex((value: MasterModel) => {
      return value.groupId === item.groupId;
    });
    if (idx >= 0) {
      console.log(idx);
      this.dataSet.splice(idx, 1);
    }
  }

  public displayDataChange($event: any): void {
    console.log($event);
    this.dataSet = $event;
  }

  public refreshStatus(): void {
    const allChecked = this.dataSet.every(value => value.checked === true);
    const allUnChecked = this.dataSet.every(value => !value.checked);
    this.allChecked = allChecked;
    this.indeterminate = (!allChecked) && (!allUnChecked);
    this.disabledButton = !this.dataSet.some(value => value.checked);
    this.checkedNumber = this.dataSet.filter(value => value.checked).length;
    this.checkedDescription = '已選擇  ' + this.checkedNumber + ' 項 ';
  }

  public checkAll(value: any): void {
    if (value) {
      this.dataSet.forEach(data => data.checked = true);
    } else {
      this.dataSet.forEach(data => data.checked = false);
    }
    this.refreshStatus();
  }

  public showConfirm = (item: MasterModel): void => {
    const that = this;
    this.dwModalService.confirm({
      dwIconType: 'close-circle',
      dwTitle: '刪除此筆資料會將會一併刪除子項目，確定刪除?',
      // content: '<b>一些解释</b>',
      dwOnOk(): void {
        // that.deleteOriginItem(item);
        that.deleteGroups([item.groupId]);
        that.searchData(true);
      },
      dwOnCancel(): void {
      }
    });
  }

  onInit(): void {
    this.searchForm = this.fb.group({});
    this.searchForm.addControl('groupId', new FormControl(this.search.fields.groupId));
    this.searchForm.addControl('groupName', new FormControl(this.search.fields.groupName));
    this.searchForm.addControl('currencyId', new FormControl(this.search.fields.currencyId));
    this.searchForm.addControl('currencyName', new FormControl(this.search.fields.currencyName));
    this.searchForm.addControl('sourceId', new FormControl(this.search.fields.sourceId));
    this.searchForm.addControl('status', new FormControl(this.search.fields.status));
    this.searchStatusOptions = StatusModel.getList(); // 狀態碼列舉初始化
    this.searchForm.get('status').valueChanges.subscribe((val) => {
      this.search.fields.status = val;
    });
    this.init.emit();

  }


  onBeforeSearch(): void {
    this.searchLoading = true;
    this.beforeSearch.emit();
  }


  onAfterSearch(): void {
    this.searchLoading = false;
    this.afterSearch.emit();
  }

  afterViewInit(): void {
    // 是否已存在查詢條件
    if (this.search.pageIndex) {
      this.searchData(false); // 查詢資料
    } else {
      this.searchData(true); // 查詢資料
    }
  }


  afterContentInit(): void {
  }

  onDestroy(): void {
    // console.log('list onDestroy');
    if (this.tabEventSubscription) {
      this.tabEventSubscription.unsubscribe();
    }
  }

}
