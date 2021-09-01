import { Injectable } from '@angular/core';
import { IDemo1AsisSearchField, IDemo1AsisSortSet } from '../../repository';

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
  private _fields: IDemo1AsisSearchField;
  private _sortSet: IDemo1AsisSortSet[];

  constructor() {
    this._pageIndex = 1;
    this._pageSize = 1;
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

  set fields(param: IDemo1AsisSearchField) {
    this._fields = param;
  }

  get fields(): IDemo1AsisSearchField {
    return this._fields;
  }

  set sortSet(sort: IDemo1AsisSortSet[]) {
    this._sortSet = sort;
  }

  get sortSet(): IDemo1AsisSortSet[] {
    return this._sortSet;
  }

  _initFields(): IDemo1AsisSearchField {
    return <IDemo1AsisSearchField>{
      asisId: '',
      asisName: '',
      status: ''
    };
  }

  public clear(): IDemo1AsisSearchField {
    return this._initFields();
  }

  public clearSortSet(): void {
    this._sortSet = [];
  }

  public addSortSet(sortSet: IDemo1AsisSortSet): void {
    this._sortSet.push(sortSet);
  }
}
