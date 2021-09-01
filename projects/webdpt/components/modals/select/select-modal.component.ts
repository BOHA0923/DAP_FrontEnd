import { Component, Input, OnDestroy, ElementRef, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { Subscription, fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { DwModalRef } from 'ng-quicksilver/modal';
import { DwMessageService } from 'ng-quicksilver/message';

import { IDwSelectModalTable, ISelectModalDataSourceResponse } from './interface/select-modal.interface';
import { IDwSelectModalDataSource } from './interface/select-modal-datasource.interface';
import { DwClientPagingDataSource } from './interface/abstract-client-paging-dataSource';
import { DwQueryOrder } from '@webdpt/framework/document';

import { DwSelectModalSearchPipe } from './pipe/select-modal-search.pipe';

@Component({
  selector: 'app-select-modal',
  templateUrl: './select-modal.component.html',
  styleUrls: ['./select-modal.component.css']
})
export class DwSelectModalComponent implements OnInit, AfterViewInit, OnDestroy {
  searchText: string = '';
  defs: IDwSelectModalTable; // table 的定義檔.
  datas: Array<any> = []; // table 的資料檔.
  radioModel: any; // [radio 狀態]下 的 ngModel.
  allChecked: boolean = false; // [checkbox 狀態]下 是否全選.
  indeterminate: boolean = false; // [checkbox 狀態] checkbox indeterminate 狀態.
  dwPageSize: number; // 每頁展示多少數據.
  dwTotal: number; // 當前總數據.
  dwPageIndex: number; // 當前頁碼.
  dwLoading: boolean = false; // 頁面是否載入中.
  @ViewChild('searchTextInput') _searchTextInput: ElementRef;


  private _selected: Array<any> = []; // 已經被選取的資料.
  private _displayData: Array<any> = []; // 本頁顯示的資料.
  private _dataSource: IDwSelectModalDataSource; // 串接後端服務的資料型別
  private _pageCount: number; // 總頁數(預留).
  private _orderby: DwQueryOrder = new DwQueryOrder('', ''); // 排序.
  private _allyDatas: Array<any> = []; // 全部的數據.
  private subscription: Subscription = new Subscription(); // 訂閱的 subject.

  constructor(
    private dwModalRef: DwModalRef,
    private dwMessage: DwMessageService,
    private selectModalSearchPipe: DwSelectModalSearchPipe
  ) {

  }

  @Input()
  set tableDefs(params: IDwSelectModalTable) {
    this.defs = Object.assign({}, params); // table 定義檔.
    this.dwPageSize = this.defs.dwPageSize;
    this.dwPageIndex = 1;

    this.defs.colDefs.forEach(
      (val) => {
        val['sortOrder'] = null; // 當前排序狀態
      }
    );
  }

  @Input()
  set selected(params: Array<any>) {
    if (params.length === 0) {
      return;
    }

    // 當有預選值時.
    this._selected = Object.assign([], params);
  }

  @Input()
  set dataSource(params: IDwSelectModalDataSource) {
    this._dataSource = params;
  }

  ngOnInit(): void {
    // 初始化 - 設定 radioModel(不確定@Input()的順序, 所以利用事件分開寫).
    this._setRadioModelValue();

    // 初始化 - 設定分頁狀態(不確定@Input()的順序, 所以利用事件分開寫).
    this.defs.dwFrontPagination = false; // 自訂分頁.
    if (this._dataSource instanceof DwClientPagingDataSource) {
      this.defs.dwFrontPagination = true; // 對數據進行分頁.
    }

    // 初始化 - 第 1 次取值.
    this._getDatas();
  }

  ngAfterViewInit(): void {

    // 對於每次鍵盤敲擊，都將映射成當前輸入值.
    const searchTextObservable: Observable<{}> = fromEvent(this._searchTextInput.nativeElement, 'keyup').pipe(
      map(
        ($evt: KeyboardEvent) => {
          return $evt.currentTarget['value'];
        }
      ));

    // 在兩次鍵盤敲擊之間等待0.5秒方才發出當前值，並丟棄這0.5秒內的所有其他值.
    const debouncedInput: Observable<{}> = searchTextObservable.pipe(debounceTime(500));

    // 輸出值, 因為是綁 keyup, 當按 <shift> 時, 也會觸發, 所以要使用 distinctUntilChanged 過濾.
    // distinctUntilChanged 只有當前值與之前最後一個值不同時才將其發出.
    this.subscription.add(
      debouncedInput.pipe(distinctUntilChanged()).subscribe(
        (val: string) => {
        // 當使用前端分頁時.
        if (this._dataSource instanceof DwClientPagingDataSource) {
          this.searchDatas();
          return;
        }

        this._getDatas();
      })
    );
  }


  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }


  /**
   * 當前頁面展示數據改變的回呼函式
   */
  public currentPageDataChange($event: Array<any>): void {
    if (this.defs.hasOwnProperty('currentPageDataChange') && typeof this.defs.currentPageDataChange === 'function') {
      this.defs.currentPageDataChange($event);
    }

    this._displayData = $event;

    this.refreshStatus();
  }


  /**
   * 當前頁碼改變時的回調函式.
   *
   */
  public pageIndexChange(): void {
    if (this.defs.hasOwnProperty('pageIndexChange') && typeof this.defs.pageIndexChange === 'function') {
      this.defs.pageIndexChange(this.dwPageIndex);
    }

    // 當資料源 DwClientPagingDataSource 時, 表示使用前端分頁.
    if (this._dataSource instanceof DwClientPagingDataSource) {
      return;
    }

    this._getDatas();
  }


  /**
   * 頁數改變時的回調函式.
   *
   */
  public pageSizeChange(): void {
    if (this.defs.hasOwnProperty('pageSizeChange') && typeof this.defs.pageSizeChange === 'function') {
      this.defs.pageSizeChange(this.dwPageSize);
    }

    // 當資料源 DwClientPagingDataSource 時, 表示使用前端分頁.
    if (this._dataSource instanceof DwClientPagingDataSource) {
      return;
    }

    this._getDatas();
  }

  /**
   * 排序狀態改變回調.
   *
   * param {{ key: string, value: string }} sort
   */
  public sortChange(sort: { key: string, value: string }): void {
    // 單一排序
    this.defs.colDefs.forEach(
      (val) => {
        if (val.field !== sort.key) {
          val['sortOrder'] = null; // 當前排序狀態
        }
      }
    );

    let sortValue = '';
    if (sort.value) {
      sortValue = sort.value.replace(/end/, '');
    }

    // 當資料源 DwClientPagingDataSource 時, 表示使用前端分頁(順便前端排序).
    if (this._dataSource instanceof DwClientPagingDataSource) {
      if (sortValue) {
        const datas = Object.assign([], this.datas);
        this.datas = datas.sort(
          (a, b) => {
            return (sortValue === 'asc') ? (a[sort.key] > b[sort.key] ? 1 : -1) : (b[sort.key] > a[sort.key] ? 1 : -1);
          }
        );
      }

      return;
    }

    this._orderby = new DwQueryOrder(sort.key, sortValue);
    this._getDatas();
  }

  /**
   * 確認目前的選取狀態.
   */
  public refreshStatus(): void {
    const allChecked = this._displayData.every(value => value.dwChecked === true);
    const allUnChecked = this._displayData.every(value => !value.dwChecked);
    this.allChecked = allChecked;

    this.indeterminate = (!allChecked) && (!allUnChecked);

    this._currentSelectedValue();
  }


  /**
   * 全部選取 / 全部取消.
   */
  public checkAll(value: boolean): void {
    this._displayData.forEach(data => {
      data.dwChecked = value;
    });
    this.refreshStatus();
  }


  /**
   * 取得本次已選取的 row id.
   *
   * returns {Array<any>}
   */
  public getSelectedValue(): Array<any> {
    let retValue = [];
    // 單選.
    if (!this.defs.multiSelect) {
      if (this.radioModel) {
        retValue = this.datas.filter(value => value.dwValue.toString() === this.radioModel.toString()).map(
          result => {
            return result[this.defs.idField];
          }
        );
      }
    }

    // 多選.
    if (this.defs.multiSelect) {
      // 預選值+選取值, 只取唯一值(多選時, 在選取值已經判斷過了).
      retValue = Object.assign([], this._selected); // 不能直接用 = 賦值.
    }

    return retValue;
  }


  /**
   * tag 關閉時.
   *
   * param {MouseEvent} $e: event.
   * param {*} tags: 單一筆已選取的 row object.
   */
  public onTagClose($e: MouseEvent, row: any): void {
    row.dwChecked = false;
    this.refreshStatus();
  }


  /**
   * 資料源: IDwSelectModalDataSource.
   *
   */
  private _getDatas(): void {
    this.dwLoading = true;
    this.subscription.add(
      this._dataSource.getDataList(
        this.dwPageIndex,
        this.dwPageSize,
        this.searchText,
        this._orderby
      ).subscribe(
        (result: ISelectModalDataSourceResponse) => {
          this.dwLoading = false;
          this.datas = result.datas;
          this._allyDatas = result.datas;
          this._setPagination(result);
          this._setOptionsValue();
          this._checkDataMapping();
        },
        (error) => {
          this.dwModalRef.triggerCancel();
          this.dwMessage.error('取值錯誤');
        }
      )
    );
  }


  /**
   * 資料源: 接後端時 - 設定分頁資料.
   *
   */
  private _setPagination(datas: any): void {
    this.dwPageIndex = datas.currentPage;
    this._pageCount = datas.pageCount;
    this.dwPageSize = datas.pageSize;
    this.dwTotal = datas.rowCount;
  }


  /**
   * 初始化 - 設定選取值.
   *
   */
  private _setRadioModelValue(): void {
    // 單選才需以下的設定 - 單選 ngModel 是指定選中的 dw-radio 的 dwValue 值, 只允許 string.
    if (this.defs.multiSelect || this._selected.length === 0) {
      return;
    }

    if (this._selected[0] === null || this._selected[0] === undefined) {
      this.radioModel = this._selected[0];
      return;
    }

    if (typeof this._selected[0] === 'object') {
      if (this._selected[0].hasOwnProperty(this.defs.idField)) {
        this.radioModel = this._selected[0][this.defs.idField].toString();
      } else {
        this.radioModel = null;
      }
    } else {
      this.radioModel = this._selected[0].toString();
    }
  }


  /**
   * 多選狀態下, 動態調整 this._selected 的清單.
   *
   */
  private _currentSelectedValue(): void {

    if (this.datas.length === 0) {
      return;
    }

    // 有被選取時, 如果不存在 this._selected裡, 要加入.
    this.datas.filter(value => value.dwChecked === true).map(
      ret => {
        const checkId = ret[this.defs.idField];
        const idx = this._selected.indexOf(checkId);
        if (idx === -1) {
          this._selected.push(checkId);
        }
      }
    );

    // 沒有被選取時, 如果已經存在 this._selected裡, 要刪除.
    this.datas.filter(value => !value.dwChecked).map(
      ret => {
        const checkId = ret[this.defs.idField];
        const idx = this._selected.indexOf(checkId);
        if (idx >= 0) {
          this._selected.splice(idx, 1);
        }
      }
    );
  }

  /**
   * 設定清單選項的 value.
   *
   */
  private _setOptionsValue(): void {
    // 多選需要 dwChecked 屬性與值(boolean).
    if (this.defs.multiSelect) {
      this.datas.forEach(value => {
        value.dwChecked = this._isChecked(value); // 初始化-增加 dw-table 的 td 的 dwChecked.
      });
    }

    // 單選需要 dwValue 屬性與值(string).
    if (!this.defs.multiSelect) {
      this.datas.forEach(value => {
        // TODO: TypeError: Cannot read property 'toString' of undefined
        value.dwValue = value[this.defs.idField].toString(); // 初始化-增加 dw-radio 的 dwValue.
      });
    }
  }


  /**
   * 確認 row object 是否為已選取(有已選取值時才跑).
   *
   * param rows: 單一筆已選取的 row object.
   * returns {boolean}
   */
  private _isChecked(rows: any): boolean {
    if (this._selected.length === 0) {
      return false;
    }

    // 找不到時，會是 undefined
    const ret = this._selected.find(item => {
      if (item === null || item === undefined) {
        return;
      }

      if (typeof item === 'object') {
        return item[this.defs.idField] ===  rows[this.defs.idField];
      } else {
        return item.toString() ===  rows[this.defs.idField].toString();
      }
    });

    if (ret !== undefined) {
      return true;
    }

    return false;
  }

  /**
   * 驗證 defs.colDefs 的 filed 是否與 this.datas 的 keyname 有對應.
   *
   */
  private _checkDataMapping(): void {
    if (!this.hasOwnProperty('datas') || this.datas.length === 0) {
      console.warn('datas is undefined');
      return;
    }

    if (!this.defs.hasOwnProperty('colDefs') || this.defs.colDefs.length === 0) {
      console.error('colDefs is undefined');
    }

    const arrDatas = Object.keys(this.datas[0]);

    const arrColDefs: Array<string> = [];
    this.defs.colDefs.forEach(
      (val) => {
        arrColDefs.push(val.field);
      }
    );

    arrColDefs.forEach(
      (filed) => {
        if (arrDatas.indexOf(filed) === -1) {
          console.error(`${filed} is not exist`);
        }
      }
    );
  }


  /**
   * 開窗採用前端分頁，頁面過濾數據希望過濾全部數據目前是過濾當前頁.
   *
   */
  private searchDatas(): void {
    this.datas = this.selectModalSearchPipe.transform(this._allyDatas, this.searchText);
    setTimeout(() => {
      this.dwPageIndex = 1;
    }, 0);
  }


  /**
   * 取得 pipe 的類型, 決定使用的樣版.
   *
   */
  getPipeType(dataPie: any): string {
    if (dataPie.indexOf('keyvalue') >= 0) {
      return 'keyvalue';
    }

    if (dataPie.indexOf('custom') >= 0) {
      return 'custom';
    }

    return '';
  }

}
