import { Injectable } from '@angular/core';
import { IDemo1GroupSearchField, IDemo1GroupSortSet } from '../../repository';

/**
 * 查詢條件
 *
 * @class SearchConditionModel
 */

@Injectable()
export class SearchConditionModel {
  private _pageSizeSelectorValues = ['1', '2', '3', '4', '5'];
  private _pageIndex: number;
  private _pageSize: number;
  private _fields: IDemo1GroupSearchField;
  private _sortSet: IDemo1GroupSortSet[];

  constructor() {
    this._pageIndex = 1;
    this._pageSize = 10;
    this._fields = this._initFields();
    this._sortSet = [];
  }
  set pageSizeSelectorValues(value: string[]) {
    this._pageSizeSelectorValues = value;
  }

  get pageSizeSelectorValues(): string[] {
    return this._pageSizeSelectorValues;
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

  set fields(param: IDemo1GroupSearchField) {
    this._fields = param;
  }

  get fields(): IDemo1GroupSearchField {
    return this._fields;
  }

  set sortSet(sort: IDemo1GroupSortSet[]) {
    this._sortSet = sort;
  }

  get sortSet(): IDemo1GroupSortSet[] {
    return this._sortSet;
  }

  _initFields(): IDemo1GroupSearchField {
    return <IDemo1GroupSearchField>{
      groupId: '',
      groupName: '',
      currencyId: '',
      currencyName: '',
      sourceId: '',
      status: ''
    };
  }

  public clear(): IDemo1GroupSearchField {
    return this._initFields();
  }

  public clearSortSet(): void {
    this._sortSet = [];
  }

  public addSortSet(sortSet: IDemo1GroupSortSet): void {
    this._sortSet.push(sortSet);
  }
}
