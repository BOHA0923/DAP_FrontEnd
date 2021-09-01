import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, TemplateRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DwModalService } from 'ng-quicksilver/modal';

import { DwPlanCalendarManageService } from '@webdpt/framework/plan-calendar';

@Component({
  selector: 'dw-plan-calendar-subscribe',
  templateUrl: './plan-calendar-subscribe.component.html',
  styleUrls: ['./plan-calendar-subscribe.component.less']
})

export class DwPlanCalendarSubscribeComponent implements OnInit, OnDestroy {

  private _planCalendarCategory: string;
  @Input()
  set planCalendarCategory(planCalendarCategory: string) {
    this._planCalendarCategory = planCalendarCategory;
  }

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

  calendars: Array<any>;

  constructor(
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
    this.calendars = [];
  }

  /**
   * 获取可订阅列表
   */
  private dataInit(): void {
    if (this.title === undefined) {
      this.title = this.translateService.instant('dw-plan-calendar-subscribe-calendar');
    }

    this.calendars = [];

    this.planCalendarManageService.getSubscriptionList([]).subscribe(
      (response: Array<any>) => {
        this.calendars = response;
      }
    );
  }

  handleOk(): void {
    this.dwVisible = false;

    const modalData = {
      formData: this.calendars
    };

    this.dwOnOk.emit(modalData);
  }

  handleCancel(): void {
    this.dwVisible = false;

    const modalData = {
      formData: this.calendars
    };

    this.dwOnOk.emit(modalData);
  }

  save(): void {
    const calendarSids = [];

    this.calendars.forEach(
      (item: any) => {
        if (item.subscribed) {
          calendarSids.push(item.sid);
        }
      }
    );

    this.planCalendarManageService.calendarsSubscribe(calendarSids).subscribe(
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
            dwTitle: this.translateService.instant('dw-msg-saveFailed', {
              value1: this.translateService.instant('dw-plan-calendar-subscribe-calendar')
            }),
            dwContent: msgContent
          });
        }
      }
    );
  }
}
