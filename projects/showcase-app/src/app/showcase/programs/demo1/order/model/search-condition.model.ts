import { Injectable } from '@angular/core';
import { IDemo1OrderSearchField, IDemo1OrderSortSet } from '../../repository';

/**
 * 查詢條件
 *
 * @class OrderSearchConditionModel
 */

@Injectable()
export class OrderSearchConditionModel {
  private _pageIndex: number;
  private _pageSize: number;
  private _fields: IDemo1OrderSearchField;
  private _sortSet: IDemo1OrderSortSet[];

  constructor() {
    this._pageIndex = 1;
    this._pageSize = 10;
    this._fields = this._initFields();
    this._sortSet = [];
  }

  set pageIndex(idx: number) {
    this._pageIndex = idx;
  }

  get pageIndex(): number {
    return this._pageIndex;
  }

  set pageSize(size: number) {
    this._pageSize = size;
  }

  get pageSize(): number {
    return this._pageSize;
  }

  set fields(param: IDemo1OrderSearchField) {
    this._fields = param;
  }

  get fields(): IDemo1OrderSearchField {
    return this._fields;
  }

  set sortSet(sort: IDemo1OrderSortSet[]) {
    this._sortSet = sort;
  }

  get sortSet(): IDemo1OrderSortSet[] {
    return this._sortSet;
  }

  _initFields(): IDemo1OrderSearchField {
    return <IDemo1OrderSearchField>{
      orderId: '',
      status: [],
      total: '',
      customerName: '',
      salesmanName: '',
      gender: []
    };
  }

  public clear(): IDemo1OrderSearchField {
    return this._initFields();
  }

  public clearSortSet(): void {
    this._sortSet = [];
  }

  public addSortSet(sortSet: IDemo1OrderSortSet): void {
    this._sortSet.push(sortSet);
  }
}
