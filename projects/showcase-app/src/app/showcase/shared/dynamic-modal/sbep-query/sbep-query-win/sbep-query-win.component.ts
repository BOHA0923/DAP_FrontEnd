import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { GridApi, RowNode } from 'ag-grid-community';
import { DwQueryOrder, DwQueryCondition, DwQueryConditionOperator } from '@webdpt/framework/document';
import { AG_GRID_FW_COMPONENTS } from '@webdpt/components/ag-grid-editors';
import { DwServerPagingDataSource } from '@webdpt/components/modals/select';
import { SbepQueryInfo } from '../model/sbep-query';
import { DwPaginationServerSideWrapperComponent } from '@webdpt/components/paging';

@Component({
  selector: 'app-sbep-query-win',
  templateUrl: './sbep-query-win.component.html',
  styleUrls: ['./sbep-query-win.component.less']
})
export class SbepQueryWinComponent implements OnInit {
  public dataService: DwServerPagingDataSource;
  public pageNumber: number = 1;
  public pageSize: number = 10;
  public dwTotal: number;
  public columnDefs: Array<any> = [];
  public rowSelection: string = 'single'; // 預設是單選.
  public queryInfo: SbepQueryInfo = new SbepQueryInfo();
  public frameworkComponents: any;
  public gridApi: GridApi;
  public rowData: any;

  private _preSelected: Array<any> = []; // 預選值.
  private _selected: Array<any> = []; // 將預選值轉成已選取
  private _idField: string;
  private _nameField: string;

  @ViewChild('pagination') pagination: DwPaginationServerSideWrapperComponent;

  constructor() {
    this.frameworkComponents = AG_GRID_FW_COMPONENTS;
  }

  // @Input - grid 定義檔.
  @Input()
  set gridDefs(params: any) {
    if (params.multiSelect === true) {
      this.rowSelection = 'multiple';
    }
  }

  // @Input - 預選值.
  @Input()
  set selected(params: Array<any>) {
    if (params.length === 0) {
      return;
    }

    // 當有預選值時, 這樣可以深層 copy, 且可以得到一個新的 object.
    params.forEach(ele => {
      this._preSelected.push(JSON.stringify(ele));
    });
  }

  // @Input - 資料淶源.
  @Input()
  set dataSource(params: any) {
    this.dataService = params;
  }

  ngOnInit(): void {
  }

  /**
   * 當grid 初始化完成時.
   *
   * param {*} params, {api: GridApi, columnApi: ColumnApi, type: gridReady}.
   */
  public onGridReady(params: any): void {
    this.gridApi = params.api;
  }

  /**
   * 當filter 事件觸發時.
   *
   * param {*} params, {api: GridApi, columnApi: ColumnApi, type: filterChanged}.
   */
  public onFilterChanged(params: any): void {
    const gridApi = params.api;
    const filterModel = gridApi.getFilterModel();

    // 當從有條件變成沒有條件時, 原則上需要重送, 但是 condition 為空.
    if (Object.keys(filterModel).length === 0) {
      this.queryInfo.setCondition(null);
      this.pagination.reSendData();
      return;
    }

    const searchCondition = new DwQueryCondition();
    for (const key in filterModel) {
      if (filterModel[key].hasOwnProperty('operator')) {
        const conditions = this._getConditionMulti(key, filterModel[key]);
        searchCondition.addCondition(conditions);
      } else {
        let conditions = new DwQueryCondition(DwQueryConditionOperator.AND);

        conditions = this._getCondition(conditions, key, filterModel[key]);

        searchCondition.addCondition(conditions);
      }
    }

    this.queryInfo.setCondition(searchCondition);

    this.pagination.reSendData();
  }

  /**
   * 單一條件的 queryInfo.
   *
   * param {DwQueryCondition} conditions.
   * param {string} key: 欄位名稱.
   * param {*} value: 搜尋字串.
   * returns {DwQueryCondition}
   */
  private _getCondition(conditions: DwQueryCondition, key: string, value: any): DwQueryCondition {
    // Date Filter 的 Model 需要轉換.
    if (value.filterType === 'date') {
      value.filter = value.dateFrom;
      value.filterTo = value.dateTo;
    }

    if (value.type === 'contains') {
      conditions.addCondition({name: key, value: '%' + value.filter + '%', operator: DwQueryConditionOperator.LIKE});
    } else if (value.type === 'equals') {
      conditions.addCondition({name: key, value: value.filter, operator: DwQueryConditionOperator.EQUAL});
    } else if (value.type === 'notEqual') {
      conditions.addCondition({name: key, value: value.filter, operator: DwQueryConditionOperator.NOTEQUALS});
    } else if (value.type === 'startsWith') {
      conditions.addCondition({name: key, value: value.filter + '%', operator: DwQueryConditionOperator.LIKE});
    } else if (value.type === 'endsWith') {
      conditions.addCondition({name: key, value: '%' + value.filter, operator: DwQueryConditionOperator.LIKE});
    } else if (value.type === 'lessThan') {
      conditions.addCondition({name: key, value: value.filter, operator: DwQueryConditionOperator.LESSTHAN});
    } else if (value.type === 'lessThanOrEqual') {
      conditions.addCondition({name: key, value: value.filter, operator: DwQueryConditionOperator.LESSTHANOREQUALTO});
    } else if (value.type === 'greaterThan') {
      conditions.addCondition({name: key, value: value.filter, operator: DwQueryConditionOperator.GREATERTHAN});
    } else if (value.type === 'greaterThanOrEqual') {
      conditions.addCondition({name: key, value: value.filter, operator: DwQueryConditionOperator.GREATERTHANOREQUALTO});
    } else if (value.type === 'inRange') {
      conditions.addCondition({name: key, values: [value.filter, value.filterTo], operator: DwQueryConditionOperator.BETWEEN});
    } else {
      conditions.addCondition({name: key, value: '%' + value.filter + '%', operator: DwQueryConditionOperator.LIKE});
    }

    return conditions;
  }

  /**
   * 複合條件(2個條件)的 queryInfo.
   *
   * param {string} key: 欄位名稱.
   * param {*} value: 搜尋字串.
   * returns {DwQueryCondition}
   */
  private _getConditionMulti(key: string, value: any): DwQueryCondition {
    let conditions = new DwQueryCondition(value.operator);

    conditions = this._getCondition(conditions, key, value.condition1);
    conditions = this._getCondition(conditions, key, value.condition2);

    return conditions;
  }

  /**
   * 當 sort 事件觸發時.
   *
   * param {*} params, {api: GridApi, columnApi: ColumnApi, type: sortChanged}.
   */
  public onSortChanged(params: any): void {
    const gridApi = params.api;
    const sortModel = gridApi.getSortModel();

    // 當沒有排序欄位時, 原則上是不動, 如果有其他需求, 再調整.
    if (sortModel.length === 0) {
      return;
    }

    // 目前預設是會累加排序欄位, 因為只提供一個欄位排序, 先手動清除.
    this.queryInfo.clearOrderField();

    this.queryInfo.addOrderField(new DwQueryOrder(sortModel[0].colId, sortModel[0].sort));

    this.pagination.reSendData();
  }

  /**
   * 向後端取完資料.
   *
   * param {*} result
   */
  public onDataSourceChange(result: any): void {
    const data = result.data;
    this._createColumnDefs(data.fields);

    if (data.hasOwnProperty('keyInfo') && data.keyInfo.length === 1) {
      this._idField = data.keyInfo[0]['value_field'];
      this._nameField = data.keyInfo[0]['display_field'];
    }

    // 後端會將當前的分頁資訊回傳，作業可於此處取得相關資訊以利後續作業的應用。
    this.pageNumber = result.currentPage;
    this.pageSize = result.pageSize;
    this.gridApi.setRowData(data.rows);

    // 本頁選取狀態初始化.
    this._initSelected();
  }

  /**
   * 創建 grid 的欄位定義.
   *
   * param {Array<any>} fields
   * returns {void}
   */
  private _createColumnDefs(fields: Array<any>): void {
    if (this.columnDefs.length > 0) {
      return;
    }

    const columnDefs = [];
    fields.forEach(items => {
      const colDefs = {
        field: items.field_name,
        hide: !items.visible,
        width: items.width,
        headerName: items.caption,
        filterParams: {
          newRowsAction: 'keep'
        }
      };
      if (items.picklist) {
        colDefs['suppressFilter'] = true;
      } else if (items.type === 'Decimal' || items.type === 'Int' || items.type === 'Integer') {
        colDefs['filter'] = 'agNumberColumnFilter';
      } else if (items.type === 'Date') {
        colDefs['filter'] = 'agDateColumnFilter';
      } else {
        colDefs['filter'] = 'agTextColumnFilter';
        colDefs['filterParams']['filterOptions'] = this._getAgTextColumnFilter();
      }

      columnDefs.push(colDefs);
    });

    this.columnDefs = columnDefs;
  }

  /**
   * 取得自定義的 agTextColumnFilter 的操作符.
   *
   * returns {Array<String>}.
   */
  private _getAgTextColumnFilter(): Array<String> {
    return ['equals', 'notEqual', 'contains', 'startsWith', 'endsWith'];
  }

  /**
   * 回傳選取值(_selected: 已選取的, _preSelected: 尚未對應到的預選值).
   *
   * returns {*}
   */
  public getSelectedValue(): any {
    const retValue = [];
    const _preSelected = this._preSelected;

    // 取出已選取的.
    this._selected.forEach(ele => {
      const items = JSON.parse(ele);
      items.dwId = items[this._idField];
      items.dwName = items[this._nameField];
      retValue.push(items);
    });

    // 未對應到的預選值, 也要 return.
    if (_preSelected.length > 0) {
      _preSelected.forEach(ele => {
        const preitems = JSON.parse(ele);
        preitems.dwId = preitems.id;
        preitems.dwName = preitems.name;
        retValue.push(preitems);
      });
    }

    return retValue;
  }

  /**
   * 本頁選取狀態的初始化 - 標示已選取的 rows, 並寫入 this._selected(本頁的預選值).
   *
   * returns {void}
   */
  private _initSelected(): void {
    const _selected = this._selected;

    this.gridApi.forEachNode(((that: any): any => {

      return (node: any): any => {
        // 存在[選取清單 - selected]裡的, 要設定為 Selected.
        if (_selected.length > 0 && _selected.indexOf(JSON.stringify(node.data)) >= 0) {
          node.setSelected(true);
        }

        // 存在[預選清單 - preSelected]裡的, 要設定為 Selected.
        const defSelected = that._doDefaultSelected(node.data);
        if (defSelected !== null) {
          node.setSelected(defSelected);
        }

        // todo: 預留擴充, 未來可以增加其他service的判斷邏輯.
        // ....

      };
    })(this));

  }

  /**
   * 預設的選取狀態判斷規則.
   *
   * param {*} nodeData: row 的一筆資料
   * returns {boolean}: 選取狀態.
   */
  private _doDefaultSelected(nodeData: any): boolean {
    const _selected = this._selected;
    const _preSelected = this._preSelected;
    const _idField = this._idField;
    const _nameField = this._nameField;
    let ret = null;

    if (_preSelected.length === 0) {
      return ret;
    }

    // 1-傳入是正確的 id,  name 時.
    const items = {
      id: nodeData[_idField],
      name: nodeData[_nameField]
    };
    const idx = _preSelected.indexOf(JSON.stringify(items));
    if (idx >= 0) {
      ret = true;
      if (_selected.indexOf(JSON.stringify(nodeData)) < 0) { // 如果沒有新增過, 要新增.
        _selected.push(JSON.stringify(nodeData));
      }
      _preSelected.splice(idx, 1); // 有對應到, 則取出, 刪除.
    }

    // 2-傳入是 id, name 都是 id 時.
    const idItems = {
      id: nodeData[_idField],
      name: nodeData[_idField]
    };

    const idIdx = _preSelected.indexOf(JSON.stringify(idItems));
    if (idIdx >= 0) {
      ret = true;
      if (_selected.indexOf(JSON.stringify(nodeData)) < 0) { // 如果沒有新增過, 要新增.
        _selected.push(JSON.stringify(nodeData));
      }
      _preSelected.splice(idIdx, 1); // 有對應到, 則取出, 刪除.
    }

    return ret;
  }

  /**
   * 當有選取事件觸發時(只操作 _selected).
   *
   */
  public onSelectionChanged(): void {
    // 如果設定是單選, 需將之前的選取清單清除.
    if (this.rowSelection === 'single') {
      this._selected.splice(0, this._selected.length);
      this._preSelected.splice(0, this._preSelected.length);
    }
    const _selected = this._selected;

    this.gridApi.forEachNode(function(node: any): void {
      if (node.selected) {
        if (_selected.indexOf(JSON.stringify(node.data)) < 0) {
          _selected.push(JSON.stringify(node.data));
        }
      } else {
        const idx = _selected.indexOf(JSON.stringify(node.data));
        if (_selected.indexOf(JSON.stringify(node.data)) >= 0) {
          _selected.splice(idx, 1); // 有對應到, 則取出, 刪除.
        }

      }
    });
  }

}

