import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

const options = [{
  value: 'zhejiang',
  label: '浙江',
  children: [{
    value: 'hangzhou',
    label: '杭州市',
    children: [{
      value: 'xihu',
      label: '西湖',
      isLeaf: true
    }]
  }, {
    value: 'ningbo',
    label: '寧波市',
    isLeaf: true
  }]
}, {
  value: 'jiangsu',
  label: '江蘇',
  children: [{
    value: 'nanjing',
    label: '南京市',
    children: [{
      value: 'zhonghuamen',
      label: '中華門',
      isLeaf: true
    }]
  }]
}];

@Component({
  selector: 'dw-cascader-base',
  template: `
    <dw-form-cascader
      dwLabel="地區"
      dwLabelSm="4"
      dwInputSm="20"
      [dwOptions]="dwOptions"
      [(ngModel)]="values"
      dwPlaceHolder="請選擇地區"></dw-form-cascader>
  `
})
export class CascaderBaseComponent implements OnInit {

  /** init data */
  public dwOptions = null;

  /** ngModel value */
  public values: any[] = ['zhejiang', 'hangzhou', 'xihu'];

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      'values': null
    });
  }

  ngOnInit(): void {
    // let's set dwOptions in a asynchronous way
    setTimeout(() => {
      this.dwOptions = options;
    }, 100);
  }

  anyChange(event: any): void {
    console.log(event);
  }
}
