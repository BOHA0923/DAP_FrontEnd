import { Component, Input } from '@angular/core';
import { EventApi } from '@fullcalendar/core';
import { DwCalendarEventInterface } from './calendar-event.interface';

@Component({
  selector: 'dw-calendar-event-editor',
  templateUrl: './event-editor.component.html'
})
export class DwEventEditorComponent {
  /**
   * 編號
   */
  id: string;
  /**
   * 整天
   */
  allDay: boolean;
  /**
   * 開始時間
   */
  start: Date;
  /**
   * 結束時間
   */
  end: Date;
  // /**
  //  * 開始時間：'01:00'
  //  */
  // startTime: string;
  // /**
  //  * 結束時間：'01:00'
  //  * 如果省略，則視為持續的時間
  //  */
  // endTime: string;
  /**
   * 事件名稱
   */
  title: string;
  /**
   * 連結
   */
  url: string;
  /**
   * 樣式名稱
   * 接受字串陣列的樣式名稱["classname1", "classname2"]
   */
  classNames: string[];
  /**
   * 此事件是否可編輯，覆寫master的editable設定
   */
  editable: boolean;
  /**
   * 事件背景色
   */
  backgroundColor: string;
  /**
   * 事件文字顏色
   */
  textColor: string;
  /**
   * rrule
   */
  rrule: string;
  /**
   * 事件描述
   */
  description: string;

  recursiveSetting = false;
  rruleSetting = {
    schedule_type: 4,
    rrule: null
  };
  private _origEvent: Partial<DwCalendarEventInterface>;

  @Input()
  set event(event: Partial<DwCalendarEventInterface>) {
    this._origEvent = event;
    if (event) {
      this.setProperties(event);
    }
  }

  private setProperties(event: Partial<DwCalendarEventInterface>): void {
    this.id = event.id;
    this.start = event.start;
    this.end = event.end;
    this.title = event.title;
    this.url = event.url;
    this.editable = event.editable;
    this.allDay = event.allDay;
    this.backgroundColor = event.backgroundColor;
    this.classNames = event.classNames;
    this.textColor = event.textColor;
    this.rrule = event.rrule;

    this.description = event.description;

    if (this.rrule) {
      this.recursiveSetting = true;
      this.rruleSetting.rrule = this.rrule;
    }
  }

  public getEvent(): DwCalendarEventInterface {
    if (this.recursiveSetting) {
      this.rrule = this.rruleSetting.rrule;
    }
    return {
      id: this.id,
      start: this.start,
      end: this.end,
      title: this.title,
      url: this.url,
      editable: this.editable,
      allDay: this.allDay,
      backgroundColor: this.backgroundColor,
      classNames: this.classNames,
      textColor: this.textColor,
      rrule: this.recursiveSetting ? this.rruleSetting.rrule : null,
      description: this.description
    };
  }
}
