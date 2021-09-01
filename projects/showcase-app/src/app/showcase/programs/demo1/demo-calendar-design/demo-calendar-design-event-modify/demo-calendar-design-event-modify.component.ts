import { Component, Input, EventEmitter, Output, TemplateRef, forwardRef, SkipSelf, Optional, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { DwModalService } from 'ng-quicksilver/modal';

import { DwComponent } from '@webdpt/components/redevelop';
import { DwPlanCalendarEventModifyComponent } from '@webdpt/components/plan-calendar';

import {
  DwPlanCalendarPermissionService, DwPlanCalendarEventManageService
} from '@webdpt/framework/plan-calendar';

@Component({
  selector: 'app-demo-calendar-design-event-modify',
  templateUrl: './demo-calendar-design-event-modify.component.html',
  styleUrls: ['./demo-calendar-design-event-modify.component.less'],
  providers: [
    { provide: DwComponent, useExisting: forwardRef(() => DemoCalendarDesignEventModifyComponent) }
  ]
})

export class DemoCalendarDesignEventModifyComponent extends DwComponent {
  /**
   * @see 新增和修改不同
   */
  @Input() calendarSid: number;
  @Input() eventSid: number;
  // see End ---------------

  // @Input()
  // set dwComponentParams(dwComponentParams: any) {
  //   if (dwComponentParams) {
  //     if (dwComponentParams.hasOwnProperty('calendarSid')) {
  //       this.calendarSid = dwComponentParams.calendarSid;
  //     }

  //     if (dwComponentParams.hasOwnProperty('sid')) {
  //       this.eventSid = dwComponentParams.sid;
  //     }
  //   }
  // }

  public isVisible: boolean;
  @Output() dwVisibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input()
  set dwVisible(dwVisible: boolean) {
    // if (this.isVisible !== dwVisible) { // 值有改變才做事
    this.isVisible = dwVisible;

    if (this.isVisible) {
      this.dataInit();
    }

    this.dwVisibleChange.emit(this.isVisible);
    // }
  }

  public title: string | TemplateRef<{}>;
  @Input()
  set dwTitle(dwTitle: string | TemplateRef<{}>) {
    this.title = dwTitle;
  }

  @Input() dwWidth: number | string = 800;
  @Output() dwOnOk: EventEmitter<any> = new EventEmitter<any>();
  @Output() dwOnCancel: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild(DwPlanCalendarEventModifyComponent) componentChildByType: DwPlanCalendarEventModifyComponent; // 直接通過元件型別獲取

  public replaceFormGroup: FormGroup;
  eventPermissions = this.dwPlanCalendarPermissionService.eventPermission('', [], null); // 活動權限

  constructor(
    @SkipSelf() @Optional() _parentDwComponent: DwComponent,
    public fb: FormBuilder,
    public dwPlanCalendarPermissionService: DwPlanCalendarPermissionService,
    public dwPlanCalendarEventManageService: DwPlanCalendarEventManageService,
    public modalService: DwModalService,
    public translateService: TranslateService,
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
    this.replaceFormGroup = this.fb.group({
      location: [{ value: null, disabled: !this.eventPermissions.modifyDetail }, [Validators.required]],
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
    this.resetForm(this.replaceFormGroup);
  }

  public getDataInit($event: any): void {
    const locationValue = $event.mainFormGroup.get('location').value;
    this.replaceFormGroup.get('location').setValue(locationValue);
  }

  handleOk($event: any): void {
    this.dwVisible = false;
    this.dwOnOk.emit($event);
  }

  handleCancel($event: any): void {
    this.dwVisible = false;
    this.dwOnOk.emit($event);
  }

  saveData($event: any): void {
    const params = $event;
    params.location = this.replaceFormGroup.get('location').value;

    this.dwPlanCalendarEventManageService.update(params).subscribe(
      (response: any) => {
        const modalData = {
          formData: this,
          returnData: {
            calendarSid: params.calendarSid,
            isUpdate: true
          }
        };

        this.handleOk(modalData);
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
            dwTitle: this.translateService.instant('dw-msg-saveFailed', { value1: params.summary }),
            dwContent: msgContent
          });
        }
      }
    );
  }

  public eventPermissionsChange(eventPermissions: any): void {
    this.eventPermissions = eventPermissions;

    if (eventPermissions.modifyDetail) {
      this.replaceFormGroup.get('location').enable();
    }
  }

  public locationModal(): void {
    this.modalService.info({
      dwTitle: '【Demo】',
      dwContent: 'locationModal()',
      dwOnOk: (): void => { }
    });
  }
}
