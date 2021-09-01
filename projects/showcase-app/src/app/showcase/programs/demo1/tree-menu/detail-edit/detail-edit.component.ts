import { Component, OnInit, Input, Inject } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';

import { Observable } from 'rxjs';
import { DwModalRef } from 'ng-quicksilver/modal';
import fnsFormat from 'date-fns/format';
import { TreeCurrencyModel, TreeDetailsInfoModel } from '../model';
import { TreeMenuService } from '../service/tree-menu.service';

@Component({
  selector: 'app-dw-detail-edit',
  templateUrl: './detail-edit.component.html',
  styleUrls: ['./detail-edit.component.css']
})
export class DetailEditComponent implements OnInit {

  public detailEditForm: FormGroup;
  public detailEdit: any; // 操作的單身一筆資料
  public currencyOptions: Observable<TreeCurrencyModel[]>;
  get getDateFormat(): string {
    return this.treeMenuService.getDateFormat();
  }
  constructor(private modalSubject: DwModalRef,
    private fb: FormBuilder,
    private treeMenuService: TreeMenuService
  ) {
  }

  private _cmd: string;

  // 當[ 設定cmd屬性 ]時觸發, 將入參 cmd 利用setter, 將 cmd 指定 _cmd.
  @Input()
  set cmd(cmd: string) {
    this._cmd = cmd;
  }

  // 當[ 設定groupDetail屬性 ]時觸發,將入參 groupDetail 利用setter, 將 groupDetail 指定到 function 內處理.
  @Input()
  set groupDetail(groupDetail: TreeDetailsInfoModel) {
    this.detailEdit = groupDetail;
    this.detailEdit.status = (this.detailEdit.status === 'Y');
    if (this.detailEdit.startDate) {
      this.detailEdit.startDate = new Date(this.detailEdit.startDate);
    }
    if (this.detailEdit.endDate) {
      this.detailEdit.endDate = new Date(this.detailEdit.endDate);
    }
  }

  /**
   * 確定
   *
   * @memberof GroupDetailEditComponent
   */
  public emitDataOutside(): void {
    const emitData = Object.assign({}, this.detailEditForm.value);
    emitData.status = emitData.status ? 'Y' : 'N';
    if (emitData.startDate) {
      emitData.startDate = fnsFormat(emitData.startDate, this.treeMenuService.getDateFormat());
    }
    if (emitData.endDate) {
      emitData.endDate = fnsFormat(emitData.endDate, this.treeMenuService.getDateFormat());
    }
    // this.modalSubject.next(emitData); // 在彈出層組件中可以通過DwModalSubject向外層組件傳出數據
    // this.modalSubject.destroy('onOk'); // 表示銷毀模式的時候會執行用戶傳入的選項中的onCancel還是的OnOK方法
    // this.modalSubject.triggerOk(); // 表示銷毀模式的時候會執行用戶傳入的選項中的onCancel還是的OnOK方法
    this.modalSubject.destroy({ data: emitData });
  }

  /**
   * 取消
   *
   * @param e MouseEvent.
   * @memberof GroupDetailEditComponent
   */
  public handleCancel(e: MouseEvent): void {
    // this.modalSubject.destroy('onCancel');
    this.modalSubject.triggerCancel();
  }

  ngOnInit(): void {
    this.currencyOptions = TreeCurrencyModel.getList(); // 狀態碼列舉初始化
    if (this._cmd === 'add') {
      this.detailEdit = new TreeDetailsInfoModel({});
      this.detailEdit.status = 'Y';
    }

    // 增加 checkbox 的初始值判斷, 因為當為空字串''時, checkbox 會被勾選, 但是 form valid 卻為 false
    if (typeof this.detailEdit.status !== 'boolean') {
      this.detailEdit.status = (this.detailEdit.status === 'Y') ? true : false;
    }

    this.detailEditForm = this.fb.group({
      'companyId': [this.detailEdit.companyId, Validators.required],
      'companyName': [this.detailEdit.companyName, Validators.required],
      'currencyId': [this.detailEdit.currencyId],
      'status': [this.detailEdit.status, Validators.required],
      'startDate': [this.detailEdit.startDate],
      'endDate': [this.detailEdit.endDate]
    });
    this.detailEditForm.get('status').valueChanges.subscribe((val) => {
      this.detailEdit.status = val;
      this.statusChange(val);
    });
    this.detailEditForm.get('startDate').valueChanges.subscribe((val) => {
      console.log(val);
      this.detailEdit.startDate = val;
      this.startValueChange();
    });
    this.detailEditForm.get('endDate').valueChanges.subscribe((val) => {
      this.detailEdit.endDate = val;
      this.endValueChange();
    });
  }

  /**
   * 是否執行(ngModelChange) 事件
   *
   * @param $event 是否選取.
   * @memberof DetailEditComponent
   */
  public statusChange($event: boolean): void {
    // console.log('detailEdit.status>>>>', $event);
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
  /**
   * dw-datepicker 事件
   *
   * @memberof DetailEditComponent
   */
  public disabledStartDate = (startValue: Date): boolean => {
    if (!startValue || !this.detailEdit.endDate) {
      return false;
    }
    return startValue.getTime() >= this.detailEdit.endDate.getTime();
  }

  /**
   * dw-datepicker 事件
   *
   * @memberof DetailEditComponent
   */
  public disabledEndDate = (endValue: Date): boolean => {
    if (!endValue || !this.detailEdit.startDate) {
      return false;
    }
    return endValue.getTime() <= this.detailEdit.startDate.getTime();
  }
}
