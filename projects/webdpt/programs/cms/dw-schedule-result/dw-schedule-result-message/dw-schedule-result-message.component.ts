import { DwModalRef } from 'ng-quicksilver/modal';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-dw-schedule-result-message',
  templateUrl: './dw-schedule-result-message.component.html',
  styleUrls: ['./dw-schedule-result-message.component.less']
})
export class DwScheduleResultMessageComponent implements OnInit {
  public messageData = {
    scheduleId: '', // 排程編號
    executeStatus: '', // 執行狀態
    message: '', // 訊息
    messageDetail: '' // 詳細訊息
  };

  constructor(private modalSubject: DwModalRef) {
  }


  @Input()
  set messageParam(messageParam: any) {
    this.messageData = Object.assign({}, messageParam);
  }

  /**
   * 確定
   */
  public emitDataOutside(): void {
    // this.modalSubject.next(this.detailEdit); // 在彈出層組件中可以通過DwModalSubject向外層組件傳出數據
    this.modalSubject.triggerOk(); // 表示銷毀模式的時候會執行用戶傳入的選項中的onCancel還是的OnOK方法
  }

  /**
   * 取消
   */
  public handleCancel(e: any): void {
    this.modalSubject.triggerCancel();
  }

  ngOnInit(): void {
  }
}
