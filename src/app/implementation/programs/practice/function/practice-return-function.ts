import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DwModalService } from 'ng-quicksilver';

@Injectable()
export class PracticeReturnFunction {

  constructor(
    private dwModalService: DwModalService,
    private translateService: TranslateService) { }

  /** @description 显示失败讯息
   * @param {string} msg      失败讯息
   * @param {string} detail   提示内容
   * @memberof PracticeReturnFunction
   */
  alertErrModal(msg: string, detail: string): void {
    this.dwModalService.error({
      dwTitle: msg,
      dwContent: detail
      // dwContent: '<a onclick="test()"> ' + detail + '</a>'
      // dwContent: '<a id="test"> ' + detail + '</a>'
    });
    // document.getElementById('test').onclick = () => {console.log('test click');};
    // const tt = document.getElementById('test');
    // tt.addEventListener('click', this.test);
  }

  // test(): void {
  //   console.log('test click');
  // }


  /** @description 显示成功讯息
   * @param {string} msg      成功讯息
   * @param {string} detail   提示内容
   * @memberof PracticeReturnFunction
   */
  alertVModal(msg: string, detail: string): void {
    const modal = this.dwModalService.success({
      dwTitle: msg,
      dwContent: detail
    });
    setTimeout(() => modal.destroy(), 1000);
  }

  /**
   * 获取报错讯息
   *
   * @param {string} code   错误代码
   * @param {string} m1     报错讯息
   * @param {string} m2     提示内容
   * @memberof PracticeReturnFunction
   */
  getAPImsg(code: string): { m1: string, m2: string } {
    const ret = { m1: '', m2: '' };
    switch (code) {
      case '13006': {
        ret.m1 = this.translateService.instant('errcode.13006.m1');
        ret.m2 = this.translateService.instant('errcode.13006.m2');
        break;
      }
      case '13003': {
        ret.m1 = this.translateService.instant('errcode.13003.m1');
        ret.m2 = this.translateService.instant('errcode.13003.m2');
        break;
      }
      case '13029': {
        ret.m1 = this.translateService.instant('errcode.13029.m1');
        ret.m2 = this.translateService.instant('errcode.13029.m2');
        break;
      }
      case '50000': {
        ret.m1 = this.translateService.instant('errcode.50000.m1');
        ret.m2 = this.translateService.instant('errcode.50000.m2');
        break;
      }
      case '50001': {
        ret.m1 = this.translateService.instant('errcode.50001.m1');
        ret.m2 = this.translateService.instant('errcode.50001.m2');
        break;
      }
      case '50002': {
        ret.m1 = this.translateService.instant('errcode.50002.m1');
        ret.m2 = this.translateService.instant('errcode.50002.m2');
        break;
      }
      case '50003': {
        ret.m1 = this.translateService.instant('errcode.50003.m1');
        ret.m2 = this.translateService.instant('errcode.50003.m2');
        break;
      }
      case '50004': {
        ret.m1 = this.translateService.instant('errcode.50004.m1');
        ret.m2 = this.translateService.instant('errcode.50004.m2');
        break;
      }
      case '50005': {
        ret.m1 = this.translateService.instant('errcode.50005.m1');
        ret.m2 = this.translateService.instant('errcode.50005.m2');
        break;
      }
      case '50006': {
        ret.m1 = this.translateService.instant('errcode.50006.m1');
        ret.m2 = this.translateService.instant('errcode.50006.m2');
        break;
      }
      case '50007': {
        ret.m1 = this.translateService.instant('errcode.50007.m1');
        ret.m2 = this.translateService.instant('errcode.50007.m2');
        break;
      }
      case '50008': {
        ret.m1 = this.translateService.instant('errcode.50008.m1');
        ret.m2 = this.translateService.instant('errcode.50008.m2');
        break;
      }
      case '50009': {
        ret.m1 = this.translateService.instant('errcode.50009.m1');
        ret.m2 = this.translateService.instant('errcode.50009.m2');
        break;
      }
      case '50010': {
        ret.m1 = this.translateService.instant('errcode.50010.m1');
        ret.m2 = this.translateService.instant('errcode.50010.m2');
        break;
      }
      case '50011': {
        ret.m1 = this.translateService.instant('errcode.50011.m1');
        ret.m2 = this.translateService.instant('errcode.50011.m2');
        break;
      }
      case '50012': {
        ret.m1 = this.translateService.instant('errcode.50012.m1');
        ret.m2 = this.translateService.instant('errcode.50012.m2');
        break;
      }
      case '50013': {
        ret.m1 = this.translateService.instant('errcode.50013.m1');
        ret.m2 = this.translateService.instant('errcode.50013.m2');
        break;
      }
      case '50014': {
        ret.m1 = this.translateService.instant('errcode.50014.m1');
        ret.m2 = this.translateService.instant('errcode.50014.m2');
        break;
      }
      case '50015': {
        ret.m1 = this.translateService.instant('errcode.50015.m1');
        ret.m2 = this.translateService.instant('errcode.50015.m2');
        break;
      }
      case '50016': {
        ret.m1 = this.translateService.instant('errcode.50016.m1');
        ret.m2 = this.translateService.instant('errcode.50016.m2');
        break;
      }
      case '50017': {
        ret.m1 = this.translateService.instant('errcode.50017.m1');
        ret.m2 = this.translateService.instant('errcode.50017.m2');
        break;
      }
      case '50018': {
        ret.m1 = this.translateService.instant('errcode.50018.m1');
        ret.m2 = this.translateService.instant('errcode.50018.m2');
        break;
      }
      case '50019': {
        ret.m1 = this.translateService.instant('errcode.50019.m1');
        ret.m2 = this.translateService.instant('errcode.50019.m2');
        break;
      }
      case '50020': {
        ret.m1 = this.translateService.instant('errcode.50020.m1');
        ret.m2 = this.translateService.instant('errcode.50020.m2');
        break;
      }
      case '50021': {
        ret.m1 = this.translateService.instant('errcode.50021.m1');
        ret.m2 = this.translateService.instant('errcode.50021.m2');
        break;
      }
      case '50022': {
        ret.m1 = this.translateService.instant('errcode.50022.m1');
        ret.m2 = this.translateService.instant('errcode.50022.m2');
        break;
      }
      case '50023': {
        ret.m1 = this.translateService.instant('errcode.50023.m1');
        ret.m2 = this.translateService.instant('errcode.50023.m2');
        break;
      }
      case '50024': {
        ret.m1 = this.translateService.instant('errcode.50024.m1');
        ret.m2 = this.translateService.instant('errcode.50024.m2');
        break;
      }
      case '50025': {
        ret.m1 = this.translateService.instant('errcode.50025.m1');
        ret.m2 = this.translateService.instant('errcode.50025.m2');
        break;
      }
      case '50026': {
        ret.m1 = this.translateService.instant('errcode.50026.m1');
        ret.m2 = this.translateService.instant('errcode.50026.m2');
        break;
      }
      default: {
        ret.m1 = code;
        break;
      }
    }
    return ret;
  }

  getErrMsg(msgObj: any): { m1: string, m2: string } {
    const ret = { m1: 'error', m2: '' };
    if ('status' in msgObj && 'statusText' in msgObj) {
      ret.m1 = msgObj.status + ' ' + msgObj.statusText;
    }
    if ('error' in msgObj) {
      if ('errorMessage' in msgObj.error) {
        ret.m2 = msgObj.error.errorMessage;
      } else {
        ret.m2 = JSON.stringify(msgObj.error);
      }
    } else {
      ret.m2 = JSON.stringify(msgObj);
    }
    return ret;
  }

  // get Random 整數x, min <= x <= max
  getRadom(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
