import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { DwModalRef } from 'ng-quicksilver/modal';

import { DwTMenuLangUModel } from '../../model/menu.model';
import { DwSysMenuIconService } from '../../service/menu-icon.service';
import { DwProgramInfoLangLoaderService } from '@webdpt/framework/program-info';
import { DwLanguageListService, IDwLanguageList } from '@webdpt/framework/language';
import { DwUpdateService } from '@webdpt/framework/document';
import { IDwSysMenuEditNameModel } from '../../model/edit-name.model';
import { DwFinereportRepository } from '@webdpt/framework/finereport-core';

@Component({
  selector: 'app-dw-sys-menu-edit-name',
  templateUrl: './dw-sys-menu-edit-name.component.html',
  styleUrls: [
    '../../dw-sys-menu-list/dw-sys-menu-list.component.less',
    './dw-sys-menu-edit-name.component.less'
  ]
})
export class DwSysMenuEditNameComponent implements OnInit {
  public menuEditNameForm: FormGroup;
  public master = {
    languageOption: '',
    list: [],
    editNameValidators: []
  };
  public languageList: IDwLanguageList[];

  @Input()
  set languageOption(languageOption: string) {
    this.master.languageOption = languageOption;
  }

  @Input()
  set list(list: IDwSysMenuEditNameModel[]) {
    this.master.list = list;
  }

  @Input()
  set editNameValidators(editNameValidators: any) {
    this.master.editNameValidators = editNameValidators;
  }

  constructor(
    public fb: FormBuilder,
    private modalSubject: DwModalRef,
    private sysMenuIconService: DwSysMenuIconService,
    private programInfoLangLoaderService: DwProgramInfoLangLoaderService,
    private sysReportRepository: DwFinereportRepository,
    private updateService: DwUpdateService,
    private languageListService: DwLanguageListService,
  ) {
  }

  ngOnInit(): void {
    this.languageListService.getLanguagesList().subscribe(
      (list: IDwLanguageList[]) => {
        this.languageList = list;
      }
    );

    this.menuEditNameForm = this.fb.group({
      'editMenuLanguage': new FormArray([])
    });

    // ?????????????????????????????????????????????
    const nameList: DwTMenuLangUModel[] = [];
    this.master.list.forEach(
      item => {
        if (item.language === this.master.languageOption) {
          nameList.unshift(item);
        } else {
          nameList.push(item);
        }
      }
    );

    this.nameFieldControlInit(this.editMenuLanguage, nameList, this.master.editNameValidators);
  }

  /**
   * ??????????????????
   */
  get editMenuLanguage(): FormArray {
    return this.menuEditNameForm.get('editMenuLanguage') as FormArray; // Access the FormArray control
  }

  /**
   * ??????Form???????????????????????????
   */
  private nameFieldControlInit(editMenuLanguage: FormArray, list: DwTMenuLangUModel[], editNameValidators: any): void {
    const len = list.length;
    for (let i = 0; i < len; i++) {
      this.nameAddFieldControlRow(editMenuLanguage, list[i], editNameValidators);
    }
  }

  /**
   * ???????????????????????????Form??????????????????
   */
  private nameAddFieldControlRow(editMenuLanguage: FormArray, listRow: IDwSysMenuEditNameModel, editNameValidators: any): void {
    const fGroup = new FormGroup({
      'language': new FormControl(listRow.language, [Validators.required, this.nameLanguageValidator()]),
      'name': new FormControl(listRow.name, editNameValidators)
    });

    editMenuLanguage.push(fGroup);
  }

  /**
   * ????????????????????????
   */
  nameLanguageValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      let validationErrors = null;
      if (control.value) {
        const language = control.value;
        let count = 0;

        this.editMenuLanguage.controls.forEach(
          fGroup => {
            if (fGroup.get('language').value === language) {
              count = count + 1;
            }
          }
        );

        if (count > 1) {
          validationErrors = {'languageValidator': {value: control.value}};
        }
      }

      return validationErrors;
    };
  }

  public menuEditNameFormSave(): void {
    this.emitDataOutside();
  }

  /**
   * ????????????
   */
  public editMenuLanguageDelete(idx: number): void {
    this.editMenuLanguage.removeAt(idx);
  }

  /**
   * ????????????
   */
  public editMenuLanguageAdd(): void {
    const newDetail: IDwSysMenuEditNameModel = {
      language: '',
      name: ''
    };

    // ?????????????????????????????????????????????
    const len = this.languageList.length;
    for (let i = 0; i < len; i++) {
      let isExist = false;
      this.editMenuLanguage.controls.forEach(
        fGroup => {
          if (fGroup.get('language').value === this.languageList[i].value) {
            isExist = true;
          }
        }
      );

      if (!isExist) {
        newDetail.language = this.languageList[i].value;
        break;
      }
    }

    this.nameAddFieldControlRow(this.editMenuLanguage, newDetail, this.master.editNameValidators);
  }

  /**
   * ??????
   */
  public emitDataOutside(): void {
    this.modalSubject.triggerOk(); // ???????????????????????????????????????????????????????????????onCancel?????????OnOK??????
  }

  /**
   * ??????
   */
  public handleCancel(e: any): void {
    this.modalSubject.triggerCancel();
  }
}
