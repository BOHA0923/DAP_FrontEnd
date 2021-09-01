import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DwModalRef } from 'ng-quicksilver/modal';
import { DetailsInfoModel } from './../model/asis.model';
import { SaveService } from './../service/save.service';

@Component({
  selector: 'app-dw-asis-detail-edit',
  templateUrl: './asis-detail-edit.component.html',
  styleUrls: ['./asis-detail-edit.component.css']
})
export class AsisDetailEditComponent implements OnInit {
  public detailEditForm: FormGroup;
  public detailEdit: any;

  constructor(private modalSubject: DwModalRef, private fb: FormBuilder, private saveService: SaveService) {
  }

  private _cmd: string;

  @Input()
  set cmd(cmd: string) {
    this._cmd = cmd;
  }

  @Input()
  set asisDetail(asisDetail: DetailsInfoModel) {
    this.detailEdit = asisDetail;
    this.detailEdit.status = (this.detailEdit.status === 'Y') ? true : false;
    console.log(this.detailEdit);
  }

  /**
   * 確定
   *
   * @memberof AsisDetailEditComponent
   */
  public emitDataOutside(): void {
    const emitData = Object.assign({}, this.detailEdit);
    // this.modalSubject.next(emitData); // 在彈出層組件中可以通過DwModalSubject向外層組件傳出數據
    this.saveService.save(emitData);
    this.modalSubject.triggerOk(); // 表示銷毀模式的時候會執行用戶傳入的選項中的onCancel還是的OnOK方法
  }

  /**
   * 取消
   *
   * @param e
   * @memberof AsisDetailEditComponent
   */
  public handleCancel(e: any): void {
    this.modalSubject.triggerCancel();
  }

  ngOnInit(): void {
    if (this._cmd === 'add') {
      this.detailEdit = new DetailsInfoModel({});
    }

    // Form欄位
    this.detailEditForm = this.fb.group({});
    this.detailEditForm.addControl('detailEditItemId', new FormControl(this.detailEdit.itemId, Validators.required));
    this.detailEditForm.addControl('detailEditItemName', new FormControl(this.detailEdit.itemName, Validators.required));
    this.detailEditForm.addControl('detailEditUpperId1', new FormControl(this.detailEdit.upperId1));
    this.detailEditForm.addControl('detailEditUpperName1', new FormControl(this.detailEdit.upperName1));
    this.detailEditForm.addControl('detailEditUpperId2', new FormControl(this.detailEdit.upperId2));
    this.detailEditForm.addControl('detailEditUpperName2', new FormControl(this.detailEdit.upperName2));

    // this.detailEditForm.get('detailEditItemId').setValue(this.detailEdit.itemId);
    // this.detailEditForm.get('detailEditItemName').setValue(this.detailEdit.itemName);
    // this.detailEditForm.get('detailEditUpperId1').setValue(this.detailEdit.itemId);
    // this.detailEditForm.get('detailEditUpperName1').setValue(this.detailEdit.upperName1);
    // this.detailEditForm.get('detailEditUpperId2').setValue(this.detailEdit.upperId2);
    // this.detailEditForm.get('detailEditUpperName2').setValue(this.detailEdit.upperName2);
    // this.detailEditForm.get('detailEditStatus').setValue(this.detailEdit.status);
  }
  statusChange($event: any): void {
    console.log($event);
  }

}
