import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DwModalRef } from 'ng-quicksilver/modal';
import { DetailsChildInfoModel } from './../model/asis.model';
import { Observable } from 'rxjs';
import { StatusModel } from '../model';
import { AsisService } from '../service/asis.service';
import { SaveService } from './../service/save.service';
@Component({
  selector: 'app-dw-asis-detail-child-edit',
  templateUrl: './asis-detail-child-edit.component.html',
  styleUrls: ['./asis-detail-child-edit.component.css']
})
export class AsisDetailChildEditComponent implements OnInit {
  public detailEditForm: FormGroup;
  public detailEdit: any;
  // 有效值列舉
  public searchStatusOptions: Observable<StatusModel[]>;
  constructor(
    private modalSubject: DwModalRef,
    private fb: FormBuilder,
    private asisService: AsisService,
    private saveService: SaveService
  ) {
    this.searchStatusOptions = this.asisService.searchStatusOptions;
  }

  private _cmd: string;

  @Input()
  set cmd(cmd: string) {
    this._cmd = cmd;
  }
  get cmd(): string {
    return this._cmd;
  }

  @Input()
  set asisDetailChild(asisDetailChild: DetailsChildInfoModel) {
    this.detailEdit = asisDetailChild;
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
      this.detailEdit = new DetailsChildInfoModel({});
      this.detailEdit.status = 'Y';
    }

    // Form欄位
    this.detailEditForm = this.fb.group({});
    this.detailEditForm.addControl('detailEditBiId', new FormControl(this.detailEdit.biId, Validators.required));
    this.detailEditForm.addControl('detailEditBiName', new FormControl(this.detailEdit.biName, Validators.required));
    this.detailEditForm.addControl('detailEditSeq', new FormControl(this.detailEdit.seq, Validators.required));
    this.detailEditForm.addControl('detailEditStatus', new FormControl(this.detailEdit.status, Validators.required));

    // this.detailEditForm.get('detailEditBiId').setValue(this.detailEdit.biId);
    // this.detailEditForm.get('detailEditBiName').setValue(this.detailEdit.biName);
    // this.detailEditForm.get('detailEditSeq').setValue(this.detailEdit.seq);
    // this.detailEditForm.get('detailEditStatus').setValue(this.detailEdit.status);
    this.detailEditForm.get('detailEditStatus').valueChanges.subscribe((val) => {
      this.detailEdit.status = val;
    });
  }
  statusChange($event: any): void {
    console.log($event);
  }

}
