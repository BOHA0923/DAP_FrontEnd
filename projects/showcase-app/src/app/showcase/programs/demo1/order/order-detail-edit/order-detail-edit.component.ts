import { DwModalRef } from 'ng-quicksilver/modal';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { OrderProductInfo } from './../model/order.model';


@Component({
  selector: 'app-dw-order-detail-edit',
  templateUrl: './order-detail-edit.component.html',
  styleUrls: ['./order-detail-edit.component.css']
})
export class OrderDetailEditComponent implements OnInit {
  public detailEditForm: FormGroup;
  public detailEdit: OrderProductInfo;

  constructor(private modalSubject: DwModalRef, private fb: FormBuilder) {
  }

  private _cmd: string;

  @Input()
  set cmd(cmd: string) {
    this._cmd = cmd;
  }

  @Input()
  set orderDetail(orderDetail: OrderProductInfo) {
    this.detailEdit = orderDetail;
  }

  /**
   * 確定
   *
   * @memberof OrderDetailEditComponent
   */
  public emitDataOutside(): void {
    // this.modalSubject.next(this.detailEdit); // 在彈出層組件中可以通過DwModalSubject向外層組件傳出數據
    this.modalSubject.triggerOk(); // 表示銷毀模式的時候會執行用戶傳入的選項中的onCancel還是的OnOK方法
  }

  /**
   * 取消
   *
   * @param e
   * @memberof OrderDetailEditComponent
   */
  public handleCancel(e: any): void {
    this.modalSubject.triggerCancel();
  }

  ngOnInit(): void {
    if (this._cmd === 'add') {
      this.detailEdit = new OrderProductInfo({});
      this.detailEdit.quantity = 1;
    }

    // Form欄位
    this.detailEditForm = this.fb.group({});
    this.detailEditForm.addControl('productCode', new FormControl(this.detailEdit.productCode, Validators.required));
    this.detailEditForm.addControl('productName', new FormControl(this.detailEdit.productName, Validators.required));
    this.detailEditForm.addControl('price', new FormControl(this.detailEdit.price, Validators.required));
    this.detailEditForm.addControl('quantity', new FormControl(this.detailEdit.quantity, Validators.required));
  }
}
