import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DwMessageService } from 'ng-quicksilver/message';
import { DwModalService } from 'ng-quicksilver/modal';

import { DwDapPermissionRepository } from '@webdpt/framework/dap';
import { DwLanguageService } from '@webdpt/framework/language';
import { DwUserService } from '@webdpt/framework/user';

@Component({
  selector: 'app-dw-upload-cc-list',
  templateUrl: './dw-upload-cc-list.component.html',
  styleUrls: ['./dw-upload-cc-list.component.less']
})
export class DwUploadCcListComponent implements OnInit {
  public uploadCcIng = false; // 作業上傳互聯應用處理中
  private uploadCcList: any[] = []; // 作業上傳清單
  public currentData: any[] = []; // 顯示當前頁資料
  public searchLoading = false;
  public rowCount = 0; // 總筆數
  public pageSizeOptions: number[] = []; // 頁數選擇器可選值
  public search = {
    pageIndex: 1, // 當前頁碼
    pageSize: 10 // 每頁筆數
  };
  public expandAll = false;
  private defaultPageSizeOptions = [10, 20, 30, 40, 50];

  constructor(
    private translateService: TranslateService,
    private languageService: DwLanguageService,
    private dapPermissionRepository: DwDapPermissionRepository,
    private messageService: DwMessageService,
    private modalService: DwModalService,
    private userService: DwUserService
  ) { }

  ngOnInit(): void {
    this.searchData(true);
  }

  public expandAllChange(): void {
    this.expandAll = !this.expandAll;
  }

  public searchData(reset: boolean): void {
    this.searchLoading = true;

    if (reset) {
      this.search.pageIndex = 1; // 是否重新指定當前頁碼為第一頁

      const language = this.languageService.currentLanguage;
      this.uploadCcList = [];

      this.dapPermissionRepository.uploadCcList(language).subscribe(
        (list: any[]) => {
          this.uploadCcList = list.slice();
          this.dataPagination(list, this.search.pageIndex, this.search.pageSize);
          this.searchLoading = false;
        },
        error => {
          const list = [];
          this.dataPagination(list, this.search.pageIndex, this.search.pageSize);
          this.searchLoading = false;
          console.log(error);
        }
      );
    } else {
      const list = this.uploadCcList.slice();
      this.dataPagination(list, this.search.pageIndex, this.search.pageSize);
      this.searchLoading = false;
    }
  }

  /**
   * 前端資料分頁
   *
   * @param list 資料列
   * @param pageIndex 當前頁碼
   * @param paramsPageSize 每頁筆數
   * @returns result
   */
  public dataPagination(list: any[], pageIndex: number, paramsPageSize: number): void {
    const result = {
      pageIndex: pageIndex, // 當前頁碼
      rowCount: list.length, // 總筆數
      pageCount: 0, // 總頁數
      datas: [] // 資料
    };

    result.pageCount = Math.ceil(result.rowCount / paramsPageSize);
    // if (result.pageIndex > result.pageCount) {
    //   result.pageIndex = result.pageCount;
    // }

    let startIdx = 0;
    if (result.pageIndex > 1) {
      startIdx = (result.pageIndex - 1) * paramsPageSize;
    }

    let endIdx = result.pageIndex * paramsPageSize;
    if (endIdx > result.rowCount) {
      endIdx = result.rowCount;
    }

    for (let i = startIdx; i < endIdx; i++) {
      result.datas.push(JSON.parse(JSON.stringify(list[i])));
    }

    // ---------------------------------------
    this.currentData = result.datas;
    this.rowCount = result.rowCount;

    // 頁數選擇器可選值：超過預設最大值則提供選擇全部資料的選項
    const _defaultPageSizeOptions = this.defaultPageSizeOptions.slice();

    if (list.length > _defaultPageSizeOptions[_defaultPageSizeOptions.length - 1]) {
      _defaultPageSizeOptions.push(list.length);
    }

    this.pageSizeOptions = _defaultPageSizeOptions;
  }

  /**
   * 每頁筆數改變
   */
  public onPageSizeChange(): void {
    this.searchData(true);
    // this.pageSizeChange.emit();
  }

  /**
   * 當前頁碼改變
   *
   * @param pageIndex 當前頁碼
   */
  public onPageIndexChange(pageIndex: number): void {
    this.search.pageIndex = pageIndex;
    // this.pageIndexChange.emit();
    this.searchData(false);
  }

  public uploadCc(): void {
    this.uploadCcIng = true;
    const language = this.languageService.currentLanguage;

    this.dapPermissionRepository.uploadCc(language).subscribe(
      response => {
        this.uploadCcIng = false;

        if (response.success) {
          const msg = this.translateService.instant('dw-sys-menu-msg-updated');
          this.messageService.create('success', msg);
        } else if (response.message) {
          this.modalService.error({
            dwTitle: this.translateService.instant('dw-sys-menu-msg-updateFailed'),
            dwContent: response.message
          });
        }
      },
      error => {
        this.uploadCcIng = false;
      }
    );
  }
}
