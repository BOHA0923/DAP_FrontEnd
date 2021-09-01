import { Component, forwardRef, SkipSelf, Optional, Inject } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import fnsFormat from 'date-fns/format';

import { DwModalService } from 'ng-quicksilver/modal';
import { APP_DATE_FORMAT } from '@webdpt/framework/config';
import {
  DwQueryConditionInfo, DwQueryInfo, DwDocument, DwQueryCondition, DwQueryConditionOperator
} from '@webdpt/framework/document';
import { DwProgramInfoListJsonService, IDwOperationMap } from '@webdpt/framework/operation';
import { DwProgramInfoLangLoaderService } from '@webdpt/framework/program-info';
import { DwScheduleEnumModel } from '../model/enum.model';
import { DwScheduleResultMessageComponent } from '../dw-schedule-result-message/dw-schedule-result-message.component';
import { DwComponent } from '@webdpt/components/redevelop';
import { DwLanguagePreService } from '@webdpt/framework/program-info';
import { DwLanguageService } from '@webdpt/framework/language';

@Component({
  selector: 'app-dw-schedule-result-list',
  templateUrl: './dw-schedule-result-list.component.html',
  styleUrls: ['./dw-schedule-result-list.component.less'],
  providers: [
    {
      provide: DwComponent, useExisting: forwardRef(() => DwScheduleResultListComponent)
    }
  ]
})
export class DwScheduleResultListComponent extends DwComponent {
  // 進階查詢開合 true:關閉, false:打開
  public isCollapse = true;
  // 是否顯示查詢載入中
  public searchLoading = true;
  public searchForm: FormGroup;
  private searchFormInit = {}; // 查詢條件欄位初始值
  public conditionField: { [key: string]: DwQueryConditionInfo } = {};

  // 查詢列表
  public rowCount = 0; // 總筆數
  public dataSet = []; // 查詢列表資料

  public queryInfo: DwQueryInfo = new DwQueryInfo();
  public programCodeEnum = [];
  public scheduleTypeEnum = DwScheduleEnumModel.scheduleTypeList;
  public executeStatusEnum = DwScheduleEnumModel.statusList;
  public programPre = this.dwLanguagePreService.program;

  constructor(
    @SkipSelf() @Optional() _parentDwComponent: DwComponent,
    protected router: Router,
    protected _route: ActivatedRoute,
    protected fb: FormBuilder,
    public doc: DwDocument,
    private languageService: DwLanguageService,
    private dwLanguagePreService: DwLanguagePreService,
    private programInfoListJsonService: DwProgramInfoListJsonService,
    private programInfoLangLoaderService: DwProgramInfoLangLoaderService,
    private dwModalService: DwModalService,
    @Inject(APP_DATE_FORMAT) public dwDateFormat: string
  ) {
    super(_parentDwComponent);

    this.getProgramCodeEnums();

    this.searchForm = this.fb.group({});
    this.searchForm.addControl('program_code', new FormControl([]));
    this.searchForm.addControl('start_time', new FormControl(''));
    this.searchForm.addControl('end_time', new FormControl(''));
    this.searchForm.addControl('schedule_id', new FormControl(''));
    this.searchForm.addControl('schedule_type', new FormControl([]));
    this.searchForm.addControl('execute_status', new FormControl([]));

    Object.keys(this.searchForm.controls).forEach(
      key => {
        this.searchFormInit[key] = this.searchForm.get(key).value;
      }
    );

    this.searchData(true);
  }

  afterContentInit(): void { }

  afterViewInit(): void { }

  onInit(): void {
  }

  onDestroy(): void { }

  /**
   * 查詢資料
   */
  public searchData(reset: boolean = false): void {
    this.onBeforeSearch();

    if (reset) { // 是否重新指定當前頁碼為第一頁
      this.queryInfo.pageNumber = 1;
    }

    const searchCondition = new DwQueryCondition();
    let startTimeStr = '';
    let endTimeStr = '';

    for (const key of Object.keys(this.searchForm.controls)) {
      if (Array.isArray(this.searchForm.controls[key].value) && this.searchForm.controls[key].value.length === 0) {
        continue;
      }

      if (this.searchForm.controls[key].value === '' || this.searchForm.controls[key].value === null) { // 日期是null
        continue;
      }

      if (Array.isArray(this.searchForm.controls[key].value)) {
        searchCondition.addCondition(new DwQueryConditionInfo(key, this.searchForm.controls[key].value, DwQueryConditionOperator.IN));
      } else {
        if (key === 'start_time') {
          startTimeStr = fnsFormat(this.searchForm.controls[key].value, 'yyyy-MM-dd');
        } else if (key === 'end_time') {
          endTimeStr = fnsFormat(this.searchForm.controls[key].value, 'yyyy-MM-dd');
        } else {
          searchCondition.addCondition(new DwQueryConditionInfo(key, this.searchForm.controls[key].value, DwQueryConditionOperator.EQUAL));
        }
      }
    }

    // 日期條件
    if (startTimeStr !== '' && endTimeStr !== '') {
      if (startTimeStr === endTimeStr) {
        searchCondition.addCondition(new DwQueryConditionInfo('start_time', startTimeStr + '%', DwQueryConditionOperator.LIKE));
      } else {
        searchCondition.addCondition(new DwQueryConditionInfo('start_time', startTimeStr, DwQueryConditionOperator.GREATERTHAN));
        searchCondition.addCondition(new DwQueryConditionInfo('end_time', endTimeStr + ' 23:59:59', DwQueryConditionOperator.LESSTHAN));
      }
    } else {
      if (startTimeStr !== '') {
        searchCondition.addCondition(new DwQueryConditionInfo('start_time', startTimeStr + '%', DwQueryConditionOperator.LIKE));
      } else if (endTimeStr !== '') {
        searchCondition.addCondition(new DwQueryConditionInfo('end_time', endTimeStr + '%', DwQueryConditionOperator.LIKE));
      }
    }
    this.queryInfo.setCondition(searchCondition);

    this.doc.list(this.queryInfo.getRawValue()).subscribe(
      response => { // 查詢排程執行結果清單
        this.rowCount = response.rowCount;
        this.dataSet = [];
        const scheduleRecord = response.data.dw_schedule_record;

        scheduleRecord.forEach(element => {
          const newItem = Object.assign({}, element);
          newItem['expand'] = false;
          this.dataSet.push(newItem);
        });

        this.onAfterSearch();
      },
      error => {
        this.onAfterSearch();
      }
    );

  }

  onBeforeSearch(): void {
    this.searchLoading = true;
  }

  onAfterSearch(): void {
    this.searchLoading = false;
  }

  /**
   * 清除
   */
  public resetForm(): void {
    // 查詢條件欄位初始化
    this.searchForm.reset(this.searchFormInit);
    this.queryInfo.clear();
  }

  /**
   * 每頁筆數改變
   */
  public onPageSizeChange(): void {
    this.searchData(true);
  }

  /**
   * 當前頁碼改變
   *
   * @param pageIndex 當前頁碼
   */
  public onPageIndexChange(pageIndex: number): void {
    this.queryInfo.pageNumber = pageIndex;
    this.searchData(false);
  }

  public getProgramCodeEnums(): void {
    this.programCodeEnum = [];
    const _dwProgramInfoFrameworkJson = this.programInfoListJsonService.dwProgramInfoFrameworkJson;
    const languageOption = this.languageService.currentLanguage;

    this.programInfoListJsonService.programListJsonMap$.subscribe(
      (programListJsonMap: IDwOperationMap) => {
        this.programInfoLangLoaderService.getTranslation(languageOption).subscribe(
          (translation: any) => {
            Object.keys(programListJsonMap).forEach(
              key => {
                // 平台架構作業不用列
                let show = true;
                _dwProgramInfoFrameworkJson.forEach(
                  frameworkProgram => {
                    if (key === frameworkProgram.id) {
                      show = false;
                    }
                  }
                );

                if (show) {
                  const name = translation[key] + '(' + key + ')';
                  this.programCodeEnum.push(
                    {
                      value: key // 作業編號或報表編號
                    }
                  );
                }
              }
            );
          }
        );
      }
    );
  }

  public showMessage(scheduleId: string, executeStatus: string, message: string, messageDetail: string): void {
    if (message) {
      const messageParam = {
        scheduleId: scheduleId, // 排程編號
        executeStatus: executeStatus, // 執行狀態
        message: message, // 訊息
        messageDetail: messageDetail // 詳細訊息
      };

      this.dwModalService.create({
        dwTitle: scheduleId,
        dwContent: DwScheduleResultMessageComponent,
        dwWidth: 650,
        dwOnOk: (data: any): void => {
        },
        dwOnCancel(): void { },
        dwFooter: null,
        dwComponentParams: {
          messageParam: messageParam
        }
      });
    }
  }
}
