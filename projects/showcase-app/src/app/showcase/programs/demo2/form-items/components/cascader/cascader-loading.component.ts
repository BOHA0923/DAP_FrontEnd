import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

const provinces = [{
  value: 'zhejiang',
  label: '浙江'
}, {
  value: 'jiangsu',
  label: '江蘇'
}];

const cities = {
  zhejiang: [{
    value: 'hangzhou',
    label: '杭州市'
  }, {
    value: 'ningbo',
    label: '寧波市',
    isLeaf: true
  }],
  jiangsu: [{
    value: 'nanjing',
    label: '南京市'
  }]
};

const scenicspots = {
  hangzhou: [{
    value: 'xihu',
    label: '西湖',
    isLeaf: true
  }],
  nanjing: [{
    value: 'zhonghuamen',
    label: '中華門',
    isLeaf: true
  }]
};
@Component({
  selector: 'dw-cascader-loading',
  template: `
    <dw-form-cascader
      dwLabel="地區"
      dwLabelSm="4"
      dwInputSm="20"
      [dwLoadData]="loadData"
      [(ngModel)]="values"
      dwPlaceHolder="請選擇地區"></dw-form-cascader>
  `
})
export class CascaderLoadingComponent implements OnInit {

  /** ngModel value */
  public values: any[] ;


  constructor() {}

  ngOnInit(): void {}

  /** load data async execute by `nzLoadData` method */
  public loadData(node: any, index: number): PromiseLike<any> {
    return new Promise((resolve): void => {
      setTimeout(() => {
        if (index < 0) { // if index less than 0 it is root node
          node.children = provinces;
        } else if (index === 0) {
          node.children = cities[node.value];
        } else {
          node.children = scenicspots[node.value];
        }
        resolve();
      }, 1500);
    });
  }
}
