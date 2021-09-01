import { AfterViewInit, Component, Renderer2, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { Calendar, DateSpanApi } from '@fullcalendar/core';
import { EventApi } from '@fullcalendar/core/api/EventApi';
import { DateInput } from '@fullcalendar/core/datelib/env';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import rrule from '@fullcalendar/rrule';
import timeGridPlugin from '@fullcalendar/timegrid';
import { DwLanguageService } from '@webdpt/framework/language';
import { DwModalService } from 'ng-quicksilver/modal';
import { DwCalendarEventInterface } from './calendar-event.interface';
import { DwEventEditorComponent } from './event-editor.component';

@Component({
  selector: 'dw-simple-fc',
  templateUrl: './simple.component.html',
  styles: [`
      ::ng-deep .edit-modal .ant-btn-danger {
          float: left;
      }

      ::ng-deep .fc-setting-button,
      ::ng-deep .fc-setting-button:focus,
      ::ng-deep .fc-setting-button:active,
      ::ng-deep .fc-setting-button:hover {
          background-color: white !important;
          border-color: white !important;
          color: black !important;
          box-shadow: none !important;
      }

      ::ng-deep .fc-setting-button .fc-icon-tool:before {
          content: "\\e672";
          font-family: 'anticon' !important;
      }
  `]
})
export class DwSimpleFullCalendarComponent implements AfterViewInit {

  @ViewChild('editModalFooter') editModalFooter: TemplateRef<any>;
  @ViewChild('fullCalendar') fullCalendar: FullCalendarComponent;
  @ViewChild('settingButtons') settingButtons: TemplateRef<any>;

  calendarApi: Calendar;
  buttonText: any;

  constructor(
    private language: DwLanguageService,
    private renderer: Renderer2,
    private modal: DwModalService,
    // private dropDown: DwDropdownService
  ) {

    this.buttonText = {
      today: '今日',
      dayGridMonth: '月檢視',
      timeGridWeek: '週檢視',
      timeGridDay: '日檢視',
      listMonth: '月清單',
      listWeek: '週清單',
      listDay: '日清單'
    };
  }

  calendarHandler: any;
  calendarPlugins = [dayGridPlugin, timeGridPlugin, interactionPlugin, rrule, listPlugin];
  calendarEvents: Partial<DwCalendarEventInterface>[] = [
    {title: 'Event Now', start: new Date(), id: 'event1', backgroundColor: 'blue', textColor: 'yellow'},
    {title: 'Event Now2', start: new Date(), id: 'event2', classNames: ['cls1', 'cls2', 'cls3']},
    {title: 'Event Now3', id: 'event3', rrule: 'RRULE:FREQ=WEEKLY;UNTIL=20190928T000000Z;COUNT=30;INTERVAL=1;WKST=MO;BYDAY=MO,TU'}
  ];
  settingButton: any = {
    'setting': {
      text: '',
      icon: 'tool',
      click: (el: any): void => {
        // this.dropDown.create(el, this.settingButtons);
      }
    }
  };
  firstDayOfWeek = '0';

  handleEventClick(arg: any): void {
    this.editEvent(arg);
  }

  handleDateClick(arg: any): void {
    // if (confirm('Would you like to add an event to ' + arg.dateStr + ' ?')) {
    //   this.calendarEvents = this.calendarEvents.concat({ // add new event data. must create new array
    //     title: 'New Event',
    //     start: arg.date,
    //     allDay: arg.allDay
    //   });
    // }
  }

  ngAfterViewInit(): void {
    this.calendarApi = this.fullCalendar.getApi();
    this.calendarApi.setOption(
      'locale',
      this.language.currentLanguage.toLocaleLowerCase().replace('_', '-')
    );
  }

  private _findEventEventById(id: string): Partial<DwCalendarEventInterface> {
    let index: number;
    const event = this.calendarEvents.find((_event, idx) => {
      if (_event.id === id) {
        index = idx;
      }
      return index !== undefined;
    });
    return event;
  }

  editEvent(arg: any): void {
    const id = arg.event.id;
    const event = this._findEventEventById(id);
    const index = this.calendarEvents.indexOf(event);
    const modal = this.modal.create({
      dwWidth: 800,
      dwMaskClosable: false,
      dwClassName: 'edit-modal',
      dwTitle: '事件編輯',
      dwContent: DwEventEditorComponent,
      dwComponentParams: {event},
      dwFooter: [
        {
          label: '刪除',
          type: 'danger',
          onClick: (contentComponentInstance: DwEventEditorComponent): void => {
            if (contentComponentInstance) {
              const deletedEvent = contentComponentInstance.getEvent();
              this.deleteEventById(deletedEvent.id);
            }
          }
        },
        {
          label: '取消',
          onClick: (): void => {
            modal.close();
          }
        },
        {
          label: '確認',
          type: 'primary',
          onClick: (contentComponentInstance: DwEventEditorComponent): void => {
            if (contentComponentInstance) {
              const newEvent: DwCalendarEventInterface = contentComponentInstance.getEvent();
              this._updateEvent(newEvent, index);
            }
            modal.close();
          }
        }
      ]
      // ,
      // dwOnOk: (component: DwEventEditorComponent): void => {
      //   const newEvent: DwCalendarEventInterface = component.getEvent();
      //   this._updateEvent(newEvent, index);
      // }
    });
  }

  addEvent(arg: any): void {
    this.modal.create({
      dwWidth: 700,
      dwMaskClosable: false,
      dwTitle: '事件編輯',
      dwContent: DwEventEditorComponent,
      dwComponentParams: {
        event: {
          start: arg.date,
          allDay: arg.allDay
        }
      },
      dwOnOk: (component: DwEventEditorComponent): void => {
        const newEvent: DwCalendarEventInterface = component.getEvent();
        if (newEvent.id === undefined) {
          newEvent.id = new Date().getTime() + '';
        }
        this.calendarEvents = this.calendarEvents.concat(newEvent);
      }
    });
  }

  private _updateEvent(event: Partial<DwCalendarEventInterface>, index: number): void {
    const newEvent = Object.assign({}, event);
    const events = this.calendarEvents.slice();
    events[index] = newEvent;
    this.calendarEvents = events;
  }

  startDrag($event: any): boolean {
    if ($event.event.rrule) {
      return false;
    }
  }

  drop($event: any): void {
    const event = this._findEventEventById($event.event.id);
    event.start = $event.event.start;
    event.end = $event.event.end;
    this._updateEvent(event, this.calendarEvents.indexOf(event));
  }

  allowEvent(span: DateSpanApi, movingEvent: EventApi | null): boolean {
    // const events = [...movingEvent.source.internalEventSource.meta];
    // const event = events.find(_event => movingEvent.id === _event.id);

    return !(movingEvent._def.recurringDef && movingEvent._def.recurringDef.typeData);
  }

  eventResized($event: any): void {
    $event.revert();
    const event = this._findEventEventById($event.event.id);
    event.start = $event.event.start;
    event.end = $event.event.end;
    this._updateEvent(event, this.calendarEvents.indexOf(event));
  }

  doubleClickRender($event: any): void {

    // 底下的方式將節日附加上去。
    const span = document.createElement('b');
    span.className = 'holiday';
    span.append('Hello');
    $event.el.append(span);

    $event.el.addEventListener('dblclick', () => {
      console.log('dblclick', $event.date);
      this.addEvent({date: $event.date, allDay: true});
    });
  }

  eventRender($event: any): void { }

  appendDeleteButton($event: any): void { }

  removeDeleteButton($event: any): void { }

  private deleteEventById(id: string): void {
    const events = this.calendarEvents.slice();
    let event: Partial<DwCalendarEventInterface> = null;
    let index = -1;
    for (let i = 0; i < this.calendarEvents.length; i++) {
      if (this.calendarEvents[i].id === id) {
        index = i;
        break;
      }
    }
    if (index >= 0) {
      event = this.calendarEvents[index];
      this.modal.confirm({
        dwTitle: '刪除事件',
        dwContent: '確認刪除\'' + event.title + '\'',
        dwOnOk: (): void => {
          events.splice(index, 1);
          this.calendarEvents = events;
          this.modal.closeAll();
        }
      });
    }
  }

  columnHeaderText($event: any): void {
    console.log($event);
  }
}
