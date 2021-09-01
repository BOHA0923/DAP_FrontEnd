import { Injectable, NgZone } from '@angular/core';
import { DwModalService } from 'ng-quicksilver/modal';
import { DwModalRef } from 'ng-quicksilver/modal';
import { DwExceptionComponent } from './exception.component';
import { DwExceptionModule } from './exception.module';


@Injectable({
  providedIn: DwExceptionModule
})
export class DwExceptionService {
  private _descDetail: Array<string>;
  private _modalRef: DwModalRef = null; // 防止同時多次開窗顯示

  constructor(
    private dwModalService: DwModalService,
    private zone: NgZone
  ) { }

  get descDetail(): Array<string> {
    return this._descDetail;
  }

  public showMessage(status: number, _descDetail?: Array<string>): void {
    this._descDetail = _descDetail;
    switch (status) {
      default:
        // const errMsgUrl = '/exception/' + status;
        // this.router.navigate([errMsgUrl]);
        this.showMessageModal(status);
        break;
    }
  }


  /**
   * 20200407 - error handler是在變更檢測之外運行的
   *
   */
  public showMessageModal(status: number): void {
    this.zone.run(() => {
      if (this._modalRef) {
        this._modalRef.destroy();
      }

      this._modalRef = this.dwModalService.create({
        dwTitle: status.toString(),
        dwContent: DwExceptionComponent,
        // dwStyle: { top: '5px' },
        dwWidth: '80%',
        dwBodyStyle: { background: '#ececec' },
        dwFooter: null,
        dwOnOk: (data: any): void => { },
        dwOnCancel(): void { },
        dwComponentParams: { statusCode: status, statusDescDetail: this._descDetail }
      });
    });
  }

}
