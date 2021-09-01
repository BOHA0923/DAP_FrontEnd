import { Component, forwardRef, SkipSelf, Optional } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators, ValidatorFn, AbstractControl, FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { DwMessageService } from 'ng-quicksilver/message';

import { IDwHomeSettingTabs, IDwHomeSettingProgramOptions } from '../interface/dw-home-setting.interface';
import { DwComponent } from '@webdpt/components/redevelop';
import {
  DwProgramInfoLangLoaderService,
  DwLanguagePreService
} from '@webdpt/framework/program-info';
import {
  DwProgramInfoListJsonService,
  IDwOperationParamData,
  IDwOperationMap
} from '@webdpt/framework/operation';
import { DwLanguageService } from '@webdpt/framework/language';
import { DwDapHttpClient } from '@webdpt/framework/dap';
import { DwCreateService } from '@webdpt/framework/document';
import { DwFinereportRepository } from '@webdpt/framework/finereport-core';
import {
  DwActionAuthorizedService,
  DwAuthPermissionInfoService,
  IDwAuthorizedList
} from '@webdpt/framework/auth';
import { DwIamRepository } from '@webdpt/framework/iam';

@Component({
  selector: 'app-dw-home-setting-list',
  templateUrl: './dw-home-setting-list.component.html',
  styleUrls: ['./dw-home-setting-list.component.less'],
  providers: [
    {
      provide: DwComponent, useExisting: forwardRef(() => DwHomeSettingListComponent)
    }
  ]
})
export class DwHomeSettingListComponent extends DwComponent {
  private tenantAuthorized = 'disabled'; // 共用首頁功能權限 allow ,hidden ,disabled
  private userLevel = 'user'; // 個人首頁 for api 識別
  private tenantLevel = 'common'; // 共用首頁 for api 識別
  public programPre = this.dwLanguagePreService.program;
  public userCfgForm: FormGroup;
  public tenantCfgForm: FormGroup;
  public tabs: IDwHomeSettingTabs[] = [];
  public tabIndex: number;
  // public externalUrlValidators = [Validators.required, Validators.pattern('https?://.+')];
  private presetConfig = {
    homeType: 'preset',
    homeProgramId: '',
    homeExternalUrl: '',
    homeParameter: [],
    programSearchValue: '',
    menuType: '',
    programOptions: [],
    viewHiddenParameter: true,
    fixparam: []
  };

  constructor(
    @SkipSelf() @Optional() _parentDwComponent: DwComponent,
    public fb: FormBuilder,
    private http: DwDapHttpClient,
    private programInfoListJsonService: DwProgramInfoListJsonService,
    private programInfoLangLoaderService: DwProgramInfoLangLoaderService,
    private sysReportRepository: DwFinereportRepository,
    private languageService: DwLanguageService,
    private dwLanguagePreService: DwLanguagePreService,
    private dwIamRepository: DwIamRepository,
    private dwAuthPermissionInfoService: DwAuthPermissionInfoService,
    private actionAuthorizedService: DwActionAuthorizedService, // 提供功能權限資料來源
    private createService: DwCreateService,
    private translateService: TranslateService,
    private messageService: DwMessageService
  ) {
    super(_parentDwComponent);
  }

  afterContentInit(): void { }

  afterViewInit(): void { }

  onInit(): void {
    this.tabIndex = 0;
    this.tabs = [
      {
        active: true,
        id: 'user-cfg', // 個人首頁
        nameId: 'dw-home-setting-user-cfg',
        icon: 'user',
        disabled: false,
        init: false,
        level: this.userLevel
      }
    ];

    const tabTenant: IDwHomeSettingTabs = {
      active: false,
      id: 'tenant-cfg', // 共用首頁
      nameId: 'dw-home-setting-tenant-cfg',
      icon: 'home',
      disabled: false,
      init: false,
      level: this.tenantLevel
    };

    this.userCfgForm = this.fb.group(
      {
        'cfgLevel': [this.userLevel],
        'homeType': [this.presetConfig.homeType, [Validators.required]],
        'homeProgramId': [this.presetConfig.homeProgramId, [Validators.required]],
        'homeExternalUrl': [this.presetConfig.homeExternalUrl],
        'homeParameter': new FormArray(JSON.parse(JSON.stringify(this.presetConfig.homeParameter))),
        'programSearchValue': [this.presetConfig.programSearchValue],
        'menuType': [this.presetConfig.menuType],
        'programOptions': [JSON.parse(JSON.stringify(this.presetConfig.programOptions))],
        'viewHiddenParameter': [this.presetConfig.viewHiddenParameter],
        'fixparam': new FormArray(JSON.parse(JSON.stringify(this.presetConfig.fixparam)))
      }
    );
    this.userCfgForm.get('homeProgramId').setValidators([this.userHomeProgramIdValidator()]);
    this.userCfgForm.get('homeExternalUrl').setValidators([this.userHomeExternalUrlValidator()]);
    this.typeChangeSubscribe(this.userCfgForm);
    this.programIdChangeSubscribe(this.userCfgForm);
    this.externalUrlChangeSubscribe(this.userCfgForm);

    this.userCfgGetProgramOptions(this.userCfgForm).subscribe(
      programOptions => {
        this.userCfgForm.get('programOptions').setValue(programOptions);
        this.selectedIndexChange(this.tabIndex);
      }
    );

    this.tenantCfgForm = this.fb.group(
      {
        'cfgLevel': [this.tenantLevel],
        'homeType': [this.presetConfig.homeType, [Validators.required]],
        'homeProgramId': [this.presetConfig.homeProgramId, [Validators.required]],
        'homeExternalUrl': [this.presetConfig.homeExternalUrl],
        'homeParameter': new FormArray(JSON.parse(JSON.stringify(this.presetConfig.homeParameter))),
        'programSearchValue': [this.presetConfig.programSearchValue],
        'menuType': [this.presetConfig.menuType],
        'programOptions': [JSON.parse(JSON.stringify(this.presetConfig.programOptions))],
        'viewHiddenParameter': [this.presetConfig.viewHiddenParameter],
        'fixparam': new FormArray(JSON.parse(JSON.stringify(this.presetConfig.fixparam)))
      }
    );

    // 共用首頁功能權限
    const authorizedId = 'dw-home-setting';
    const actionId = 'dw-home-setting-tenant';
    this.actionAuthorizedService.getActionAuth(authorizedId, actionId).subscribe(
      restriction => {
        this.tenantAuthorized = restriction;

        // allow ,hidden ,disabled
        if (this.tenantAuthorized === 'allow') {
          this.tenantCfgForm.get('homeProgramId').setValidators([this.tenantHomeProgramIdValidator()]);
          this.tenantCfgForm.get('homeExternalUrl').setValidators([this.tenantHomeExternalUrlValidator()]);
          this.typeChangeSubscribe(this.tenantCfgForm);
          this.programIdChangeSubscribe(this.tenantCfgForm);
          this.externalUrlChangeSubscribe(this.tenantCfgForm);

          this.tenantCfgGetProgramOptions(this.tenantCfgForm).subscribe(
            programOptions => {
              this.tenantCfgForm.get('programOptions').setValue(programOptions);
            }
          );

          this.tabs.push(tabTenant);
        } else if (this.tenantAuthorized === 'disabled') {
          tabTenant.disabled = true;
          this.tabs.push(tabTenant);
        }
      }
    );
  }

  onDestroy(): void { }

  private initForm(cfgForm: FormGroup): void {
    cfgForm.get('homeType').setValue(this.presetConfig.homeType);
    cfgForm.get('homeProgramId').setValue(this.presetConfig.homeProgramId);
    cfgForm.get('homeExternalUrl').setValue(this.presetConfig.homeExternalUrl);
    cfgForm.get('homeParameter').setValue(JSON.parse(JSON.stringify(this.presetConfig.homeParameter)));
    cfgForm.get('programSearchValue').setValue(this.presetConfig.programSearchValue);
    cfgForm.get('menuType').setValue(this.presetConfig.menuType);
    // cfgForm.get('programOptions').setValue(JSON.parse(JSON.stringify(this.presetConfig.programOptions)));
    cfgForm.get('viewHiddenParameter').setValue(this.presetConfig.viewHiddenParameter);
    cfgForm.get('fixparam').setValue(JSON.parse(JSON.stringify(this.presetConfig.fixparam)));
  }

  public initData(dataLevel: string): void {
    this.getMyHome(dataLevel).subscribe(
      response => {
        const myhome: Array<any> = response.data.dw_myhome;
        const myhome_parameter: Array<any> = response.data.dw_myhome_parameter || [];
        let level = '';
        let homeType = '';
        let path = '';

        myhome.forEach(
          master => {
            level = master.level;

            // 設定介面的作業等於作業和報表，寫入和讀取都要轉換
            // 首頁型態。作業='program', 'fineReport':報表, 外部網頁(另開)='externalUrl'
            if (master.type === 'fineReport') {
              homeType = 'program';
            } else {
              homeType = master.type;
            }

            path = master.path;
          }
        );

        let cfgForm: FormGroup;

        if (level === '') {
          level = dataLevel;
        }

        if (level === this.userLevel) {
          cfgForm = this.userCfgForm;
        } else if (level === this.tenantLevel) {
          cfgForm = this.tenantCfgForm;
        }

        // 原始狀態
        cfgForm.get('homeProgramId').markAsPristine();
        cfgForm.get('homeParameter').markAsPristine();
        cfgForm.get('homeExternalUrl').markAsPristine();

        // 有取到資料
        if (homeType) {
          cfgForm.get('homeType').setValue(homeType);

          if (homeType === 'program') {
            cfgForm.get('homeProgramId').setValue(path);
            this.programIdChange(cfgForm, path, false, myhome_parameter);
          } else if (homeType === 'externalUrl') {
            cfgForm.get('homeExternalUrl').setValue(path);
          }
        } else {
          this.initForm(cfgForm);
        }
      }
    );
  }
  public selectedIndexChange(idx: number): void {
    this.tabIndex = idx;
    const currentTab = this.tabs[idx];

    if (currentTab) {
      // 資料初始化
      if (!currentTab.init) {
        this.initData(currentTab.level);
        currentTab.init = true;
      }
    }
  }

  /**
   * 首頁類型改變
   * preset：預設, program：作業, externalUrl：連結網址
   */
  private typeChange(cfgForm: FormGroup, typeValue: string): void {
    const progCtl = cfgForm.get('homeProgramId');
    const urlCtl = cfgForm.get('homeExternalUrl');

    switch (typeValue) {
      case 'program':
        urlCtl.reset(this.presetConfig.homeExternalUrl);
        urlCtl.setErrors(null);
        break;

      case 'externalUrl':
        if (!urlCtl.dirty) {
          urlCtl.markAsDirty();
          urlCtl.updateValueAndValidity();
        }

        progCtl.reset(this.presetConfig.homeProgramId);
        progCtl.setErrors(null);
        this.deleteAllParameter(cfgForm);
        break;

      default:
        progCtl.reset(this.presetConfig.homeProgramId);
        progCtl.setErrors(null);
        this.deleteAllParameter(cfgForm);
        urlCtl.reset(this.presetConfig.homeExternalUrl);
        urlCtl.setErrors(null);
        break;
    }
  }

  private typeChangeSubscribe(cfgForm: FormGroup): void {
    cfgForm.get('homeType').valueChanges.subscribe(
      typeValue => {
        this.typeChange(cfgForm, typeValue);
      }
    );
  }

  /**
   * 單身加入一筆資料的Form欄位校驗控制
   */
  private paramAddFieldControlRow(cfgForm: FormGroup, nameVal: string, valueVal: string): void {
    const editParameter: FormArray = cfgForm.get('homeParameter') as FormArray;

    if (cfgForm.get('cfgLevel').value === this.tenantLevel) {
      const fGroup = new FormGroup({
        'name': new FormControl(nameVal, [Validators.required, this.tenantParameterNameValidator()]),
        'value': new FormControl(valueVal, Validators.required)
      });

      editParameter.push(fGroup);
    } else {
      const fGroup = new FormGroup({
        'name': new FormControl(nameVal, [Validators.required, this.userParameterNameValidator()]),
        'value': new FormControl(valueVal, Validators.required)
      });

      editParameter.push(fGroup);
    }
  }

  /**
   * 刪除參數
   */
  public formArrayDelete(fArr: FormArray, idx: number): void {
    fArr.removeAt(idx);
  }

  /**
   * 刪除全部參數
   */
  private deleteAllParameter(cfgForm: FormGroup): void {
    const fixparam = cfgForm.get('fixparam') as FormArray;
    const homeParameter = cfgForm.get('homeParameter') as FormArray;

    while (fixparam.controls.length > 0) {
      this.formArrayDelete(fixparam, 0);
    }

    while (homeParameter.controls.length > 0) {
      this.formArrayDelete(homeParameter, 0);
    }
  }

  private getMenuType(cfgForm: FormGroup, programId: string): string {
    let menuType = '';

    const programOptionsCtlVal: IDwHomeSettingProgramOptions[] = cfgForm.get('programOptions').value;
    const len = programOptionsCtlVal.length;

    for (let i = 0; i < len; i++) {
      if (programOptionsCtlVal[i].key === programId) {
        menuType = programOptionsCtlVal[i].menuType;
        break;
      }
    }

    return menuType;
  }

  private programIdChange(cfgForm: FormGroup, programId: string, resetParam: boolean, setParam: IDwOperationParamData[]): void {
    const mustType = 'program';
    const homeTypeCtl = cfgForm.get('homeType');
    const fixparam = cfgForm.get('fixparam') as FormArray;

    const menuType = this.getMenuType(cfgForm, programId);
    cfgForm.get('menuType').setValue(menuType);

    // 先清空參數
    this.deleteAllParameter(cfgForm);

    if (cfgForm.get('menuType').value === 'fineReport') {
      this.sysReportRepository.getReport(programId).subscribe(
        response => {
          const data = response.data;

          if (data) {
            // 再清空參數，可能因非同步導致取回資料時，前面也回傳設定資料了
            this.deleteAllParameter(cfgForm);

            if (data.hasOwnProperty('fixparam')) {
              data.fixparam.forEach(
                (param: IDwOperationParamData) => {
                  const fGroup = new FormGroup({
                    'name': new FormControl(param.name),
                    'value': new FormControl(param.value)
                  });

                  fixparam.push(fGroup);
                }
              );
            }

            // 是否重取變動參數
            if (resetParam) {
              if (data.hasOwnProperty('parameter')) {
                data.parameter.forEach(
                  (param: IDwOperationParamData) => {
                    const listRow: IDwOperationParamData = {
                      'name': param.name,
                      'value': param.value
                    };

                    this.paramAddFieldControlRow(cfgForm, listRow.name, listRow.value);
                  }
                );
              }
            } else {
              setParam.forEach(
                (param: IDwOperationParamData) => {
                  const listRow: IDwOperationParamData = {
                    'name': param.name,
                    'value': param.value
                  };

                  this.paramAddFieldControlRow(cfgForm, listRow.name, listRow.value);
                }
              );
            }
          }
        }
      );

      cfgForm.get('viewHiddenParameter').setValue(false);
    } else {
      cfgForm.get('viewHiddenParameter').setValue(true);
    }

    if (programId && homeTypeCtl.value !== mustType) {
      homeTypeCtl.setValue(mustType);
    }
  }

  private programIdChangeSubscribe(cfgForm: FormGroup): void {
    cfgForm.get('homeProgramId').valueChanges.subscribe(
      value => {
        // 使用者點選改值才需要重取報表參數。避免和程式自動改值時併發，造成非同步問題
        if (cfgForm.get('homeProgramId').dirty) {
          this.programIdChange(cfgForm, value, true, []);
        }
      }
    );
  }

  private externalUrlChange(cfgForm: FormGroup, urlValue: string): void {
    const mustType = 'externalUrl';
    const homeTypeCtl = cfgForm.get('homeType');

    if (urlValue && homeTypeCtl.value !== mustType) {
      homeTypeCtl.setValue(mustType);
      cfgForm.get('homeExternalUrl').updateValueAndValidity();
    }
  }

  private externalUrlChangeSubscribe(cfgForm: FormGroup): void {
    cfgForm.get('homeExternalUrl').valueChanges.subscribe(
      value => {
        this.externalUrlChange(cfgForm, value);
      }
    );
  }

  /**
   * 取得作業清單(使用者有權限的清單)
   * for 個人首頁
   */
  public userCfgGetProgramOptions(cfgForm: FormGroup): Observable<IDwHomeSettingProgramOptions[]> {
    const resultObs = Observable.create(
      (observer: any) => {
        const languageOption = this.languageService.currentLanguage;
        const programOptions: IDwHomeSettingProgramOptions[] = [];
        const _dwProgramInfoFrameworkJson = this.programInfoListJsonService.dwProgramInfoFrameworkJson;

        this.dwAuthPermissionInfoService.authorizedList$.subscribe(
          response => {
            if (response) {
              const authorizedList = <IDwAuthorizedList>response;

              this.programInfoListJsonService.programListJsonMap$.subscribe(
                (programListJsonMap: IDwOperationMap) => {
                  this.programInfoLangLoaderService.getTranslation(languageOption).subscribe(
                    (translation: any) => {
                      Object.keys(programListJsonMap).forEach(
                        key => {
                          // 平台架構作業不用列
                          let show = true;
                          _dwProgramInfoFrameworkJson.forEach(
                            frameworkProgram => {
                              if (key === frameworkProgram.id) {
                                show = false;
                              }
                            }
                          );

                          if (show) {
                            show = false;
                            // 檢查使用者有權限的清單
                            if (authorizedList[key] !== undefined) {
                              show = true;
                            }
                          }

                          if (show) {
                            const name = translation[key] + ' (' + key + ')';
                            programOptions.push(
                              {
                                check: false,
                                menuType: 'program',
                                key: key, // 作業編號或報表編號
                                // type: programListJsonMap[key].type,
                                name: name,
                                isMatched: true
                              }
                            );
                          }
                        }
                      );

                      this.sysReportRepository.language(languageOption).subscribe(
                        (reportList: any) => {
                          Object.keys(reportList).forEach(
                            key => {
                              let show = false;
                              // 檢查使用者有權限的清單
                              if (authorizedList[key] !== undefined) {
                                show = true;
                              }

                              if (show) {
                                const rItem = reportList[key];
                                programOptions.push(
                                  {
                                    check: false,
                                    menuType: 'fineReport',
                                    key: key, // 作業編號或報表編號
                                    // type: '',
                                    name: rItem,
                                    isMatched: true
                                  }
                                );
                              }
                            }
                          );

                          observer.next(programOptions);
                          observer.complete();
                        },
                        error => {
                          observer.next(programOptions);
                          observer.complete();
                        }
                      );
                    }
                  );
                }
              );
            }
          },
          error => {
            console.log(error);
            observer.next(programOptions);
            observer.complete();
          }
        );
      }
    );

    return resultObs;
  }

  /**
   * 取得作業清單(作業授權清單)
   * for 共用首頁
   */
  public tenantCfgGetProgramOptions(cfgForm: FormGroup): Observable<IDwHomeSettingProgramOptions[]> {
    const resultObs = Observable.create(
      (observer: any) => {
        const languageOption = this.languageService.currentLanguage;
        const programOptions: IDwHomeSettingProgramOptions[] = [];
        const _dwProgramInfoFrameworkJson = this.programInfoListJsonService.dwProgramInfoFrameworkJson;

        this.dwIamRepository.permissionUserActions().subscribe(
          iamPua => {
            if (iamPua.hasOwnProperty('actions')) {
              const iamAct: Array<any> = Object.assign([], iamPua.actions);
              const iamActLen = iamAct.length;

              this.programInfoListJsonService.programListJsonMap$.subscribe(
                (programListJsonMap: IDwOperationMap) => {
                  this.programInfoLangLoaderService.getTranslation(languageOption).subscribe(
                    (translation: any) => {
                      Object.keys(programListJsonMap).forEach(
                        key => {
                          // 平台架構作業不用列
                          let show = true;
                          _dwProgramInfoFrameworkJson.forEach(
                            frameworkProgram => {
                              if (key === frameworkProgram.id) {
                                show = false;
                              }
                            }
                          );

                          if (show) {
                            show = false;
                            // 檢查用戶授權模組行為(作業授權清單)
                            for (let i = 0; i < iamActLen; i++) {
                              if (key === iamAct[i].id) {
                                show = true;
                                break;
                              }
                            }
                          }

                          if (show) {
                            const name = translation[key] + ' (' + key + ')';
                            programOptions.push(
                              {
                                check: false,
                                menuType: 'program',
                                key: key, // 作業編號或報表編號
                                // type: programListJsonMap[key].type,
                                name: name,
                                isMatched: true
                              }
                            );
                          }
                        }
                      );

                      this.sysReportRepository.language(languageOption).subscribe(
                        (reportList: any) => {
                          Object.keys(reportList).forEach(
                            key => {
                              let show = false;
                              // 檢查用戶授權模組行為(作業授權清單)
                              for (let i = 0; i < iamActLen; i++) {
                                if (key === iamAct[i].id) {
                                  show = true;
                                  break;
                                }
                              }

                              if (show) {
                                const rItem = reportList[key];
                                programOptions.push(
                                  {
                                    check: false,
                                    menuType: 'fineReport',
                                    key: key, // 作業編號或報表編號
                                    // type: '',
                                    name: rItem,
                                    isMatched: true
                                  }
                                );
                              }
                            }
                          );

                          observer.next(programOptions);
                          observer.complete();
                        }
                      );
                    }
                  );
                }
              );
            }
          },
          error => {
            console.log(error);
            observer.next(programOptions);
            observer.complete();
          }
        );
      }
    );

    return resultObs;
  }

  /**
   * 作業搜尋
   */
  public programSearch(cfgForm: FormGroup): void {
    const programOptions: IDwHomeSettingProgramOptions[] = cfgForm.get('programOptions').value;
    const programSearchValue = cfgForm.controls['programSearchValue'].value;

    programOptions.forEach(
      (option: { key: string; name: string; check: boolean; isMatched: boolean; }) => {
        const key: string = option.key;
        const name: string = option.name;

        option.check = false;

        if (programSearchValue === '') {
          option.isMatched = true;
        } else if (key.indexOf(programSearchValue, 0) >= 0) {
          option.isMatched = true;
        } else if (name.indexOf(programSearchValue, 0) >= 0) {
          option.isMatched = true;
        } else {
          option.isMatched = false;
        }
      }
    );

    cfgForm.get('programOptions').setValue(programOptions);
  }

  /**
   * 取得自定義首頁
   *
   * @param level 首頁層級,'common':共用, 'user':用戶自身, '':用戶使用的自定義首頁
   */
  private getMyHome(level: string): Observable<any> {
    const param = {
      params: {
        level: level
      }
    };

    return this.http.post('restful/service/DWSys/IMyHomeService/get', param);
  }

  /**
   * 取消，並且重新顯示畫面值
   */
  public cfgCancel(dataLevel: string): void {
    this.initData(dataLevel);
  }

  /**
   * 保存
   * 預設：就是不用設定：刪除
   * 作業或連結網址：先刪除再新增
   */
  public cfgSave(level: string, cfgForm: FormGroup): void {
    let chk = true; // 檢查執行權限

    // 共用首頁是否有權限
    if (level === this.tenantLevel) {
      if (this.tenantAuthorized !== 'allow') {
        chk = false;
      }
    }

    if (chk) {
      const homeType = cfgForm.get('homeType').value;
      const menuType = cfgForm.get('menuType').value;
      let path = '';

      const apiParams = {
        dw_myhome: [ // 类型：Array  必有字段  备注：table name
          { // 先刪除
            $state: 'D',
            level: level
          }
        ],
        dw_myhome_parameter: [] // 參數
      };

      if (homeType && homeType !== this.presetConfig.homeType) { // 預設就是不用設定
        // 新增或修改
        const state = 'c';
        let type = homeType;

        if (homeType === 'program') {
          path = cfgForm.get('homeProgramId').value;
          type = menuType; // 設定介面的作業等於作業和報表，寫入和讀取都要轉換
        } else if (homeType === 'externalUrl') {
          path = cfgForm.get('homeExternalUrl').value;
        }

        const upd = { // 再新增
          level: level, // common:共用,user:用戶自訂
          $state: state, // c:新增, u:更新
          type: type, // 首頁型態。作業='program', 'fineReport':報表, 外部網頁(另開)='externalUrl'
          path: path // 1.作業id,type 為program/report時 2.外部連結,type 為externalUr
        };

        apiParams.dw_myhome.push(upd);

        const parameter = cfgForm.get('homeParameter') as FormArray;
        parameter.controls.forEach(
          fGroupParameter => {
            const pItem = {
              $state: state, // c:新增, u:更新
              level: level, // 首頁層級
              name: fGroupParameter.get('name').value, // 參數名稱
              value: fGroupParameter.get('value').value // 參數值
            };

            apiParams.dw_myhome_parameter.push(pItem);
          }
        );
      }

      this.createService.create('restful/service/DWSys/IMyHomeService/post', apiParams).subscribe(
        response => {
          if (response.success) {
            const msg = this.translateService.instant('dw-home-setting-msg-updated');
            this.messageService.create('success', `${msg}`);
          } else {
            const msg = this.translateService.instant('dw-home-setting-msg-updateFailed');
            this.messageService.create('error', `${msg}`);
          }
        },
        error => {
          console.log(error);
          const msg = this.translateService.instant('dw-home-setting-msg-updateFailed');
          this.messageService.create('error', `${msg}`);
        }
      );
    }
  }

  // for Validator
  get userHomeType(): AbstractControl {
    return this.userCfgForm.get('homeType');
  }

  private userHomeProgramIdValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const ctlValue = control.value;
      let validationErrors = { 'userHomeProgramIdValidator': { value: ctlValue } };

      const homeTypeCtl = this.userHomeType;

      if (homeTypeCtl.value === 'program') {
        if (ctlValue) {
          validationErrors = null;
        }
      } else {
        validationErrors = null;
      }

      return validationErrors;
    };
  }

  private userHomeExternalUrlValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const ctlValue = control.value;
      let validationErrors = { 'userHomeExternalUrlValidator': { value: ctlValue } };

      const homeTypeCtl = this.userHomeType;

      if (homeTypeCtl.value === 'externalUrl') {
        if (ctlValue) {
          const reg = new RegExp('https?://.+');

          if (reg.test(ctlValue)) {
            validationErrors = null;
          }
        }
      } else {
        validationErrors = null;
      }

      return validationErrors;
    };
  }

  /**
   * 參數名稱校驗器
   */
  userParameterNameValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      let validationErrors = null;
      if (control.value) {
        const name = control.value;
        let count = 0;

        const fixparam = this.userCfgForm.get('fixparam') as FormArray;
        fixparam.controls.forEach(
          fGroupParameter => {
            if (fGroupParameter.get('name').value === name) {
              count = count + 1;
            }
          }
        );

        const parameter = this.userCfgForm.get('homeParameter') as FormArray;
        parameter.controls.forEach(
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

  // for Validator
  get tenantHomeType(): AbstractControl {
    return this.tenantCfgForm.get('homeType');
  }

  private tenantHomeProgramIdValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const ctlValue = control.value;
      let validationErrors = { 'tenantHomeProgramIdValidator': { value: ctlValue } };

      const homeTypeCtl = this.tenantHomeType;

      if (homeTypeCtl.value === 'program') {
        if (ctlValue) {
          validationErrors = null;
        }
      } else {
        validationErrors = null;
      }

      return validationErrors;
    };
  }

  private tenantHomeExternalUrlValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const ctlValue = control.value;
      let validationErrors = { 'tenantHomeExternalUrlValidator': { value: ctlValue } };

      const homeTypeCtl = this.tenantHomeType;

      if (homeTypeCtl.value === 'externalUrl') {
        if (ctlValue) {
          const reg = new RegExp('https?://.+');

          if (reg.test(ctlValue)) {
            validationErrors = null;
          }
        }
      } else {
        validationErrors = null;
      }

      return validationErrors;
    };
  }

  /**
   * 參數名稱校驗器
   */
  tenantParameterNameValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      let validationErrors = null;
      if (control.value) {
        const name = control.value;
        let count = 0;

        const fixparam = this.tenantCfgForm.get('fixparam') as FormArray;
        fixparam.controls.forEach(
          fGroupParameter => {
            if (fGroupParameter.get('name').value === name) {
              count = count + 1;
            }
          }
        );

        const parameter = this.tenantCfgForm.get('homeParameter') as FormArray;
        parameter.controls.forEach(
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
}
