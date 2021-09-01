import { Component, Input, EventEmitter, Output, TemplateRef, forwardRef, SkipSelf, Optional } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ValidatorFn, AbstractControl, FormArray, FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { DwModalService } from 'ng-quicksilver/modal';
import { DwTreeNode } from 'ng-quicksilver/tree';
import { forkJoin } from 'rxjs';

import { DwComponent } from '@webdpt/components/redevelop';
import { IDwOrgTreeDefault } from '@webdpt/framework/organize-tree-core';
import { DwOrganizeTreeModalService } from '@webdpt/components/modals/organize-tree';
import { DwPlanCalendarService } from '@webdpt/framework/plan-calendar';
import { DwPlanCalendarColorService } from '@webdpt/framework/plan-calendar';
import { DwPlanCalendarPermissionService } from '@webdpt/framework/plan-calendar';
import { DwPlanCalendarManageService } from '@webdpt/framework/plan-calendar';
import { DwPlanCalendarEventManageService } from '@webdpt/framework/plan-calendar';
import { DwLoadingMaskService } from '@webdpt/components/loading';
import { DwUserService } from '@webdpt/framework/user';

/**
 * 行事曆活動修改组件
 */
@Component({
  selector: 'dw-plan-calendar-event-modify',
  templateUrl: './plan-calendar-event-modify.component.html',
  styleUrls: ['./plan-calendar-event-modify.component.less', './../plan-calendar-event-add/plan-calendar-event-add.component.less'],
  providers: [
    { provide: DwComponent, useExisting: forwardRef(() => DwPlanCalendarEventModifyComponent) }
  ]
})

export class DwPlanCalendarEventModifyComponent extends DwComponent {
  /**
   * @see 新增和修改不同
   */
  @Input() calendarSid: number;
  @Input() eventSid: number;
  // see End ---------------

  @Input() dwFormGroupInvalid: boolean; // 外層的二次開發組件formGroup invalid

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
  @Output() saveData: EventEmitter<any> = new EventEmitter<any>(); // 保存資料的事件。沒有訂閱者則自動保存，有訂閱者則將保存資料發送給訂閱者處理
  @Output() dwOnOk: EventEmitter<any> = new EventEmitter<any>();
  @Output() dwOnCancel: EventEmitter<any> = new EventEmitter<any>();
  @Output() getDataInit: EventEmitter<any> = new EventEmitter<any>(); // 取詳情的事件
  @Output() eventPermissionsChange: EventEmitter<any> = new EventEmitter<any>(); // 行事曆活動權限變更的事件
  eventPermissions: any; // 活動權限

  public colorList: Array<string> = [];

  public mainFormGroup: FormGroup;

  eventData: any;

  // 参与者
  attendees: any = [];
  // 可选行事曆列表
  calendarList: Array<any> = [];

  public returnData = { // 開窗回傳值
    calendarSid: null, // 行事曆sid，編輯活動後，行事曆列表必須要勾選此行事曆
    isUpdate: false // 是否有更新資料，如果有更新，關閉視窗後也要重取行事曆活動
  };

  constructor(
    @SkipSelf() @Optional() _parentDwComponent: DwComponent,
    public fb: FormBuilder,
    public organizeTreeModalService: DwOrganizeTreeModalService,
    public dwPlanCalendarColorService: DwPlanCalendarColorService,
    public dwPlanCalendarPermissionService: DwPlanCalendarPermissionService,
    public dwPlanCalendarManagerService: DwPlanCalendarManageService,
    public dwPlanCalendarEventManageService: DwPlanCalendarEventManageService,
    public dwPlanCalendarService: DwPlanCalendarService,
    public modalService: DwModalService,
    public translateService: TranslateService,
    public dwLoadingMaskService: DwLoadingMaskService,
    public userService: DwUserService
  ) {
    super(_parentDwComponent);
  }

  afterContentInit(): void {
  }
  afterViewInit(): void {
  }
  onInit(): void {
    this.formInit();
  }
  onDestroy(): void {
  }

  public formInit(): void {
    this.colorList = this.dwPlanCalendarColorService.colorList();
    this.eventPermissions = this.dwPlanCalendarPermissionService.eventPermission('', [], null); // 當前用戶的活動權限
    this.eventPermissionsChange.emit(this.eventPermissions);

    this.mainFormGroup = this.fb.group({
      summary: [{ value: null, disabled: !this.eventPermissions.modifyDetail }, [Validators.required]],
      allDay: [{ value: null, disabled: !this.eventPermissions.modifyDetail }],
      startDatetime: [{ value: null, disabled: !this.eventPermissions.modifyDetail }, [Validators.required, this.startDatetimeValidator()]],
      endDatetime: [{ value: null, disabled: !this.eventPermissions.modifyDetail }, [Validators.required, this.endDatetimeValidator()]],
      color: [{ value: null, disabled: !this.eventPermissions.modifyDetail }],
      location: [{ value: null, disabled: !this.eventPermissions.modifyDetail }],
      description: [{ value: null, disabled: !this.eventPermissions.modifyDetail }],
      sendEmail: [{ value: null, disabled: !this.eventPermissions.modifyDetail }],
      calendarSid: [{ value: null, disabled: !this.eventPermissions.modifyDetail }, [Validators.required]],
      attendeePermission: new FormArray([])
    });
  }

  public resetForm(fGroup: FormGroup): void {
    fGroup.reset();

    for (const key in fGroup.controls) {
      if (fGroup.controls.hasOwnProperty(key)) {
        fGroup.controls[key].markAsPristine();
        fGroup.controls[key].updateValueAndValidity();

        if (fGroup.controls[key] instanceof FormArray) {
          const fArr = fGroup.controls[key] as FormArray;
          while (fArr.length > 0) { // 移除前一次開窗的資料
            fArr.removeAt(0);
          }
        }
      }
    }
  }

  public dataInit(): void {
    const loadingMaskId = this.dwLoadingMaskService.show(0); // 加載遮罩

    this.resetForm(this.mainFormGroup);
    this.returnData = { // 開窗回傳值
      calendarSid: null,
      isUpdate: false
    };
    this.eventData = {
      eventInfo: {
        calendarSid: null,
        summary: null,
        location: null,
        description: null,
        allDay: true,
        color: this.dwPlanCalendarColorService.default(),
        sendEmail: true
      }
    };
    this.eventPermissions = this.dwPlanCalendarPermissionService.eventPermission('', [], null); // 活動權限
    this.eventPermissionsChange.emit(this.eventPermissions);
    this.attendees = [];
    this.calendarList = [];

    /**
     * @see 新增和修改不同
     */
    if (this.title === undefined) {
      this.title = this.translateService.instant('dw-plan-calendar-modify-schedule');
    }

    // 查询详情的入参
    const params = {
      calendarSid: this.calendarSid,
      eventSid: this.eventSid
    };

    forkJoin(
      this.dwPlanCalendarEventManageService.eventsDetail(params),
      this.dwPlanCalendarManagerService.getBelongCalenars()
    ).subscribe(
      (res) => {
        this.eventData = res[0];
        this.eventData.eventInfo.startDatetime = new Date(this.eventData.eventInfo.startDatetime);
        this.eventData.eventInfo.endDatetime = new Date(this.eventData.eventInfo.endDatetime);
        this.initSucheduleFormData();
        this.attendees = this.eventData.eventInfo.attendees || [];
        this.calendarList = res[1];

        // 如果是参与的活动
        if (this.eventData.eventInfo.userId !== this.userService.getUser('userId')) {
          this.mainFormGroup.get('calendarSid').disable();
          const index = this.calendarList.findIndex((d: any) => d.sid === this.eventData.eventInfo.calendarSid);
          if (index === -1) {
            this.calendarList.push({ sid: this.eventData.eventInfo.calendarSid, name: this.eventData.eventInfo.calendarName });
          }
        }

        this.getDataInit.emit(this);
        this.dwLoadingMaskService.hide(loadingMaskId);
      },
      error => {
        this.dwLoadingMaskService.hide(loadingMaskId);
      }
    );
    // see End ---------------
  }

  get attendeePermission(): FormArray {
    return this.mainFormGroup.get('attendeePermission') as FormArray; // Access the FormArray control
  }

  private initSucheduleFormData(): void {
    this.mainFormGroup.get('summary').setValue(this.eventData.eventInfo.summary);
    this.mainFormGroup.get('allDay').setValue(this.eventData.eventInfo.allDay);
    this.mainFormGroup.get('startDatetime').setValue(this.eventData.eventInfo.startDatetime);
    this.mainFormGroup.get('endDatetime').setValue(this.eventData.eventInfo.endDatetime);
    this.mainFormGroup.get('location').setValue(this.eventData.eventInfo.location);
    this.mainFormGroup.get('color').setValue(this.eventData.eventInfo.color);
    this.mainFormGroup.get('description').setValue(this.eventData.eventInfo.description);
    this.mainFormGroup.get('sendEmail').setValue(this.eventData.eventInfo.sendEmail);
    this.mainFormGroup.get('calendarSid').setValue(this.eventData.eventInfo.calendarSid);

    const attendeePermissionFArr = this.mainFormGroup.get('attendeePermission') as FormArray;
    const attendeePermissionList = this.dwPlanCalendarPermissionService.attendeePermissionList();

    attendeePermissionList.forEach(
      (newItem: any) => {
        let hasPermission = false;

        this.eventData.eventInfo.attendeePermission.forEach((permission: string) => {
          if (newItem.key === permission) {
            hasPermission = true;
          }
        });

        const fGroup = new FormGroup({
          'key': new FormControl(newItem.key, []),
          'hasPermission': new FormControl(hasPermission, []),
          'titleKey': new FormControl(newItem.titleKey)
        });

        attendeePermissionFArr.push(fGroup);

        // 修改活動改變勾選
        if (newItem.key === 'EDIT') {
          fGroup.get('hasPermission').valueChanges.subscribe(
            newValue => {
              this.editCheckboxChanges();
            }
          );
        } else if (newItem.key === 'INVITE') {
          // 邀請參與者改變勾選
          fGroup.get('hasPermission').valueChanges.subscribe(
            newValue => {
              this.inviteCheckboxChanges();
            }
          );
        }
      }
    );

    this.eventPermissions = this.dwPlanCalendarPermissionService.eventPermission(
      this.eventData.calAttendeePermission,
      this.eventData.eventInfo.attendeePermission,
      this.eventData.eventInfo.eventStatus
    );

    this.eventPermissionsChange.emit(this.eventPermissions);

    if (this.eventPermissions.modifyDetail) {
      this.mainFormGroup.get('summary').enable();
      this.mainFormGroup.get('allDay').enable();
      this.mainFormGroup.get('startDatetime').enable();
      this.mainFormGroup.get('endDatetime').enable();
      this.mainFormGroup.get('location').enable();
      this.mainFormGroup.get('color').enable();
      this.mainFormGroup.get('description').enable();
      this.mainFormGroup.get('sendEmail').enable();
      this.mainFormGroup.get('calendarSid').enable();
      this.editCheckboxChanges(); // 取得詳情後先初始化
    }

    this.mainFormGroup.get('calendarSid').valueChanges.subscribe(
      newValue => {
        this.onCalendarChange(newValue);
      }
    );

    this.mainFormGroup.get('allDay').valueChanges.subscribe(
      allDayValue => {
        const result = this.dwPlanCalendarService.allDayTime(
          allDayValue,
          this.mainFormGroup.get('startDatetime').value,
          this.mainFormGroup.get('endDatetime').value
        );
        this.mainFormGroup.get('startDatetime').setValue(result.startDatetime);
        this.mainFormGroup.get('endDatetime').setValue(result.endDatetime);
      }
    );
  }

  /**
   * 開始時間校驗器
   */
  startDatetimeValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      let validationErrors = null;

      if (this.mainFormGroup) {
        if (control.value) {
          const startDatetime: Date = control.value;
          const endDatetime: Date = this.mainFormGroup.get('endDatetime').value;

          if (endDatetime && startDatetime.valueOf() > endDatetime.valueOf()) {
            validationErrors = { 'startDatetimeValidator': { value: control.value } };
          } else if (this.mainFormGroup.get('endDatetime').errors) {
            if (this.mainFormGroup.get('endDatetime').errors.hasOwnProperty('endDatetimeValidator')) {
              this.mainFormGroup.get('endDatetime').setErrors(null);
            }
          }
        }
      }

      return validationErrors;
    };
  }

  /**
   * 結束時間校驗器
   */
  endDatetimeValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      let validationErrors = null;

      if (this.mainFormGroup) {
        if (control.value) {
          const startDatetime: Date = this.mainFormGroup.get('startDatetime').value;
          const endDatetime: Date = control.value;

          if (startDatetime && startDatetime.valueOf() > endDatetime.valueOf()) {
            validationErrors = { 'endDatetimeValidator': { value: control.value } };
          } else if (this.mainFormGroup.get('startDatetime').errors) {
            if (this.mainFormGroup.get('startDatetime').errors.hasOwnProperty('startDatetimeValidator')) {
              this.mainFormGroup.get('startDatetime').setErrors(null);
            }
          }
        }
      }

      return validationErrors;
    };
  }

  /**
   * 新增参与者
   */
  public addAttendence(): void {
    const _config: IDwOrgTreeDefault<DwTreeNode> = {
      treeKeyType: 'sid'
    };
    const partners: any = [];
    this.organizeTreeModalService.open(partners, _config).subscribe(res => {
      res.forEach((item: any) => {
        const index = this.attendees.findIndex((d: any) => d.attendeeSid === item.sid);
        if (index === -1) {
          this.attendees.push({
            attendeeId: item.id,
            attendeeSid: item.sid,
            attendeeName: item.title,
            attendeeType: item.type === 'org' ? 'ORG' : 'USER'
          });
        }
      });
    });
  }

  /**
   * 删除参与者
   * @param attend 参与者信息
   */
  removeAttendees(attend: any): void {
    const index = this.attendees.findIndex((d: any) => d.attendeeSid === attend.attendeeSid);
    if (index !== -1) {
      this.attendees.splice(index, 1);
    }
  }

  /**
   * 修改活動改變勾選，強制勾選邀請參與者
   */
  editCheckboxChanges(): void {
    const attendeePermissionFArr = this.mainFormGroup.get('attendeePermission') as FormArray;
    const attendeePermissionCtrls = attendeePermissionFArr.controls;

    const len = attendeePermissionCtrls.length;
    for (let i = 0; i < len; i++) {
      // 修改活動
      if (attendeePermissionCtrls[i].get('key').value === 'EDIT') {
        if (attendeePermissionCtrls[i].get('hasPermission').value) {
          attendeePermissionCtrls.forEach(
            (ctrl: FormControl) => {
              if (ctrl.get('key').value === 'INVITE') { // 邀請參與者
                ctrl.get('hasPermission').setValue(true);
                ctrl.get('hasPermission').disable();
              }
            }
          );
        } else {
          attendeePermissionCtrls.forEach(
            (ctrl: FormControl) => {
              if (ctrl.get('key').value === 'INVITE') {
                ctrl.get('hasPermission').enable();
              }
            }
          );
        }

        break;
      }
    }
  }

  /**
   * 邀請參與者改變勾選，強制勾選查看參與者列表
   */
  inviteCheckboxChanges(): void {
    const attendeePermissionFArr = this.mainFormGroup.get('attendeePermission') as FormArray;
    const attendeePermissionCtrls = attendeePermissionFArr.controls;

    const len = attendeePermissionCtrls.length;
    for (let i = 0; i < len; i++) {
      // 邀請參與者
      if (attendeePermissionCtrls[i].get('key').value === 'INVITE') {
        if (attendeePermissionCtrls[i].get('hasPermission').value) {
          attendeePermissionCtrls.forEach(
            (ctrl: FormControl) => {
              if (ctrl.get('key').value === 'VIEW') { // 查看參與者列表
                ctrl.get('hasPermission').setValue(true);
                ctrl.get('hasPermission').disable();
              }
            }
          );
        } else {
          attendeePermissionCtrls.forEach(
            (ctrl: FormControl) => {
              if (ctrl.get('key').value === 'VIEW') {
                ctrl.get('hasPermission').enable();
              }
            }
          );
        }

        break;
      }
    }
  }

  /**
   * 所属行事曆的回调函数
   * @param calendarSid 行事曆sid
   */
  onCalendarChange(calendarSid: number): void {
    const calendarItem = this.calendarList.find((calendar: any) => calendar.sid === Number(calendarSid));

    if (calendarItem) {
      this.mainFormGroup.get('color').setValue(calendarItem.color);
    }
  }

  handleOk(): void {
    this.returnData.calendarSid = this.mainFormGroup.get('calendarSid').value;
    this.returnData.isUpdate = true;
    this.dwVisible = false;

    const modalData = {
      formData: this.mainFormGroup,
      returnData: this.returnData
    };

    this.dwOnOk.emit(modalData);
  }

  handleCancel(): void {
    this.dwVisible = false;

    const modalData = {
      formData: this.mainFormGroup,
      returnData: this.returnData
    };

    this.dwOnOk.emit(modalData);
  }

  /**
   * 保存
   */
  save(): void {
    const result = this.dwPlanCalendarService.allDayTime(
      this.mainFormGroup.get('allDay').value,
      this.mainFormGroup.get('startDatetime').value,
      this.mainFormGroup.get('endDatetime').value
    );
    this.mainFormGroup.get('startDatetime').setValue(result.startDatetime);
    this.mainFormGroup.get('endDatetime').setValue(result.endDatetime);

    let params: any = {};

    for (const key in this.mainFormGroup.controls) {
      if (this.mainFormGroup.controls.hasOwnProperty(key)) {
        this.mainFormGroup.controls[key].markAsDirty();
        this.mainFormGroup.controls[key].updateValueAndValidity();
        params[key] = this.mainFormGroup.controls[key].value;
      }
    }

    if (this.mainFormGroup.invalid) { return; }

    const permission = [];
    const attendeePermissionFArr = this.mainFormGroup.get('attendeePermission') as FormArray;
    attendeePermissionFArr.controls.forEach(
      (ctrl: FormControl) => {
        if (ctrl.get('hasPermission').value) {
          permission.push(ctrl.get('key').value);
        }
      }
    );

    params = Object.assign(params, {
      // VIEW （查看参与者列表）-> INVITE（邀请参与者） -> EDIT（编辑事件）
      attendeePermission: permission,
      // 参与者列表
      attendees: this.attendees,
      startDatetime: this.dwPlanCalendarService.dateTimeToString(params.startDatetime),
      endDatetime: this.dwPlanCalendarService.dateTimeToString(params.endDatetime),
      sid: this.eventData.eventInfo.sid,
      calendarSid: params.calendarSid
    });

    this.saveData.emit(params);
    const saveDataObserverCount = this.saveData.observers.length;

    if (saveDataObserverCount === 0) {
      /**
       * @see 新增和修改不同
       */
      this.dwPlanCalendarEventManageService.update(params).subscribe( // see End ---------------
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
              dwTitle: this.translateService.instant('dw-msg-saveFailed', { value1: this.mainFormGroup.get('summary').value }),
              dwContent: msgContent
            });
          }
        }
      );
    }
  }
}
