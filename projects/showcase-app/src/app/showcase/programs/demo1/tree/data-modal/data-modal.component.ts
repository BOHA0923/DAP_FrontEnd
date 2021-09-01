import { DwModalRef } from 'ng-quicksilver/modal';
import { Component, Input, OnInit, Inject } from '@angular/core';
import { DataModel, OriginDataModel } from '../model/model';
import fnsFormat from 'date-fns/format';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from '@angular/forms';
import { AbstractControl } from '@angular/forms';
import { APP_DATE_FORMAT, APP_TIME_FORMAT } from '@webdpt/framework/config';

@Component({
  selector: 'app-dw-showcase-data-modal',
  templateUrl: './data-modal.component.html',
  styleUrls: ['./data-modal.component.css']
})
export class ShowcaseDataModalComponent implements OnInit {
  validateForm: FormGroup;
  _item: DataModel;
  _originData: OriginDataModel[];
  typeOptions: any[] = [];
  _value: any[] = null;
  statusEnum: any[] = [
    { value: true, label: '運行中' },
    { value: false, label: '關閉' }
  ];
  parentRequired: boolean = false;
  addressRequired: boolean = false;
  @Input()
  set item(value: DataModel) {
    // console.log(value);
    this._item = value;
  }
  set originData(value: OriginDataModel[]) {
    console.log(value);
    this._originData = value;
  }
  submitForm = ($event, value): void => {
    console.log(this.validateForm);
    $event.preventDefault();
    for (const key in this.validateForm.controls) {
      if (this.validateForm.controls.hasOwnProperty(key)) {
        this.validateForm.controls[key].markAsDirty();
      }
    }
    console.log(value);
    // this.subject.next(value);
    this.subject.triggerOk();
    // this.subject.destroy('onOk');
  }

  handleCancel(e: any): void {
    this.subject.triggerCancel();
    // this.subject.destroy('onCancel');
  }

  constructor(
    private subject: DwModalRef,
    private fb: FormBuilder,
    @Inject(APP_DATE_FORMAT) private dwDateFormat: string,
    @Inject(APP_TIME_FORMAT) private dwTimeFormat: string
    ) {
    // this.subject.on('onDestory', () => {
    //   console.log('destroy');
    // });
  }

  ngOnInit(): void {
    this.toOptions();
    this.validateForm = this.fb.group({
      type: 1,
      parent: [null],
      name: [null, [Validators.required]],
      address: [null],
      amount: [null, [Validators.required]],
      status: true,
      update: fnsFormat(new Date(), `${this.dwDateFormat} ${this.dwTimeFormat}`)
    });

  }
  checkType(): void {
    if (this.validateForm.controls['type'].value === 2) {
      this.validateForm.get('parent').setValidators([Validators.required]);
      this.validateForm.controls['parent'].setValue(null);
      this.validateForm.get('parent').updateValueAndValidity();
    } else {
      this.validateForm.get('parent').setValidators(null);
      this.validateForm.controls['parent'].setValue(null);
      this.validateForm.get('parent').updateValueAndValidity();
    }
  }

  toOptions(): void {
    this._originData.forEach(elem => {
      const obj = {
        value: elem.key,
        label: elem.name
      };
      if (elem.hasOwnProperty('children')) {
        obj['children'] = childrenOptons(elem.children);
      } else {
        obj['isLeaf'] = true;
      }
      this.typeOptions.push(obj);
    });

    console.log(this._originData);
    function childrenOptons(elements: any): any[] {
      const ar: any[] = [];
      elements.forEach(elem => {
        const obj = {
          value: elem.key,
          label: elem.name
        };
        if (elem.hasOwnProperty('children')) {
          obj['children'] = childrenOptons(elem.children);
        } else {
          obj['isLeaf'] = true;
        }
        ar.push(obj);
      });
      return ar;
    }
  }
  typeChange(value: any): void {
    console.log(value);
  }
  getFormControl(name: string): AbstractControl {
    return this.validateForm.controls[name];
  }
}
