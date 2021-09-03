import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DwLanguageService, DwUserService } from '@webdpt/framework';
import { DwMessageService, DwModalService } from 'ng-quicksilver';
import { Subscription } from 'rxjs';
import { PracticeReturnFunction } from '../../function';
import { BohaEditComponent } from '../boha-edit/boha-edit.component';
import { Boha14660Service } from '../service/boha14660.service';


@Component({
  selector: 'app-boha-list',
  templateUrl: './boha-list.component.html',
  styleUrls: ['./boha-list.component.less']
})
export class BohaListComponent implements OnInit {

  // 查詢相关参数
  public schedule_type: string = '';
  public queryName: string = '';    // 模糊搜尋關鍵字
  public schedule_id: string = '';
  public rowCount = 0; // 總筆數
  public dataSet: []; // 查詢列表資料
  public detailData = []; // 查詢列表資料
  public pageSize: number = 10;
  public pageNumber: number = 1;
  public form: FormGroup;
  public searchForm: FormGroup;
  public errors: any;
  public MaxID: string;
  public sysdate: string;
  public hoursOfDay: number[];
  public minutesOfHour: number[];
  public cronType: 'SIMPLE' | 'CYCLE' | 'RRULE' | ('SIMPLE' | 'CYCLE' | 'RRULE')[];
  public visible = false;
  public schedule = {
    schedule_id: '',
    schedule_name: '',
    schedule_type: '2',
    job_name: '',
    time_radio: '1',
    time: '11,30,29',
    time1: '17,00,00,17,59,00,5,1',
    time2: '12,22,00,12,33,00,1,2',
    time3: '17,00,00,17,59,00,5,1',
    rrule: ''
  };

  @Input() searchLoading = true;  // 是否查詢載入中

  // 悬浮框
  @ViewChild('modTitle') modTitle: TemplateRef<any>;
  @ViewChild('addTitle') addTitle: TemplateRef<any>;

  // 查询时用到的参数
  queryField: string = '';
  public masterInfo: any = {};

  // table 高度
  public scrollMap: any = { y: '220px', x : '100%' };
  // 语系
  language: string = ''; // 語言別
  private langSubscription: Subscription;
  public results: Date[] = [];
  public widthConfigArray: any = ['150px', '150px', '150px'];
  public userDetail: any = {}; // 登入者詳細資料
  constructor(protected router: Router,
    protected fb: FormBuilder,
    private practiceReturnFunction: PracticeReturnFunction,
    protected _route: ActivatedRoute,
    public route: ActivatedRoute,
    private dwModalService: DwModalService,
    private userService: DwUserService,
    private message: DwMessageService,
    private translateService: TranslateService,
    private languageService: DwLanguageService,
    public boha14660Service: Boha14660Service) {
    }
  ngOnInit(): void {
  this.searchForm = this.fb.group({});
  this.searchForm.addControl('queryField', new FormControl(this.queryName));
  this.searchData();
  }
  /**
   * 查询单头
   * @param reset
   */
   public searchData(): void {
    console.log('language:', this.language);
    // this.dataSet = JSON.stringify(this.boha14660Service.getList());
    // this.dataSet = this.boha14660Service.getList();
    this.boha14660Service.getList().subscribe(res => this.dataSet = res);
    console.log('123456789', this.dataSet);
  }

  /**
   *  刷新数据
   */
   public refreshData(): void {
    this.searchForm.get('queryField').setValue('');
  }

  /**
   * 每頁筆數改變
   */
  public onPageSizeChange(): void {
  }

/**
 * 當前頁碼改變
 *
 * @param {number} pageIndex
 * @memberof Swbi001ListComponent
 */
  public onPageIndexChange(pageIndex: number): void {
    console.log(pageIndex);
    this.pageNumber = pageIndex;
  }


  /**
   * 新增 add / 修改 mod
   * @param status {add / mod}
   * @param info   {data info}
   */
   public edit(status: string, info: any): void {
    const newScheduleInfo = {
      location: '',                           // 開團地點
      time: '',                               // 開團時間
      people: ''                              // 開團人數
  };
    if (status === 'add') {
    this.dwModalService.create({
      dwTitle: this.addTitle,
      dwContent: BohaEditComponent,
      dwOnOk: (data: any): void => {
        // newScheduleInfo.location = data.detailEditForm.get('location').value;
        // newScheduleInfo.time = data.detailEditForm.get('time').value;
        // newScheduleInfo.people = data.detailEditForm.get('people').value;
        console.log('newdata', newScheduleInfo);
        // this.addSchedule(newScheduleInfo, 'add');
      },
      dwOnCancel(): void {
      },
      dwFooter: null,
      dwComponentParams: {
        cmd: 'add',
        MaxID: this.MaxID,
        sipi015Edit: newScheduleInfo
      }
    });
    } else {
    }
  }
}
