import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { DwDocument, DwQueryInfo, DwQueryCondition, DwDataRow, DwQueryConditionInfo, DwQueryConditionOperator } from '@webdpt/framework/document';
import { DocumentOrderEnumModel } from '../model';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-dw-document-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css'],
  providers: [
    DwDocument
  ]
})
export class DocumentOrderListComponent implements OnInit {

  // 進階查詢開合 true:關閉, false:打開
  public isCollapse = true;
  // 是否顯示查詢載入中
  public searchLoading = true;

  // 員工性別枚舉
  public genderList = DocumentOrderEnumModel.gender;

  // 訂單狀態枚舉
  public statusList = DocumentOrderEnumModel.orderStatus;
  public searchForm: FormGroup;
  public conditionField: { [key: string]: DwQueryConditionInfo } = {};

  // 查詢列表
  public rowCount = 0; // 總筆數
  public dataSet = []; // 查詢列表資料

  public queryInfo: DwQueryInfo = new DwQueryInfo();

  constructor(
    protected router: Router,
    protected _route: ActivatedRoute,
    protected fb: FormBuilder,
    public doc: DwDocument) {

    this.searchForm = this.fb.group({});
    this.searchForm.addControl('orderid', new FormControl(''));
    this.searchForm.addControl('status', new FormControl([]));
    this.searchForm.addControl('totalcount', new FormControl(''));
    this.searchForm.addControl('customerid', new FormControl(''));
    this.searchForm.addControl('employeename', new FormControl(''));
    this.searchForm.addControl('gender', new FormControl([]));

    // this.searchData(true);
  }

  ngOnInit(): void {
    this.searchData(true);
  }

  /**
   * 查詢資料
   *
   * @param [reset=false] 是否重新指定當前頁碼為第一頁
   * @memberof DocumentOrderComponent
   */
  public searchData(reset: boolean = false): void {

    this.onBeforeSearch();

    if (reset) { // 是否重新指定當前頁碼為第一頁
      this.queryInfo.pageNumber = 1;
    }

    // this.conditionField['orderid'] = new DwQueryConditionInfo('orderid', this.searchForm.get('orderid').value, 'EQUAL');
    // this.conditionField['status'] = new DwQueryConditionInfo('status', '', 'EQUAL');
    // this.conditionField['total'] = new DwQueryConditionInfo('total', '', 'EQUAL');
    // this.conditionField['customerName'] = new DwQueryConditionInfo('customerName', '', 'EQUAL');
    // this.conditionField['salesmanName'] = new DwQueryConditionInfo('salesmanName', '', 'EQUAL');
    // this.conditionField['gender'] = new DwQueryConditionInfo('gender', '', 'EQUAL');

    const searchCondition = new DwQueryCondition();

    for (const key of Object.keys(this.searchForm.controls)) {
      if (Array.isArray(this.searchForm.controls[key].value) && this.searchForm.controls[key].value.length === 0) {
        continue;
      }
      if (this.searchForm.controls[key].value === '' || this.searchForm.controls[key].value === undefined) {
        continue;
      }

      if (Array.isArray(this.searchForm.controls[key].value)) {
        searchCondition.addCondition(new DwQueryConditionInfo(key, this.searchForm.controls[key].value, DwQueryConditionOperator.IN));
      } else {
        searchCondition.addCondition(new DwQueryConditionInfo(key, this.searchForm.controls[key].value, DwQueryConditionOperator.EQUAL));
      }
    }

    this.queryInfo.setCondition(searchCondition);

    this.doc.list(this.queryInfo.getRawValue()).subscribe(response => {
      this.rowCount = response.rowCount;
      this.dataSet = response.data.demo_order;
      this.onAfterSearch();
    });

  }

  /**
   * 清除
   *
   * @memberof DocumentOrderComponent
   */
  public resetForm(): void {
    // 查詢條件欄位初始化
    this.searchForm.reset({
      orderid: '',
      status: [],
      totalcount: '',
      customerid: '',
      employeename: '',
      gender: []
    });
    this.queryInfo.clear();
  }

  /**
   * 每頁筆數改變
   *
   * @memberof DocumentOrderComponent
   */
  public onPageSizeChange(): void {
    this.searchData(true);
  }

  /**
   * 當前頁碼改變
   *
   * @param pageIndex 當前頁碼
   * @memberof DocumentOrderComponent
   */
  public onPageIndexChange(pageIndex: number): void {
    this.queryInfo.pageNumber = pageIndex;
    this.searchData(false);
  }

  public create(): void {
    const navigationExtras: NavigationExtras = {
      relativeTo: this._route // 相對路徑導頁
    };

    this.router.navigate(['../dw-document-order-create'], navigationExtras);
  }

  public modify(orderId: string): void {
    const navigationExtras: NavigationExtras = {
      relativeTo: this._route, // 相對路徑導頁
      queryParams: { 'orderId': orderId }
    };

    this.router.navigate(['../dw-document-order-modify'], navigationExtras);
  }

  public detail(orderId: string): void {
    const navigationExtras: NavigationExtras = {
      relativeTo: this._route, // 相對路徑導頁
      queryParams: { 'orderId': orderId }
    };

    this.router.navigate(['../dw-document-order-detail'], navigationExtras);
  }

  public delete(index: number): void {
    const order = this.dataSet[index];
    const delRow = new DwDataRow(order);
    delRow.markAsDelete();

    this.doc.delete([delRow.getRawValue()]).subscribe(result => {
      console.log(result);
      // this.dataSet.splice(index, 1);

      // 刪除後, 應該要重取清單
      this.searchData(false);
    });
  }

  onBeforeSearch(): void {
    this.searchLoading = true;
  }

  onAfterSearch(): void {
    this.searchLoading = false;

    // 情境, 總筆數21筆, 20筆/1頁, 當在第2頁,刪除唯一的1筆時, 如果停留在第2頁會看不到資料, 手動發動回到第1頁
    if (this.rowCount > 0 && this.dataSet.length === 0) {
      this.searchData(true);
    }
  }

}
