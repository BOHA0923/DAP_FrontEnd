import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, FormControl, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { DwModalRef } from 'ng-quicksilver/modal';
import { DwModalService } from 'ng-quicksilver/modal';

import { openModeOptions } from '../../model/enum';
import { DwTMenuParamUModel, DwSysMenuNodeUpdateModel, DwTMenuLangUModel } from '../../model/menu.model';
import { DwSysMenuIconService } from '../../service/menu-icon.service';
import { DwProgramInfoLangLoaderService } from '@webdpt/framework/program-info';
import {
  DwUpdateService, UPDATE, CREATE, DELETE
} from '@webdpt/framework/document';
import { DwSysMenuEditNameComponent } from '../dw-sys-menu-edit-name/dw-sys-menu-edit-name.component';
import { IDwSysMenuEditNameModel } from '../../model/edit-name.model';
import { DwFinereportRepository } from '@webdpt/framework/finereport-core';

@Component({
  selector: 'app-dw-sys-menu-edit',
  templateUrl: './dw-sys-menu-edit.component.html',
  styleUrls: [
    '../../dw-sys-menu-list/dw-sys-menu-list.component.less',
    './dw-sys-menu-edit.component.less'
  ]
})
export class DwSysMenuEditComponent implements OnInit {
  public menuEditForm: FormGroup;
  public master = {
    version: 0,
    languageOption: '',
    type: '',
    code: '',
    codeName: '',
    fixparam: [],
    parameterAshcan: [] // 原有資料刪除時先放資源回收桶
  };
  private _dataSource: any;
  public viewHidden = {
    code: true,
    editDefaultExpand: true,
    editExternalUrl: true,
    editOpenMode: true,
    editMenuParameter: true
  };
  private editNameValidators: any;

  public openModeOptions = openModeOptions; // 開啟方式下拉選單

  @Input()
  set languageOption(languageOption: string) {
    this.master.languageOption = languageOption;
  }

  @Input()
  set type(type: string) {
    this.master.type = type;
  }

  @Input()
  set dataSource(dataSource: any) {
    this._dataSource = dataSource;
  }

  constructor(
    public fb: FormBuilder,
    private modalSubject: DwModalRef,
    private sysMenuIconService: DwSysMenuIconService,
    private programInfoLangLoaderService: DwProgramInfoLangLoaderService,
    private sysReportRepository: DwFinereportRepository,
    private updateService: DwUpdateService,
    private modalService: DwModalService,
    private translateService: TranslateService
  ) {
  }

  ngOnInit(): void {
    this.master.version = this._dataSource.version;
    this.master.code = this._dataSource.code;
    const paramInitList = [];

    const nameInitList = [];
    const menuLangList: Array<any> = this._dataSource.child.dw_menu_language;
    let isExistMainName = false; // 主要編輯的語言別是否有資料

    menuLangList.forEach(
      item => {
        if (item.language === this.master.languageOption) {
          isExistMainName = true;
        }

        const nameInit = new DwTMenuLangUModel();
        // nameInit.menu_id = this._dataSource.id; // 節點編號
        // nameInit.$state = UPDATE;
        nameInit.language = item.language;
        nameInit.name = item.name;

        nameInitList.push(nameInit);
      }
    );

    if (!isExistMainName) {
      const nameInit = new DwTMenuLangUModel();
      nameInit.language = this.master.languageOption;
      nameInit.name = '';

      nameInitList.push(nameInit);
    }

    this.editNameValidators = [];
    let editDefaultExpandValidators = [];
    let editExternalUrlValidators = [];
    let editOpenModeValidators = [];

    switch (this.master.type) {
      case 'category':
        this.editNameValidators = [Validators.required];
        editDefaultExpandValidators = [Validators.required];
        break;

      case 'program':
        break;

      case 'fineReport':
        break;

      case 'externalUrl':
        this.editNameValidators = [Validators.required];
        editExternalUrlValidators = [Validators.required];
        editOpenModeValidators = [Validators.required];
        break;

      default:
    }

    this.menuEditForm = this.fb.group({
      'editIconClass': [this._dataSource.icon_class],
      'editDefaultExpand': [this._dataSource.default_expand, editDefaultExpandValidators],
      'editExternalUrl': [this._dataSource.url, editExternalUrlValidators],
      'editOpenMode': [this._dataSource.open_mode, editOpenModeValidators],
      'editMenuLanguage': new FormArray([]),
      'editMenuParameter': new FormArray([])
    });

    this.nameFieldControlInit(this.editMenuLanguage, nameInitList, this.editNameValidators);

    switch (this.master.type) {
      case 'category':
        this.viewHidden.editDefaultExpand = false;
        break;

      case 'program':
        this.viewHidden.code = false;

        this.programInfoLangLoaderService.getTranslation(this.master.languageOption).subscribe(
          (translation: any) => {
            if (translation[this.master.code]) {
              this.master.codeName = translation[this.master.code];
            }
          }
        );

        break;

      case 'fineReport':
        this.viewHidden.code = false;
        this.viewHidden.editMenuParameter = false;

        this.sysReportRepository.getReport(this.master.code).subscribe(
          response => {
            const data = response.data;
            if (data) {
              if (data.hasOwnProperty('languages')) {
                for (let i = 0; i < data.languages.length; i++) {
                  if (data.languages[i].language === this.master.languageOption) {
                    this.master.codeName = data.languages[i].name;
                  }
                }
              }

              if (data.hasOwnProperty('fixparam')) {
                this.master.fixparam = Object.assign([], data.fixparam);
              }

              if (data.hasOwnProperty('parameter')) {
                data.parameter.forEach(
                  param => {
                    const paramU = new DwTMenuParamUModel();
                    paramU.$state = '';
                    paramU.menu_id = this._dataSource.id;
                    paramU.name = param.name;
                    paramU.value = param.value;

                    const sourceParamLen = this._dataSource.child.dw_menu_parameter.length;
                    for (let i = 0; i < sourceParamLen; i++) {
                      const source = this._dataSource.child.dw_menu_parameter[i];
                      if (source.name === paramU.name) {
                        paramU.$state = UPDATE;
                        paramU.value = source.value;
                        break;
                      }
                    }

                    paramInitList.push(paramU);
                  }
                );

                this._dataSource.child.dw_menu_parameter.forEach(
                  source => {
                    let isExistSource = false;
                    const paramLen = paramInitList.length;
                    for (let i = 0; i < paramLen; i++) {
                      if (paramInitList[i].name === source.name) {
                        isExistSource = true;
                        break;
                      }
                    }

                    if (!isExistSource) {
                      const paramU = new DwTMenuParamUModel();
                      paramU.menu_id = this._dataSource.id;
                      paramU.$state = '';
                      paramU.name = source.name;
                      paramU.value = source.value;
                      paramInitList.push(paramU);
                    }
                  }
                );

                this.paramFieldControlInit(this.editMenuParameter, paramInitList);
              }
            }
          }
        );
        break;

      case 'externalUrl':
        this.viewHidden.editExternalUrl = false;
        this.viewHidden.editOpenMode = false;
        break;

      default:
    }
  }

  public menuEditFormSave(): void {
    const dataU: DwSysMenuNodeUpdateModel = new DwSysMenuNodeUpdateModel();
    dataU.version = this._dataSource.version; // 版本號
    // dataU.$state = string;
    dataU.id = this._dataSource.id; // 節點編號
    dataU.type = this._dataSource.type; // 類型. 目錄='category', 作業='program', 外部網頁(另開)='externalUrl'
    dataU.icon_class = this.menuEditForm.get('editIconClass').value; // 圖示樣式
    dataU.url = this.menuEditForm.get('editExternalUrl').value; // 連結網址。type='externalUrl'時，設定外部網頁網址
    dataU.code = this._dataSource.code; // 參考編號
    dataU.default_expand = this.menuEditForm.get('editDefaultExpand').value; // 預設展開
    dataU.open_mode = this.menuEditForm.get('editOpenMode').value; // 開啟方式

    // 名稱
    dataU.dw_menu_language = [];
    this.editMenuLanguage.controls.forEach(
      fGroup => {
        const dataLangU = new DwTMenuLangUModel();
        dataLangU.menu_id = dataU.id;
        dataLangU.$state = CREATE;
        dataLangU.language = fGroup.get('language').value;
        dataLangU.name = fGroup.get('name').value;
        dataU.dw_menu_language.push(dataLangU);

        const sourceNameLen = this._dataSource.child.dw_menu_language.length;
        for (let i = 0; i < sourceNameLen; i++) {
          const source = this._dataSource.child.dw_menu_language[i];
          if (source.language === dataLangU.language) {
            dataLangU.$state = UPDATE;
            break;
          }
        }
      }
    );

    // 名稱原有資料消失表示刪除
    this._dataSource.child.dw_menu_language.forEach(
      source => {
        let isExistSource = false;
        const paramLen = dataU.dw_menu_language.length;
        for (let i = 0; i < paramLen; i++) {
          if (dataU.dw_menu_language[i].language === source.language) {
            isExistSource = true;
            break;
          }
        }

        if (!isExistSource) {
          const dataLangU = new DwTMenuLangUModel();
          dataLangU.menu_id = dataU.id;
          dataLangU.$state = DELETE;
          dataLangU.language = source.language;
          dataLangU.name = source.name;
          dataU.dw_menu_language.push(dataLangU);
        }
      }
    );

    // 參數
    dataU.dw_menu_parameter = [];
    this.editMenuParameter.controls.forEach(
      fGroup => {
        const dataParamU = new DwTMenuParamUModel();
        dataParamU.menu_id = dataU.id;
        dataParamU.$state = CREATE;
        dataParamU.name = fGroup.get('name').value;
        dataParamU.value = fGroup.get('value').value;
        dataU.dw_menu_parameter.push(dataParamU);

        const sourceParamLen = this._dataSource.child.dw_menu_parameter.length;
        for (let i = 0; i < sourceParamLen; i++) {
          const source = this._dataSource.child.dw_menu_parameter[i];
          if (source.name === dataParamU.name) {
            dataParamU.$state = UPDATE;
            break;
          }
        }
      }
    );

    // 參數原有資料消失表示刪除
    this._dataSource.child.dw_menu_parameter.forEach(
      source => {
        let isExistSource = false;
        const paramLen = dataU.dw_menu_parameter.length;
        for (let i = 0; i < paramLen; i++) {
          if (dataU.dw_menu_parameter[i].name === source.name) {
            isExistSource = true;
            break;
          }
        }

        if (!isExistSource) {
          const dataParamU = new DwTMenuParamUModel();
          dataParamU.menu_id = dataU.id;
          dataParamU.$state = DELETE;
          dataParamU.name = source.name;
          dataParamU.value = source.value;
          dataU.dw_menu_parameter.push(dataParamU);
        }
      }
    );

    // dataU.page = [];
    // dataU.action = [];

    const reqData = {
      dw_menu: dataU
    };

    this.updateService.update('restful/service/DWSys/menu', reqData).subscribe(
      (response: any) => {
        if (response.success) {
          this.master.version = this.master.version + 1;
          this.emitDataOutside();
        }
      }
    );
  }

  /**
   * 確定
   */
  public emitDataOutside(): void {
    this.modalSubject.triggerOk(); // 表示銷毀模式的時候會執行用戶傳入的選項中的onCancel還是的OnOK方法
  }

  /**
   * 取消
   */
  public handleCancel(e: any): void {
    this.modalSubject.triggerCancel();
  }

  public iconClassSelect(fControl: AbstractControl): void {
    this.sysMenuIconService.iconClassSelect(fControl);
  }

  public iconClassDelete(fControl: AbstractControl): void {
    this.sysMenuIconService.iconClassDelete(fControl);
  }

  /**
   * 取得畫面單身
   */
  get editMenuLanguage(): FormArray {
    return this.menuEditForm.get('editMenuLanguage') as FormArray; // Access the FormArray control
  }

  /**
   * 單身Form欄位校驗控制初始化
   */
  private nameFieldControlInit(editMenuLanguage: FormArray, list: DwTMenuLangUModel[], editNameValidators: any): void {
    const len = list.length;
    for (let i = 0; i < len; i++) {
      this.nameAddFieldControlRow(editMenuLanguage, list[i], editNameValidators);
    }
  }

  /**
   * 單身加入一筆資料的Form欄位校驗控制
   */
  private nameAddFieldControlRow(editMenuLanguage: FormArray, listRow: DwTMenuLangUModel, editNameValidators: any): void {
    const fGroup = new FormGroup({
      'language': new FormControl(listRow.language, Validators.required),
      'name': new FormControl(listRow.name, editNameValidators)
    });

    editMenuLanguage.push(fGroup);
  }

  /**
   * 取得畫面單身
   */
  get editMenuParameter(): FormArray {
    return this.menuEditForm.get('editMenuParameter') as FormArray; // Access the FormArray control
  }

  /**
   * 單身Form欄位校驗控制初始化
   */
  private paramFieldControlInit(editMenuParameter: FormArray, list: DwTMenuParamUModel[]): void {
    const len = list.length;
    for (let i = 0; i < len; i++) {
      this.paramAddFieldControlRow(editMenuParameter, list[i]);
    }
  }

  /**
   * 單身加入一筆資料的Form欄位校驗控制
   */
  private paramAddFieldControlRow(editMenuParameter: FormArray, listRow: DwTMenuParamUModel): void {
    const fGroup = new FormGroup({
      '$state': new FormControl(listRow.$state),
      'menu_id': new FormControl(listRow.menu_id),
      'name': new FormControl(listRow.name, [Validators.required, this.parameterNameValidator()]),
      'value': new FormControl(listRow.value, Validators.required)
    });

    editMenuParameter.push(fGroup);
  }

  /**
   * 參數名稱校驗器
   */
  parameterNameValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      let validationErrors = null;
      if (control.value) {
        const name = control.value;
        let count = 0;

        this.master.fixparam.forEach(
          fixparam => {
            if (fixparam.name === name) {
              count = count + 1;
            }
          }
        );

        this.editMenuParameter.controls.forEach(
          fGroupParameter => {
            if (fGroupParameter.get('name').value === name) {
              count = count + 1;
            }
          }
        );

        if (count > 1) {
          validationErrors = { 'nameValidator': { value: control.value } };
        }
      }

      return validationErrors;
    };
  }

  /**
   * 刪除參數
   */
  public editMenuParameterDelete(idx: number): void {
    this.editMenuParameter.removeAt(idx);
  }

  /**
   * 新增參數
   */
  public editMenuParameterAdd(): void {
    const newDetail = new DwTMenuParamUModel();
    newDetail.menu_id = this._dataSource.id;
    this.paramAddFieldControlRow(this.editMenuParameter, newDetail);
  }

  /**
   * 編輯名稱
   */
  public editName(): void {
    const list: IDwSysMenuEditNameModel[] = [];
    this.editMenuLanguage.controls.forEach(
      (ctrl: any) => {
        const listItem: IDwSysMenuEditNameModel = {
          language: ctrl.get('language').value,
          name: ctrl.get('name').value
        };

        list.push(listItem);
      }
    );

    this.modalService.create({
      // dwWidth: 1000,
      dwTitle: this.translateService.instant('dw-sys-menu-name'),
      dwStyle: { top: '20px' },
      dwMaskClosable: false, // 點擊遮罩是否允許關閉
      dwContent: DwSysMenuEditNameComponent,
      dwOnOk: (data: any): void => {
        const ret = data.menuEditNameForm.get('editMenuLanguage').value;

        const len = this.editMenuLanguage.length;
        let i = len - 1;
        while (i >= 0) {
          this.editMenuLanguage.removeAt(i);
          i = i - 1;
        }

        const nameInitList = [];
        ret.forEach(
          retItem => {
            const nameInit = new DwTMenuLangUModel();
            nameInit.menu_id = this._dataSource.id; // 節點編號
            nameInit.$state = UPDATE;
            nameInit.language = retItem.language;
            nameInit.name = retItem.name;

            nameInitList.push(nameInit);
          }
        );

        nameInitList.forEach(
          newName => {
            this.nameAddFieldControlRow(this.editMenuLanguage, newName, this.editNameValidators);
          }
        );
      },
      dwOnCancel(): void { },
      dwFooter: null,
      dwComponentParams: {
        languageOption: this.master.languageOption,
        list: list,
        editNameValidators: this.editNameValidators
      }
    });
  }
}
