import {
  Component,
  Input,
  Output,
  TemplateRef,
  EventEmitter,
  forwardRef,
  SkipSelf,
  Optional,
  OnChanges,
  SimpleChanges
} from '@angular/core';

import { DwComponent } from '@webdpt/components/redevelop';
import { DwPlanCalendarModalService } from '@webdpt/framework/plan-calendar';
import { DwPlanCalendarPermissionService } from '@webdpt/framework/plan-calendar';
import { DwPlanCalendarEventManageService } from '@webdpt/framework/plan-calendar';

/**
 * 行事曆活動詳情組件
 */
@Component({
  selector: 'dw-plan-calendar-event-detail',
  templateUrl: './plan-calendar-event-detail.component.html',
  styleUrls: ['./plan-calendar-event-detail.component.less'],
  providers: [
    { provide: DwComponent, useExisting: forwardRef(() => DwPlanCalendarEventDetailComponent) }
  ]
})

export class DwPlanCalendarEventDetailComponent extends DwComponent implements OnChanges {
  public componentParams: any;
  @Input()
  set dwComponentParams(dwComponentParams: any) {
    this.componentParams = dwComponentParams;
  }

  public isVisible: boolean;
  @Output() dwVisibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input()
  set dwVisible(dwVisible: boolean) {
    if (this.isVisible !== dwVisible) { // 值有改變才做事
      this.isVisible = dwVisible;
      this.dwVisibleChange.emit(this.isVisible);
    }
  }

  public title: string | TemplateRef<{}>;
  @Input()
  set dwTitle(dwTitle: string | TemplateRef<{}>) {
    this.title = dwTitle;
  }

  @Input() dwWidth: number | string = 800;
  @Output() dwOnOk: EventEmitter<any> = new EventEmitter<any>();
  @Output() dwOnCancel: EventEmitter<any> = new EventEmitter<any>();

  public calendarSid: number;
  public eventSid: number;

  eventData: any = {
    eventInfo: {}
  };

  eventPermissions = this.dwPlanCalendarPermissionService.eventPermission('', [], null); // 活動權限

  // @Input()
  // set eventInfo(eventInfo: any) {
  //   this.eventData.eventInfo = eventInfo;
  // }

  public returnData = { // 開窗回傳值
    calendarSid: null, // 行事曆sid，編輯活動後，行事曆列表必須要勾選此行事曆
    isUpdate: false // 是否有更新資料，如果有更新，關閉視窗後也要重取行事曆活動
  };

  // 開窗
  public planCalendarEventModifyVisible: boolean;

  constructor(
    @SkipSelf() @Optional() _parentDwComponent: DwComponent,
    public planCalendarModalService: DwPlanCalendarModalService,
    public dwPlanCalendarPermissionService: DwPlanCalendarPermissionService,
    public dwPlanCalendarEventManageService: DwPlanCalendarEventManageService,
  ) {
    super(_parentDwComponent);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.dwVisible && changes.dwVisible.currentValue === false) {
      return;
    }
    if (changes.dwVisible && this.componentParams) {
      this.dataInit();
    }
  }

  afterContentInit(): void {
  }
  afterViewInit(): void {
  }
  onInit(): void {
    // this.formInit();
  }
  onDestroy(): void {
  }

  // public formInit(): void {
  // }

  public dataInit(): void {
    this.returnData = { // 開窗回傳值
      calendarSid: null, // 行事曆sid，編輯活動後，行事曆列表必須要勾選此行事曆
      isUpdate: false // 是否有更新資料，如果有更新，關閉視窗後也要重取行事曆活動
    };
    this.calendarSid = null;
    this.eventSid = null;
    this.eventData = {
      eventInfo: {}
    };

    this.eventPermissions = this.dwPlanCalendarPermissionService.eventPermission('', [], null); // 活動權限

    if (this.title === undefined) {
      if (this.componentParams.hasOwnProperty('summary')) {
        this.title = this.componentParams.summary;
      }
    }

    this.calendarSid = this.componentParams.calendarSid;
    this.eventSid = this.componentParams.sid;

    this.eventPermissions = this.dwPlanCalendarPermissionService.eventPermission('', [], null);

    const params = {
      calendarSid: this.calendarSid,
      eventSid: this.eventSid
    };

    this.dwPlanCalendarEventManageService.eventsDetail(params).subscribe(
      (eventsDetail: any) => {
        this.eventData = eventsDetail;

        this.eventPermissions = this.dwPlanCalendarPermissionService.eventPermission(
          this.eventData.calAttendeePermission,
          this.eventData.eventInfo.attendeePermission,
          this.eventData.eventInfo.eventStatus
        );
      }
    );
  }

  handleOk(): void {
    this.dwVisible = false;

    const modalData = {
      returnData: this.returnData
    };

    this.dwOnOk.emit(modalData);
  }

  handleCancel(): void {
    this.dwVisible = false;

    const modalData = {
      returnData: this.returnData
    };

    this.dwOnOk.emit(modalData);
  }

  /**
   * 删除活動
   */
  deleteEvent(): void {
    this.planCalendarModalService.calendarEventDelete(this.eventData.eventInfo.sid, this.eventData.eventInfo.summary).subscribe(
      (modalData: any): void => {
        // 開窗後的額外動作
        if (modalData !== 'cancel') {
          this.handleOk();
        }
      }
    );
  }

  /**
   * 编辑活動
   */
  public modifyEvent(): void {
    this.planCalendarEventModifyVisible = true;
  }

  /**
   * 修改活動開窗確定
   */
  public planCalendarEventEditHandleOk($event: any): void {
    this.planCalendarModalService.calendarEventEditOnOk($event).subscribe(
      (modalData: any): void => {
        this.returnData = modalData.returnData;
        this.calendarSid = this.returnData.calendarSid;
        this.handleOk();
      }
    );
  }

  public planCalendarEventEditHandleCancel($event: any): void {
  }

  /**
   * 用戶修改行事曆活動參與狀態
   */
  eventsUpdateStatus(status: string): void {
    this.dwPlanCalendarEventManageService.eventsUpdateStatus(this.eventData.eventInfo.sid, status).subscribe(
      (response: any) => {
        if (status === 'CANCELED') {
          this.handleOk();
        } else {
          this.returnData.isUpdate = true; // 之後關閉視窗應該也要驅動重取行事曆全部活動
          this.dataInit();
        }
      }
    );
  }
}
