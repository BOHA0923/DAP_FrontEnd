import {
  AfterContentInit,
  Component,
  ContentChild,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
  ViewChild
} from '@angular/core';

import { tap } from 'rxjs/operators';
import { DwPaginationComponent } from 'ng-quicksilver/pagination';
import { DwQueryInfo } from '@webdpt/framework/document';
import { Observable } from 'rxjs/internal/Observable';
import { AgGridNg2 } from 'ag-grid-angular';

@Component({
  selector: 'dw-pagination-server-side-wrap',
  template: `
    <dw-pagination #pagination
                   [dwTotal]="dwTotal"
                   [dwPageIndex]="dwPageIndex"
                   [dwPageSize]="dwPageSize"
                   [dwShowQuickJumper]="dwShowQuickJumper"
                   [dwShowSizeChanger]="dwShowSizeChanger"
                   [dwSimple]="dwSimple"
                   [dwSize]="dwSize"
                   [dwPageSizeOptions]="dwPageSizeOptions"
                   [dwItemRender]="dwItemRender"
                   [dwShowTotal]="dwShowTotal"
                   [dwHideOnSinglePage]="dwHideOnSinglePage"
                   (dwPageIndexChange)="onDwPageIndexChange($event)"
                   (dwPageSizeChange)="onDwPageSizeChange($event)"
    ></dw-pagination>
    <ng-template #renderItemTemplate let-type let-page="page">
      <a *ngIf="type === 'prev'" class="ant-pagination-item-link">
        <i dw-icon dwType="left"></i>
      </a>
      <a *ngIf="type === 'prev_5'" class="ant-pagination-item-link">
        <i dw-icon dwType="double-left"></i>
      </a>
      <a *ngIf="type === 'next'" class="ant-pagination-item-link">
        <i dw-icon dwType="right"></i>
      </a>
      <a *ngIf="type === 'next_5'" class="ant-pagination-item-link">
        <i dw-icon dwType="double-right"></i>
      </a>
      <a *ngIf="type === 'page'">{{ page }}</a>
    </ng-template>
  `
})
export class DwPaginationServerSideWrapperComponent implements AfterContentInit {
  @ViewChild('pagination') paginationComponent: DwPaginationComponent;
  @Input() dwItemRender: TemplateRef<{ $implicit: 'page' | 'prev' | 'next'| 'prev_5'| 'next_5', page: number }>;

  @Output() dataSourceChange = new EventEmitter();

  @Input() dataSource: {
    getDataList(pageNumber: number, pageSize: number, queryInfo: DwQueryInfo): Observable<any>;
  };
  @Input() queryInfo: DwQueryInfo;
  @Input() agGridComponent: AgGridNg2;
  @Input() rowCount: number = 0;
  @Input() dwTotal = 0;
  @Input() dwPageIndex;
  @Input() dwPageSize = 10;
  @Input() dwShowQuickJumper = false;
  @Input() dwShowSizeChanger = false;
  @Input() dwSimple = undefined;
  @Input() dwSize = '';
  @Input() dwPageSizeOptions = [];
  @Input() dwShowTotal;
  @Input() dwHideOnSinglePage = false;
  @Output() dwPageSizeChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() dwPageIndexChange: EventEmitter<any> = new EventEmitter<any>();

  pageable: boolean = true;

  onDwPageSizeChange(pageSize: number): void {
    if (this.queryInfo.pageable) {
      this.dwPageSize = pageSize;
      this.reSendData();
    }
    this.dwPageSizeChange.emit(pageSize);

  }

  onDwPageIndexChange(pageIndex: number): void {
    if (this.queryInfo.pageable) {
      this.dwPageIndex = pageIndex;
      this.reSendData();
    }
    this.dwPageIndexChange.emit(pageIndex);
  }

  ngAfterContentInit(): void {
    if (this.dataSource) {
      this.reSendData();
    }
  }

  reSendData(): void {

    this.dataSource.getDataList(this.dwPageIndex, this.dwPageSize, this.queryInfo).pipe(
      tap((result) => {
        this.parsePaginationInfo(result);
      })
    ).subscribe(
      (result) => {
        this.dataSourceChange.emit(result);
      }
    );
    this.pageable = this.queryInfo.pageable;

  }

  parsePaginationInfo(result: any): void {
    if (this.paginationComponent && this.pageable) {
      this.dwTotal = result.rowCount;
      this.dwPageIndex = result.currentPage;
      this.dwPageSize = result.pageSize;
    }
  }
}
