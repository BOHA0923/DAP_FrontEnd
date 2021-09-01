import { Component, OnInit, OnDestroy, TemplateRef, ViewChild, Inject } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { DwModalService } from 'ng-quicksilver/modal';

import { APP_DATE_FORMAT, DW_USING_TAB } from '@webdpt/framework/config';
import { DwDocument, DwDataTable, DwDataRow, IDwDocumentOnSave } from '@webdpt/framework/document'; // 訊息傳遞
import { DwRoutingMessageService } from '@webdpt/components/routing-message';
import { DwTabRoutingService } from '@webdpt/framework/routing-tabset';
import { DocumentOrderProductInfo, DocumentOrderEnumModel } from '../model';
import { DocumentOrderSlaveEditComponent } from '../modals/order-slave-edit/order-slave-edit.component';
import { CustomerClientPagingService } from '../modals/customer/customer-client-paging.service';

@Component({
  selector: 'app-dw-document-order-create',
  templateUrl: './order-create.component.html',
  styleUrls: ['./order-create.component.css'],
  providers: [DwDocument]
})
export class DocumentOrderCreateComponent implements OnInit, IDwDocumentOnSave, OnDestroy {

  public orderid: string = ''; // 訂單編號
  public searchLoading: boolean = false; // 是否顯示加載中
  public statusList = DocumentOrderEnumModel.orderStatus; // 訂單狀態枚舉
  public master: DwDataTable; // 單頭
  public detail: {[key: string]: DwDataTable} = {}; // 多單身
  private detailInfo: any; // 訂單單身信息

  // 訂單明細開窗用，僅為了展示開窗標題可以使用template
  @ViewChild('modifyDetailTitle') modifyTitle: TemplateRef<any>;
  @ViewChild('addDetailTitle') addDetailTitle: TemplateRef<any>;
  private tabInfoSubscription: Subscription = new Subscription();

  constructor(public route: ActivatedRoute,
    public router: Router,
    public dwModalService: DwModalService,
    public dwMessage: DwRoutingMessageService,
    public doc: DwDocument,
    private customerClientPagingService: CustomerClientPagingService,
    @Inject(APP_DATE_FORMAT) public dwDateFormat: string,
    @Inject(DW_USING_TAB) private usingTab: boolean,
    private tabRoutingService: DwTabRoutingService
  ) {
    this.doc.registerEvent(this);
    // 取得路由參數
  }

  ngOnInit(): void {
    this.orderid = (new Date()).getTime().toString();
    this.master = new DwDataTable([{
      address: '',
      customerid: '',
      employeeid: '',
      employeename: '',
      gender: '',
      orderdate: '',
      orderid: this.orderid,
      status: '',
      totalcount: ''
    }]);
    this.detail.demo_orderdetail = new DwDataTable([]);

    this.doc.setControl('demo_order', this.master);
    this.doc.setControl('demo_orderdetail', this.detail.demo_orderdetail);

    this.detailInfo = {
      'demo_orderdetail' : {
        maxSeq: 0
      }
    };

    this.subscribeTabRouterChange();

    this.setMaterValidators();
  }

  /**
   * 多頁籤的狀況下，同頁籤內的路由要重新載入資料的情況如下：
   * 同頁籤同參數時，由tabRouterChanged負責載入資料；
   * 同頁籤不同參數時，由queryParamMap負責載入資料。
   */
  private subscribeTabRouterChange(): void {
    if (this.usingTab) {
      this.tabInfoSubscription.add(this.tabRoutingService.tabRouterChanged.pipe(
        filter(info => {
          return info !== null &&
            !info.tabChanged &&
            info.componentType === 'DocumentOrderCreateComponent';
        })
      ).subscribe(
        info => {
          this.orderid = (new Date()).getTime().toString();
          this.master.reset([{
            orderid: this.orderid
          }]);
          Object.keys(this.detail).forEach((key) => {
            while (this.detail[key].length !== 0) {
              this.detail[key].removeAt(0);
            }
          });

          this.initMaxSeq();
        }
      ));
    }
  }

  /**
   * 單身欄位變更檢測
   *
   * @param {FormGroup} fGroup
   */
  private detailControlValueChanges(fGroup: FormGroup): void {
    // 單價改變，計算小計和總額
    fGroup.get('price').valueChanges.subscribe(
      (price: any) => {
        fGroup.get('count').setValue(
          this.subtotal(price, fGroup.get('quantity').value)
        );
        this.totalSum();
      }
    );

    // 數量改變，計算小計和總額
    fGroup.get('quantity').valueChanges.subscribe(
      (quantity: any) => {
        fGroup.get('count').setValue(
          this.subtotal(fGroup.get('price').value, quantity)
        );
        this.totalSum();
      }
    );
  }

  /**
   * 小計
   * @param price
   * @param quantity
   * @returns subtotal
   */
  private subtotal(price: number, quantity: number): number {
    return price * quantity;
  }

  /**
   * 訂單總額
   * @param formDetail
   */
  public totalSum(): void {
    let total = 0;
    Object.keys(this.detail).forEach((key) => {
      this.detail[key].activeRows.forEach(
        (fGroup: FormGroup) => {
          total += fGroup.get('count').value;
        }
      );
    });

    const masterRow = (this.master.at(0) as DwDataRow);
    masterRow.get('totalcount').setValue(total);
    masterRow.markAsUpdate();
  }

  /**
   * ngFor trackBy函式
   */
  public trackByFn(index: number, item: any): number {
    return index;
  }

  /**
   * 刪除訂單明細
   *
   * @param idx
   * @memberof OrderModifyComponent
   */
  public detailDelete(key: string, idx: number): void {
    this.detail[key].deleteRow(idx);
    this.totalSum();
    this.resetMaxSeq();
  }

  /**
   * 修改訂單明細
   *
   * @param idx
   * @memberof OrderModifyComponent
   */
  public detailModify(key: string, idx: number): void {

    // let productInfo: DocumentOrderProductInfo;

    // const modifyFn = (): void => {
    //   this.detail[idx] = productInfo;
    //   this.totalSum();
    // };

    const control = (this.detail[key].controls[idx] as DwDataRow).getRawValue();
    control.productCode = control.productid;

    this.dwModalService.create({
      dwTitle: this.modifyTitle,
      dwContent: DocumentOrderSlaveEditComponent,
      dwOnOk: (data: any): void => {
        const detail = data.detailEdit;

        this.detail[key].updateRow(idx, {
          count: this.subtotal(detail.price, detail.quantity),
          deliverystatus: detail.distributionStatus,
          price: detail.price,
          productid: detail.productCode,
          quantity: detail.quantity,
          seq: detail.seq,
          orderid: this.orderid
        });

        this.totalSum();
      },
      dwOnCancel(): void { },
      dwFooter: null,
      dwComponentParams: {
        cmd: 'modify',
        orderDetail: new DocumentOrderProductInfo(control)
      }
    });

  }

  /**
   * 新增訂單明細
   *
   * @memberof OrderModifyComponent
   */
  public detailAdd(key: string): void {

    this.dwModalService.create({
      dwTitle: this.addDetailTitle,
      dwContent: DocumentOrderSlaveEditComponent,
      dwOnOk: (data: any): void => {
        const detail = data.detailEdit;

        this.detail[key].insertRow(0, {
          count: this.subtotal(detail.price, detail.quantity),
          deliverystatus: detail.distributionStatus,
          price: detail.price,
          productid: detail.productCode,
          quantity: detail.quantity,
          seq: this.getNewSeq(key),
          orderid: this.orderid
        });

        const detailRow = (this.detail[key].at(0) as DwDataRow);
        this.detailControlValueChanges(detailRow);
        this.totalSum();
      },
      dwOnCancel(): void { },
      dwFooter: null,
      dwComponentParams: { cmd: 'add' }
    });

  }

  public saving(): boolean {
    // const row = (this.master.at(0) as DwDataRow);
    // const orderdate = row.get('orderdate').value;
    // const newdate = (new DatePipe('zh_tw')).transform(orderdate, 'yyyy/MM/dd');
    // row.get('orderdate').setValue(newdate);
    // console.log('saving:' , row.get('orderdate').value);

    return true;
  }

  public saved(result: any): void {
    const msg = result.message;
    if (result.success) {
      if (msg) {
        this.dwMessage.addToRoute(msg);
      }
      this.router.navigate(['../'], { relativeTo: this.route }); // 相對路徑導頁
    } else {
      if (msg) {
        this.dwMessage.success(msg); // 單一訊息顯示
      }
    }
  }


  /**
   * 取得目前最大序號
   *
   */
  getNewSeq(key: string): number {
    let seq = 1;
    if (!key) {
      return seq;
    }

    if (!this.detailInfo.hasOwnProperty(key)) {
      this.detailInfo[key] = {};
      this.detailInfo[key].maxSeq = seq;
      return seq;
    }

    if (typeof this.detailInfo[key].maxSeq !== 'number') {
      this.detailInfo[key].maxSeq = parseInt(this.detailInfo[key].maxSeq, 10);
    }

    seq = ++this.detailInfo[key].maxSeq;

    return seq;
  }

  /**
   * 取消
   *
   * @memberof OrderModifyComponent
   */
  public cancel(): void {
    this.initMaxSeq();
    this.router.navigate(['../'], { relativeTo: this.route }); // 相對路徑導頁
  }

  onAfterSaveOrder(result: any): void {
    console.log(result);
    const msg = result.message;
    if (result.success) {
      if (msg) {
        this.dwMessage.addToRoute(msg);
      }
      this.router.navigate(['../'], { relativeTo: this.route }); // 相對路徑導頁
    } else {
      if (msg) {
        this.dwMessage.success(msg); // 單一訊息顯示
      }
    }
  }

  /**
   * 客戶編號的開窗 mock
   *
   * param {MouseEvent} $event
   */
  public openCustomerDataWin($event: MouseEvent): void {
    $event.preventDefault();
    const row = (this.master.at(0) as DwDataRow);
    const customerid = row.get('customerid').value;

    this.customerClientPagingService.open([customerid]).subscribe(
      (result) => {
        row.get('customerid').setValue(result[0]);
      }
    );
  }

  ngOnDestroy(): void {
    if (this.tabInfoSubscription) {
      this.tabInfoSubscription.unsubscribe();
    }
  }

  /**
   * 設定單頭 master 的驗證器
   *
   */
  private setMaterValidators(): void {
    const row = (this.master.at(0) as DwDataRow);
    row.get('status').setValidators([Validators.required]);
    row.get('orderdate').setValidators([Validators.required]);
    row.get('customerid').setValidators([Validators.required]);
  }

  /**
   * 初始最大序號
   *
   */
  private initMaxSeq(): void {
    Object.keys(this.detail).forEach((key) => {
      if (!this.detailInfo.hasOwnProperty(key)) {
        this.detailInfo[key] = {};
      }

      this.detailInfo[key].maxSeq = 0;
    });
  }


  /**
   * 刪除一筆 row 後, 重新設置最大序號
   *
   */
  private resetMaxSeq(): void {
    Object.keys(this.detail).forEach((key) => {
      let seq = 0;
      this.detail[key].controls.forEach(control => {
        if (control.get('seq').value > seq) {
          seq = control.get('seq').value;
        }
      });

      if (!this.detailInfo.hasOwnProperty(key)) {
        this.detailInfo[key] = {};
      }

      this.detailInfo[key].maxSeq = seq;

    });
  }

}
