import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-dynamic-listwin',
  templateUrl: './dynamic-listwin.component.html',
  styleUrls: ['./dynamic-listwin.component.less']
})
export class DynamicListwinComponent implements OnInit {

  public validateForm: FormGroup;
  public datasFormGroup: Array<any>;
  public formGroupValue: any = [];

  constructor(
    private fBuilder: FormBuilder,
    private translateService: TranslateService) {

  }

  ngOnInit(): void {
    this.datasFormGroup = [{
      title: this.translateService.instant('dw-dynamic-listwin-多選'),
      selectWindowId: 'SysQuery_COMPANY_S1',
      resourceUrl: 'showcase/demo1/dynamic-listwin/getDynamicListwinData',
      multiSelect: true,
      controlName: 'SysQuery_COMPANY_S1'
      },
      {
        title: this.translateService.instant('dw-dynamic-listwin-單選'),
        selectWindowId: 'SysQuery_COMPANY_S2',
        resourceUrl: 'showcase/demo1/dynamic-listwin/getDynamicListwinData',
        multiSelect: false,
        controlName: 'SysQuery_COMPANY_S2'
      }
    ];

    // 初始化.
    const formGroupValue = {};
    this.datasFormGroup.forEach(ele => {
      formGroupValue[ele.controlName] =  [];
    });
    this.validateForm = this.fBuilder.group(formGroupValue);

    // 預選值.
    this.validateForm.get('SysQuery_COMPANY_S1').setValue([
      {id: 'c585efad-7cfd-467c-8c1d-551d445d13382', name: '0027员工借款单2'},
      {id: 'c585efad-7cfd-467c-8c1d-551d445d133813', name: '0027员工借款单13'}
    ]);
    this.validateForm.get('SysQuery_COMPANY_S2').setValue([
      'c585efad-7cfd-467c-8c1d-551d445d13382',
      'c585efad-7cfd-467c-8c1d-551d445d133813'
    ]);
  }

  // 取值.
  public getFormGroupValue(): void {
    const formGroupValue = {};
    // tslint:disable-next-line:forin
    for (const i in this.validateForm.controls) {
      formGroupValue[i] = this.validateForm.get(i).value;
    }
    this.formGroupValue = formGroupValue;
  }

  // 利用 EventEmitter 把全部值發送回來.
  public onselectedValue(value: any): void {
    console.log('EventEmitter-value>>>>>>>', value);
  }

  // 清空選取值.
  public clearValue(controlName: string): void {
    this.validateForm.get(controlName).reset([]);
    // setValue 也是可以的.
    // this.validateForm.get(controlName).setValue([]);
  }

}
