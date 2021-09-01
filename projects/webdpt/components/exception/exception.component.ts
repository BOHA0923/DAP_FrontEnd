import { DwModalRef } from 'ng-quicksilver/modal';
import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'dw-exception',
  templateUrl: './exception.component.html',
  styleUrls: ['./exception.component.css']
})
export class DwExceptionComponent implements OnInit {

  private type = '';
  img = '';
  title = '';
  desc = '';
  descDetail: Array<string> = [];

  @Input()
  set statusCode(statusCode: string) {
    this.type = statusCode;
  }

  @Input()
  set statusDescDetail(statusDescDetail: Array<string>) {
    this.descDetail = statusDescDetail;
  }

  constructor(
    private modalSubject: DwModalRef
  ) {

  }

  /**
   * 確定
   */
  public emitDataOutside(): void {
    // this.modalSubject.next(this.type); // 在彈出層組件中可以通過DwModalSubject向外層組件傳出數據
    this.modalSubject.triggerOk(); // 表示銷毀模式的時候會執行用戶傳入的選項中的onCancel還是的OnOK方法
  }

  /**
   * 取消
   */
  public handleCancel(e: any): void {
    this.modalSubject.triggerCancel();
  }

  ngOnInit(): void {
    this.reSet();
  }

  reSet(): void {
    const item = ({
      0: {
        title: '0',
        desc: 'dw-http-error-500' // 抱歉，服務器出錯了(Server無回應時status=0)
      },
      400: {
        title: '400',
        desc: 'dw-http-error-400' // 錯誤的請求
      },
      401: {
        title: '401',
        desc: 'dw-http-error-401' // 發送的請求缺乏憑證
      },
      403: {
        title: '403',
        desc: 'dw-http-error-403' // 抱歉，您無權訪問該頁面
      },
      404: {
        title: '404',
        desc: 'dw-http-error-404' // 抱歉，您訪問的頁面不存在
      },
      500: {
        title: '500',
        desc: 'dw-http-error-500' // 抱歉，服務器出錯了
      },
    })[this.type];

    if (!item) {
      if (this.type) {
        this.title = this.type;
        this.desc = 'dw-http-error'; // 抱歉，出錯了
      } else {
        return;
      }
    } else {
      this.title = item.title;
      this.desc = item.desc;
    }
  }
}
