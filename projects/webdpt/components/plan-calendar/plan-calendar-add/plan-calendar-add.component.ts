import { Component, OnInit, OnDestroy, Input, Inject, Output, EventEmitter, TemplateRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DwModalService } from 'ng-quicksilver/modal';
import { DwTreeNode } from 'ng-quicksilver/tree';

import { DwOrganizeTreeModalService } from '@webdpt/components/modals/organize-tree';
import { IDwOrgTreeDefault } from '@webdpt/framework/organize-tree-core';
import { DwPlanCalendarManageService } from '@webdpt/framework/plan-calendar';
import { DwPlanCalendarColorService } from '@webdpt/framework/plan-calendar';

/**
 * 行事曆新增組件
 */
@Component({
  selector: 'dw-plan-calendar-add',
  templateUrl: './plan-calendar-add.component.html',
  styleUrls: ['./plan-calendar-add.component.less']
})
export class DwPlanCalendarAddComponent implements OnInit, OnDestroy {
  @Input() planCalendarCategory: string;

  public isVisible: boolean;
  @Output() dwVisibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input()
  set dwVisible(dwVisible: boolean) {
    if (this.isVisible !== dwVisible) { // 值有改變才做事
      this.isVisible = dwVisible;

      if (this.isVisible) {
        this.dataInit();
      }

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

  public returnData = { // 開窗回傳值
    calendarSid: null, // 行事曆sid
    isUpdate: false // 是否有更新資料
  };

  public calendarInfo: any = {};
  public basedCalendarList: any = [];
  public colorList: Array<string> = [];

  constructor(
    private dwPlanCalendarColorService: DwPlanCalendarColorService,
    private organizeTreeModalService: DwOrganizeTreeModalService,
    private planCalendarManageService: DwPlanCalendarManageService,
    private modalService: DwModalService,
    private translateService: TranslateService,
  ) {
  }

  ngOnInit(): void {
    this.formInit();
  }

  ngOnDestroy(): void {
  }

  public formInit(): void {
    this.colorList = this.dwPlanCalendarColorService.colorList();
  }

  public dataInit(): void {
    this.returnData = { // 開窗回傳值
      calendarSid: null,
      isUpdate: false
    };

    /**
     * @see 新增和修改不同
     */
    if (this.title === undefined) {
      this.title = this.translateService.instant('dw-plan-calendar-add-calendar');
    }

    this.calendarInfo = Object.assign({}, {
      calAttendees: [],
      name: null,
      color: this.dwPlanCalendarColorService.default(),
      description: null,
      sourceCalendarSid: null,
      open: false,
      // 订阅者权限：READ_ONLY（只能看到忙碌空闲信息）-> READ_DETAIL（可查看所有活動详情）
      subscriberPermission: null,
      category: this.planCalendarCategory // 行事曆層級：DAP（平台級），TENANT（企業級），APP（應用級），USER（用戶級）
    });

    // 企業行事曆預設公開
    if (this.planCalendarCategory === 'TENANT') {
      this.calendarInfo.open = true;
      this.openChange(this.calendarInfo.open);
    }
    // see End ---------------
  }

  /**
   * 切換是否公開
   *
   * @param isOpen 是否公開
   */
  public openChange(isOpen: boolean): void {
    // 訂閱者權限預設可查看所有活動詳情
    if (isOpen) {
      this.calendarInfo.subscriberPermission = 'READ_DETAIL';
    } else {
      this.calendarInfo.subscriberPermission = null;
    }
  }

  /**
   * 新增协作对象
   */
  public addPartners(): void {
    const _config: IDwOrgTreeDefault<DwTreeNode> = {
      treeKeyType: 'sid'
    };
    const partners: any = [];
    this.organizeTreeModalService.open(partners, _config).subscribe(res => {
      res.forEach((item: any) => {
        const index = this.calendarInfo.calAttendees.findIndex((d: any) => Number(d.sid) === Number(item.sid));
        if (index === -1) {
          this.calendarInfo.calAttendees.push({
            id: item.id,
            sid: Number(item.sid),
            name: item.title,
            attendeeType: item.type === 'org' ? 'ORG' : 'USER',
            attendeePermission: 'READ_DETAIL'
          });
        }
      });
    });
  }

  /**
   * 删除协作者
   * @param partner 协作者信息
   */
  removeAttend(partner: any): void {
    const index = this.calendarInfo.calAttendees.findIndex((d: any) => d.sid === partner.sid);
    if (index !== -1) {
      this.calendarInfo.calAttendees.splice(index, 1);
    }
  }

  handleOk(): void {
    // this.returnData.calendarSid = this.calendarSid; // TODO
    this.returnData.isUpdate = true;
    this.dwVisible = false;

    const modalData = {
      formData: Object.assign({}, this.calendarInfo),
      returnData: this.returnData
    };

    this.dwOnOk.emit(modalData);
  }

  /**
   * 取消
   */
  handleCancel(): void {
    this.dwVisible = false;

    const modalData = {
      formData: Object.assign({}, this.calendarInfo),
      returnData: this.returnData
    };

    this.dwOnOk.emit(modalData);
  }

  /**
   * 保存
   */
  save(): void {
    if (!this.calendarInfo.name) {
      this.calendarInfo.name = '';
    } else {
      this.planCalendarManageService.add(this.calendarInfo).subscribe(
        (response: any) => {
          this.handleOk();
        },
        (errorResponse: any) => {
          if (errorResponse.error.hasOwnProperty('dwHttpErrorResponse')) {
            let msgContent = '';

            if (errorResponse.error.message) {
              msgContent = errorResponse.error.message;
            } else if (errorResponse.error.dwHttpErrorResponse.errorStatusMessage) {
              msgContent = errorResponse.error.dwHttpErrorResponse.errorStatusMessage;
            }

            this.modalService.error({
              dwTitle: this.translateService.instant('dw-msg-saveFailed', { value1: this.calendarInfo.name }),
              dwContent: msgContent
            });
          }
        }
      );
    }
  }
}
