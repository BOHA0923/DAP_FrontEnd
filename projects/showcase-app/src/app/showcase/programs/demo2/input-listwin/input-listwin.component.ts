import { Component, OnInit } from '@angular/core';

import { DemoOrderServerPagingService } from '../../../shared/select-modal/demo-order/demo-order-server-paging.service';
import { MockDataClientPagingService } from '../../../shared/select-modal/mock-data/mock-data-client-paging.service';
import { EnumClientPagingService } from '../../../shared/select-modal/enum/enum-client-paging.service';



@Component({
  selector: 'app-input-listwin',
  templateUrl: './input-listwin.component.html',
  styleUrls: ['./input-listwin.component.css']
})
export class InputListwinComponent implements OnInit {
  demoOrder = [];
  mockData = [];
  enumData = [];

  constructor(
    private demoOrderServerPagingService: DemoOrderServerPagingService,
    private mockDataClientPagingService: MockDataClientPagingService,
    private enumClientPagingService: EnumClientPagingService
  ) {
  }


  // 多選 - [接後端 - 服務控制分頁].
  public openDemoOrderWin($event: MouseEvent): void {
    $event.preventDefault();
    this.demoOrderServerPagingService.open(this.demoOrder).subscribe(
      (result) => {
        this.demoOrder = result;
      }
    );
  }


  // 單選 - [資料一次全帶入: ng-zrror 的 Table 控制分頁].
  public openMockDataWin($event: MouseEvent): void {
    $event.preventDefault();

    this.mockDataClientPagingService.open(this.mockData).subscribe(
      (result) => {
        this.mockData = result;
      }
    );
  }

  // 多選 - [開窗元件枚舉呈現值(標準開窗，無法定制字段的格式化，例如布爾值字段，數據為枚舉值的字段，需要進行一些簡單的格式化)]
  public openEnumDataWin($event: MouseEvent): void {
    $event.preventDefault();

    this.enumClientPagingService.open(this.enumData).subscribe(
      (result) => {
        this.enumData = result;
      }
    );
  }


  ngOnInit(): void {
  }

}
