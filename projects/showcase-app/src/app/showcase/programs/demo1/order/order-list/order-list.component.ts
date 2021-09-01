import { Component, EventEmitter, forwardRef, Input, Optional, Output, SkipSelf } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';

import { DwComponent } from '@webdpt/components/redevelop';
import { OrderGenderModel, OrderSearchConditionModel, OrderStatusModel } from '../model';
import { OrderService } from '../service/order.service';
import { CustomerListComponent } from '../modals/customer.list/customer-list.component';
import { EmployeeListComponent } from '../modals/employee.list/employee-list.component';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-dw-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['../order.component.css', './order-list.component.css'],
  providers: [
    { provide: DwComponent, useExisting: forwardRef(() => OrderListComponent) }
  ]
})
export class OrderListComponent extends DwComponent {

  public searchStatusOptions: OrderStatusModel[]; // 狀態碼列舉

  // 查詢列表
  public rowCount = 0; // 總筆數
  public dataSet = []; // 查詢列表資料
  public genders: OrderGenderModel[]; // 篩選業務員性別列舉
  searchForm: FormGroup;
  // 客戶名稱開窗設定
  @Input() public customerModalOptions: any;
  // 業務員名稱開窗設定
  @Input() public salesModalOptions: any;
  // 進階查詢開合 true:關閉, false:打開
  @Input() isCollapse = true;
  // 是否查詢載入中
  @Input() searchLoading = true;
  // 排序欄位方式 for UI
  @Input() sortMap = { total: null, salesmanName: null };
  @Output() beforeSearch = new EventEmitter();
  @Output() afterSearch = new EventEmitter();
  @Output() init = new EventEmitter();
  @Output() pageIndexChange = new EventEmitter();
  @Output() pageSizeChange = new EventEmitter();

  public search: OrderSearchConditionModel = new OrderSearchConditionModel();

  constructor(
    protected router: Router,
    protected fb: FormBuilder,
    protected _route: ActivatedRoute,
    protected orderService: OrderService,
    @SkipSelf() @Optional() pc: DwComponent
  ) {
    super(pc);
    // performance.mark('OrderListComponent create ~ after view init');
  }

  /*----------- 排序-0.7 ---------- */
  genderList = [
    { text: '男', value: 'male' },
    { text: '女', value: 'female' }
  ];

  ExFilter(value: string[]): void {
    this.ExSearch(value);
  }

  ExSearch(value: string[]): void {
    this.dataSet = this.dataSet.filter((item) => {
      return value[0] === item.gender;
    });
  }
  /*----------- 排序-0.7 ---------- */

  /**
   * 排序
   *
   * @param  sortName
   * @param  sortExpression
   * @memberof OrderComponent
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

  public filterGender(resetPageIndex: boolean): void {
    this.search.fields.gender = [];
    this.genders.forEach((gender) => {
      if (gender.checked) {
        this.search.fields.gender.push(gender.value);
      }
    });
    this.searchData(resetPageIndex);
  }

  /**
   * 查詢資料
   *
   * @param  [reset=false] 是否重新指定當前頁碼為第一頁
   * @memberof OrderComponent
   */
  public searchData(reset: boolean = false): void {

    this.onBeforeSearch();

    if (reset) { // 是否重新指定當前頁碼為第一頁
      this.search.pageIndex = 1;
    }


    // 篩選業務員性別
    this.search.fields.gender = this.genders
      .filter(item => item.checked)
      .map(item => item.value);
    //
    // this.searchForm.patchValue({
    //   gender: this.search.fields.gender
    // });

    this.orderService.getOrderList(this.search.pageIndex, this.search.pageSize, this.searchForm.value, this.search.sortSet).subscribe(
      (response: any) => {

        this.rowCount = response.rowCount; // 總筆數
        this.dataSet = response.datas || []; // 資料

        this.onAfterSearch();
      }
    );
  }

  /**
   * 清除篩選業務員性別
   *
   * @memberof OrderComponent
   */
  public resetFilterGender(): void {
    OrderGenderModel.resetList(this.genders);
    this.searchData(true);
  }

  /**
   * 清除
   *
   * @memberof OrderComponent
   */
  public resetForm(): void {
    // 查詢條件欄位初始化
    this.searchForm.reset(this.search.clear());
  }


  /**
   * 每頁筆數改變
   *
   * @memberof OrderComponent
   */
  public onPageSizeChange(): void {
    this.searchData(true);
    this.pageSizeChange.emit();
  }

  /**
   * 當前頁碼改變
   *
   * @param  pageIndex 當前頁碼
   * @memberof OrderComponent
   */
  public onPageIndexChange(pageIndex: number): void {
    this.search.pageIndex = pageIndex;
    this.pageIndexChange.emit();
    this.searchData(false);
  }

  public modify(orderId: string): void {
    const navigationExtras: NavigationExtras = {
      relativeTo: this._route, // 相對路徑導頁
      queryParams: { 'orderId': orderId }
    };

    this.router.navigate(['../dw-order-modify'], navigationExtras);
  }

  onInit(): void {
    this.searchForm = this.fb.group({});
    this.searchForm.addControl('orderId', new FormControl(this.search.fields.orderId));
    this.searchForm.addControl('status', new FormControl(this.search.fields.status));
    this.searchForm.addControl('total', new FormControl(this.search.fields.total));
    this.searchForm.addControl('customerName', new FormControl(this.search.fields.customerName));
    this.searchForm.addControl('salesmanName', new FormControl(this.search.fields.salesmanName));
    this.searchForm.addControl('gender', new FormControl(this.search.fields.gender));

    OrderStatusModel.getList().subscribe(
      (result) => {
        this.searchStatusOptions = result;
      }
    ); // 狀態碼列舉初始化

    // 篩選業務員性別列舉初始化
    OrderGenderModel.getList().subscribe(
      (list: OrderGenderModel[]) => this.genders = list
    );

    // 初始化客戶開窗
    this.customerModalOptions = {
      title: '選擇客戶',
      content: CustomerListComponent,
      onOk: (result: any): void => {
        this.searchForm.patchValue({ customerName: result });
      },
      footer: false
    };

    // 初始化業務員開窗
    this.salesModalOptions = {
      title: '選擇業務員',
      content: EmployeeListComponent,
      onOk: (result: any): void => {
        console.log(result);
        this.searchForm.patchValue({ salesmanName: result });
      },
      footer: false
    };

    this.searchForm.get('gender').valueChanges.subscribe((selectedGenders) => {
      OrderGenderModel.resetList(this.genders);
      OrderGenderModel.setChecked(this.genders, selectedGenders);
    });

    this.init.emit();

    // 是否已存在查詢條件
    if (this.search.pageIndex) {

      const genderLen = this.search.fields.gender.length;
      if (genderLen > 0) {
        this.genders.forEach(item => {
          item.checked = false;
          for (let i = 0; i < genderLen; i++) {
            if (item.value === this.search.fields.gender[i]) {
              item.checked = true;
            }
          }
        });
      }

      this.searchData(false); // 查詢資料
    } else {
      this.searchData(true); // 查詢資料
    }
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
    // performance.measure('OrderListComponent create ~ after view init');

  }


  afterContentInit(): void {

  }

  onDestroy(): void { }

  /**
   * 功能權限應用函式
   *
   * @description 在此可以加上應用邏輯，再回傳功能權限最終結果restrictionResult
   * @template [dwActionAuthorizedCallback]="actionAuthorizedCallback"
   * @param restriction 功能權限：allow 允許, hidden 隱藏, disabled 禁用
   * @param authorizedId 作業權限ID
   * @param actionId 功能按鈕ID
   * @returns restrictionResult 功能權限最終結果
   */
  actionAuthorizedCallback(restriction: string, authorizedId: string, actionId: string): Observable<string> {
    return Observable.create(
      (observe: any) => {
        let restrictionResult = restriction;

        if (restrictionResult !== 'allow') {
          // restrictionResult = 'disabled';
          restrictionResult = restriction;
          observe.next(restrictionResult);
          observe.complete();
        } else {
          observe.next(restrictionResult);
          observe.complete();
        }
      }
    );
  }
}
