import { Component } from '@angular/core';

@Component({
  selector: 'dw-simple-job-schedule-in-modal',
  template: `
    <button dw-button (click)="show()">開窗</button>
    <button dw-button (click)="show('SIMPLE')">每日</button>
    <button dw-button (click)="show('CYCLE')">每日時段</button>
    <button dw-button (click)="show('RRULE')">週期</button>
    <button dw-button (click)="show(['SIMPLE','CYCLE'])">每日及每日時段</button>
    <button dw-button (click)="show(['CYCLE','RRULE'])">每日時段及週期</button>
    <dw-modal dwWidth="800px" [dwVisible]="visible"
              dwTitle="每日任務排程設定" (dwOnCancel)="cancel()" (dwOnOk)="ok()">
      <dw-job-time-setting [dwJobType]="cronType" [(ngModel)]="schedule"></dw-job-time-setting>
    </dw-modal>
  `
})
export class DwSimpleJobScheduleInModalComponent {
  private readonly _schedule: string;
  visible = false;
  cronType: 'SIMPLE' | 'CYCLE' | 'RRULE' | ('SIMPLE' | 'CYCLE' | 'RRULE')[];
  schedule = {
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

  constructor() { this._schedule = JSON.stringify(this.schedule); }

  show(type?: 'SIMPLE' | 'CYCLE' | 'RRULE' | ('SIMPLE' | 'CYCLE' | 'RRULE')[]): void {
    if (type === 'RRULE') {
      this.schedule.schedule_type = '4';
    }
    this.cronType = type;
    this.visible = true;
  }

  cancel(): void {
    this.visible = false;
    this.reset();
  }

  ok(): void {
    this.visible = false;
    this.reset();
  }

  private reset(): void {
    this.schedule = JSON.parse(this._schedule);
  }
}
