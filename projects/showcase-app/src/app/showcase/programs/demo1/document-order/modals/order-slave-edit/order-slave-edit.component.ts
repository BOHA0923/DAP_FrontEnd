import { DwModalRef } from 'ng-quicksilver/modal';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { DocumentOrderProductInfo } from '../../model/order.model';

@Component({
  selector: 'app-dw-document-order-slave-edit',
  templateUrl: './order-slave-edit.component.html',
  styleUrls: ['./order-slave-edit.component.css']
})
export class DocumentOrderSlaveEditComponent implements OnInit {
  public detailEditForm: FormGroup;
  public detailEdit: DocumentOrderProductInfo;
  private _cmd: string;

  @Input()
  set cmd(cmd: string) {
    this._cmd = cmd;
  }

  @Input()
  set orderDetail(orderDetail: DocumentOrderProductInfo) {
    this.detailEdit = orderDetail;
  }

  constructor(private modalSubject: DwModalRef, private fb: FormBuilder) {
  }

  ngOnInit(): void {
    if (this._cmd === 'add') {
      this.detailEdit = new DocumentOrderProductInfo({});
      this.detailEdit.quantity = 1;
    }

    // Form欄位
    this.detailEditForm = this.fb.group({});
    this.detailEditForm.addControl('detailEditProductCode', new FormControl(this.detailEdit.productCode, Validators.required));
    this.detailEditForm.addControl('detailEditPrice', new FormControl(this.detailEdit.price, Validators.required));
    this.detailEditForm.addControl('detailEditQuantity', new FormControl(this.detailEdit.quantity, Validators.required));
  }

  /**
   * 確定
   *
   * @memberof OrderDetailEditComponent
   */
  public emitDataOutside(): void {
    this.detailEdit.distributionStatus = '1';
    this.detailEdit.distributionStatusDesc = '未出貨';
    this.detailEdit.productCode = this.detailEditForm.get('detailEditProductCode').value;
    this.detailEdit.price = this.detailEditForm.get('detailEditPrice').value;
    this.detailEdit.quantity = this.detailEditForm.get('detailEditQuantity').value;
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
}
