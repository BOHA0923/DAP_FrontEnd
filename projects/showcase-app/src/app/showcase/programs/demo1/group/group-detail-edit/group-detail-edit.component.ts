import { DwModalRef } from 'ng-quicksilver/modal';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DetailsInfoModel } from './../model/group.model';
import { CurrencyModel } from '../model';
import { Observable } from 'rxjs';
import fnsFormat from 'date-fns/format';
import { SaveService } from './../service/save.service';
import { GroupService } from '../service/group.service';

@Component({
  selector: 'app-dw-group-detail-edit',
  templateUrl: './group-detail-edit.component.html',
  styleUrls: ['./group-detail-edit.component.css']
})
export class GroupDetailEditComponent implements OnInit {
  public detailEditForm: FormGroup;
  public detailEdit: any;
  public currencyOptions: Observable<CurrencyModel[]>;
  constructor(
    private modalSubject: DwModalRef,
    private fb: FormBuilder,
    private saveService: SaveService,
    public groupService: GroupService,

    ) {
  }

  private _cmd: string;

  @Input()
  set cmd(cmd: string) {
    this._cmd = cmd;
  }

  @Input()
  set groupDetail(groupDetail: DetailsInfoModel) {
    this.detailEdit = groupDetail;
    this.detailEdit.status = (this.detailEdit.status === 'Y') ? true : false;
    if (this.detailEdit.startDate) {
      this.detailEdit.startDate = new Date(this.detailEdit.startDate);
    }
    if (this.detailEdit.endDate) {
      this.detailEdit.endDate = new Date(this.detailEdit.endDate);
    }
    console.log(this.detailEdit);
  }
  get dwDateTimeFormat(): string {
    return this.groupService.getDateTimeFormat();
  }
  /**
   * 確定
   *
   * @memberof GroupDetailEditComponent
   */
  public emitDataOutside(): void {
    const emitData = Object.assign({}, this.detailEdit);
    emitData.status = emitData.status ? 'Y' : 'N';
    if (emitData.startDate) {
      emitData.startDate = fnsFormat(emitData.startDate, this.dwDateTimeFormat);
    }
    if (emitData.endDate) {
      emitData.endDate = fnsFormat(emitData.endDate, this.dwDateTimeFormat);
    }
    // this.modalSubject.next(emitData); // 在彈出層組件中可以通過DwModalSubject向外層組件傳出數據
    this.saveService.save(emitData);
    this.modalSubject.triggerOk(); // 表示銷毀模式的時候會執行用戶傳入的選項中的onCancel還是的OnOK方法
  }

  /**
   * 取消
   *
   * @param e
   * @memberof GroupDetailEditComponent
   */
  public handleCancel(e: any): void {
    this.modalSubject.triggerCancel();
  }

  ngOnInit(): void {
    this.currencyOptions = CurrencyModel.getList(); // 狀態碼列舉初始化
    if (this._cmd === 'add') {
      this.detailEdit = new DetailsInfoModel({});
      this.detailEdit.status = 'Y';
    }

    // 增加 checkbox 的初始值判斷, 因為當為空字串''時, checkbox 會被勾選, 但是 form valid 卻為 false
    if (typeof this.detailEdit.status !== 'boolean') {
      this.detailEdit.status = (this.detailEdit.status === 'Y') ? true : false;
    }

    // Form欄位
    this.detailEditForm = this.fb.group({});
    this.detailEditForm.addControl('detailEditCompanyId', new FormControl(this.detailEdit.companyId, Validators.required));
    this.detailEditForm.addControl('detailEditCompanyName', new FormControl(this.detailEdit.companyName, Validators.required));
    this.detailEditForm.addControl('detailEditCurrencyId', new FormControl(this.detailEdit.currencyId));
    this.detailEditForm.addControl('detailEditStatus', new FormControl(this.detailEdit.status));
    this.detailEditForm.addControl('detailEditStartDate', new FormControl(this.detailEdit.startDate));
    this.detailEditForm.addControl('detailEditEndDate', new FormControl(this.detailEdit.endDate));
    this.detailEditForm.get('detailEditStatus').valueChanges.subscribe((val) => {
      this.detailEdit.status = val;
      this.statusChange(val);
    });
    this.detailEditForm.get('detailEditStartDate').valueChanges.subscribe((val) => {
      console.log(val);
      this.detailEdit.startDate = val;
      this.startValueChange();
    });
    this.detailEditForm.get('detailEditEndDate').valueChanges.subscribe((val) => {
      this.detailEdit.endDate = val;
      this.endValueChange();
    });
    this.detailEditForm.get('detailEditCurrencyId').valueChanges.subscribe((val) => {
      this.detailEdit.currencyId = val;
    });
  }
  statusChange($event: any): void {
    console.log($event);
  }
  startValueChange = (): void => {
    if (!this.detailEdit.endDate) {
      return;
    }
    if (this.detailEdit.startDate > this.detailEdit.endDate) {
      this.detailEdit.endDate = null;
    }
  }
  endValueChange = (): void => {
    if (!this.detailEdit.startDate) {
      return;
    }
    if (this.detailEdit.startDate > this.detailEdit.endDate) {
      this.detailEdit.startDate = null;
    }
  }
  disabledStartDate = (startValue: Date): boolean => {
    if (!startValue || !this.detailEdit.endDate) {
      return false;
    }
    return startValue.getTime() >= this.detailEdit.endDate.getTime();
  }
  disabledEndDate = (endValue: Date): boolean => {
    if (!endValue || !this.detailEdit.startDate) {
      return false;
    }
    return endValue.getTime() <= this.detailEdit.startDate.getTime();
  }
}
