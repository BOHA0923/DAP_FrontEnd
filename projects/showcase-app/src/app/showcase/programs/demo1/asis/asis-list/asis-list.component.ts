import { Component, EventEmitter, forwardRef, Inject, Input, Optional, Output, SkipSelf } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { MasterModel, SearchConditionModel, StatusModel } from '../model';
import { AsisService } from '../service/asis.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { DW_USING_TAB } from '@webdpt/framework/config';
import { DwComponent } from '@webdpt/components/redevelop';
import { DwTabRoutingService } from '@webdpt/framework/routing-tabset';
import { DwModalService } from 'ng-quicksilver/modal';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-dw-asis-list',
  templateUrl: './asis-list.component.html',
  styleUrls: ['../asis.component.css', './asis-list.component.css'],
  providers: [
    {provide: DwComponent, useExisting: forwardRef(() => AsisListComponent)}
  ]
})
export class AsisListComponent extends DwComponent {

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
    asisId: null,
  };

  @Output() beforeSearch = new EventEmitter();
  @Output() afterSearch = new EventEmitter();
  @Output() init = new EventEmitter();
  @Output() pageIndexChange = new EventEmitter();
  @Output() pageSizeChange = new EventEmitter();

  public search: SearchConditionModel = new SearchConditionModel();

  constructor(
    protected router: Router,
    protected fb: FormBuilder,
    protected _route: ActivatedRoute,
    protected asisService: AsisService,
    private dwModalService: DwModalService,
    private tabRoutingService: DwTabRoutingService,
    @Inject(DW_USING_TAB) private _usingTab: boolean,
    @SkipSelf() @Optional() _parentDwComponent: DwComponent) {
    super(_parentDwComponent);
    // this.search.pageSize = 1;
    // 初始化表單欄位

  }

  /**
   * 排序
   *
   * @param sortName
   * @param sortExpression
   * @memberof AsisComponent
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
   * @memberof AsisComponent
   */
  public searchData(reset: boolean = false): void {

    this.onBeforeSearch();

    if (reset) { // 是否重新指定當前頁碼為第一頁
      this.search.pageIndex = 1;
    }

    this.asisService.getAsisList(this.search.pageIndex, this.search.pageSize, this.searchForm.value, this.search.sortSet).subscribe(
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
   * @memberof AsisComponent
   */
  public resetForm(): void {
    // 查詢條件欄位初始化
    this.searchForm.reset(this.search.clear());
  }


  /**
   * 每頁筆數改變
   *
   * @memberof AsisComponent
   */
  public onPageSizeChange(): void {
    this.searchData(true);
    this.pageSizeChange.emit();
  }

  /**
   * 當前頁碼改變
   *
   * @param  pageIndex 當前頁碼
   * @memberof AsisComponent
   */
  public onPageIndexChange(pageIndex: number): void {
    console.log(pageIndex);
    this.search.pageIndex = pageIndex;
    this.pageIndexChange.emit();
    this.searchData(false);
  }

  // view的頁籤編號，用來導覽至同一個view頁籤
  viewTabId: string;
  public view(asisId: string): void {
    const navigationExtras: NavigationExtras = {
      relativeTo: this._route, // 相對路徑導頁
      queryParams: {'asisId': asisId}
    };

    if (this._usingTab) {
      this.viewTabId = this.tabRoutingService.navigateOrCreate(
        ['../dw-asis-view'],
        navigationExtras,
        this.viewTabId);
    } else {
      this.router.navigate(['../dw-asis-view'], navigationExtras);
    }
  }

  public addDataModal(): void {
    const navigationExtras: NavigationExtras = {
      relativeTo: this._route // 相對路徑導頁
    };

    if (this._usingTab) {
      this.viewTabId = this.tabRoutingService.navigateOrCreate(
        ['../dw-asis-add'],
        navigationExtras,
        this.viewTabId);
    } else {
      this.router.navigate(['../dw-asis-add'], navigationExtras);
    }
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
            deletedIds.push(items[i].asisId);
          }
          that.deleteAsiss(deletedIds);
        },
        dwOnCancel(): void {
        }
      });
    }
  }

  public deleteAsiss(asisIds: string[]): void {
    this.asisService.deleteAsisList({'asisIds': asisIds}).subscribe(
      (result) => {
        this.operating = false;
        this.checkedNumber = 0;
        this.searchData(true);
      });
  }

  public deleteOriginItem(item: MasterModel): void {
    const idx = this.dataSet.findIndex((value: MasterModel) => {
      return value.asisId === item.asisId;
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
        that.deleteAsiss([item.asisId]);
        that.searchData(true);
      },
      dwOnCancel(): void {
      }
    });
  }

  onInit(): void {
    this.searchForm = this.fb.group({});
    this.searchForm.addControl('asisId', new FormControl(this.search.fields.asisId));
    this.searchForm.addControl('asisName', new FormControl(this.search.fields.asisName));
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
    this.allChecked = false; // 回復 checkbox indeterminate 狀態
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
  }

}
