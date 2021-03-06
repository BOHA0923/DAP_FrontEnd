import { Component, forwardRef, HostListener, Optional, SkipSelf, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { DwIamRepository } from '@webdpt/framework/iam';
import { DELETE, DwDeleteService, DwUpdateService, UPDATE } from '@webdpt/framework/document';
import { DwFinereportRepository } from '@webdpt/framework/finereport-core';
import { DwComponent } from '@webdpt/components/redevelop';
import { DwLanguageListService, DwLanguageService, IDwLanguageList } from '@webdpt/framework/language';
import { DwProgramInfoListJsonService, IDwOperationMap } from '@webdpt/framework/operation';
import { DwProgramInfoLangLoaderService } from '@webdpt/framework/program-info';
import { DwFormatBeforeDropEvent } from 'ng-quicksilver/tree';
import { DwFormatEmitEvent } from 'ng-quicksilver/tree';
import { DwMessageService } from 'ng-quicksilver/message';
import { DwModalService } from 'ng-quicksilver/modal';
import { DwTreeComponent } from 'ng-quicksilver/tree';
import { DwTreeNode } from 'ng-quicksilver/tree';
import { Observable, of } from 'rxjs';
import { DwSysMenuEditComponent } from '../modals/dw-sys-menu-edit/dw-sys-menu-edit.component';
import { openModeOptions } from '../model/enum';
import { DwSysMenuNodeCreateModel, DwTMenuLangCModel, IDwSysMenuNode } from '../model/menu.model';
import { DwSysMenuIconService } from '../service/menu-icon.service';
import { DwSysMenuRepository } from '../service/menu-repository';
import { DwSysMenuTreeUiService } from '../service/tree-ui.service';

@Component({
  selector: 'app-dw-sys-menu-list',
  templateUrl: './dw-sys-menu-list.component.html',
  styleUrls: ['./dw-sys-menu-list.component.less'],
  providers: [
    {
      provide: DwComponent, useExisting: forwardRef(() => DwSysMenuListComponent)
    }
  ]
})
export class DwSysMenuListComponent extends DwComponent {
  @ViewChild('menuTreeView') menuTreeView: DwTreeComponent;
  public activedNode: DwTreeNode;
  public dragNodeElement;
  public languageList: IDwLanguageList[];
  public languageOption: string;
  public addMenuType = 'category'; // ??????????????????
  public addCategoryForm: FormGroup;
  public addExternalUrlForm: FormGroup;
  public openModeOptions = openModeOptions; // ????????????????????????
  public checkedNodeList = [];
  public programOptions = []; // ??????????????????
  public checkedProgramOption: Array<string> = []; // ??????????????????
  public programSearchValue = ''; // ???????????????
  public searchValue;
  public menuTreeNodes: DwTreeNode[] = null; // ng-zorro-antd v1.6.0 ??????dwData??????????????????[]?????????????????????????????????

  constructor(
    @SkipSelf() @Optional() _parentDwComponent: DwComponent,
    public fb: FormBuilder,
    private modalService: DwModalService,
    private sysMenuIconService: DwSysMenuIconService,
    private messageService: DwMessageService,
    private translateService: TranslateService,
    private languageListService: DwLanguageListService,
    private languageService: DwLanguageService,
    private sysMenuRepository: DwSysMenuRepository,
    private deleteService: DwDeleteService,
    private updateService: DwUpdateService,
    private programInfoListJsonService: DwProgramInfoListJsonService,
    private programInfoLangLoaderService: DwProgramInfoLangLoaderService,
    private sysReportRepository: DwFinereportRepository,
    private sysMenuTreeUiService: DwSysMenuTreeUiService,
    private dwIamRepository: DwIamRepository
  ) {
    super(_parentDwComponent);

    this.languageOption = this.languageService.currentLanguage;
    this.languageListService.getLanguagesList().subscribe(
      (list: IDwLanguageList[]) => {
        this.languageList = list;
      }
    );

    this.setMenuTree();
  }

  afterContentInit(): void {
  }

  afterViewInit(): void {
  }

  onInit(): void {
    // ??????Form??????
    // ??????
    this.addCategoryForm = this.fb.group({
      'addCategoryName': ['', [Validators.required]],
      'addCategoryIconClass': [''],
      'addCategoryDefaultExpand': [false, [Validators.required]]
    });

    // ????????????
    this.addExternalUrlForm = this.fb.group({
      'addExternalUrlName': ['', [Validators.required]],
      'addExternalUrlIconClass': [''],
      'addExternalUrlUrl': ['', [Validators.required]],
      'addExternalUrlOpenMode': ['iframe', [Validators.required]]
    });

    // this.onBeforeGetOrder();
  }

  onDestroy(): void {
  }

  @HostListener('mouseleave', ['$event'])
  mouseLeave(event: MouseEvent): void {
    event.preventDefault();
    if (this.dragNodeElement && this.dragNodeElement.className.indexOf('dw-f-sysmenu-is-dragging') > -1) {
      this.dragNodeElement.className = this.dragNodeElement.className.replace(' dw-f-sysmenu-is-dragging', '');
    }
  }

  @HostListener('mousedown', ['$event'])
  mouseDown(): void {
    // do not prevent
    if (this.dragNodeElement && this.dragNodeElement.className.indexOf('dw-f-sysmenu-is-dragging') > -1) {
      this.dragNodeElement.className = this.dragNodeElement.className.replace(' dw-f-sysmenu-is-dragging', '');
    }
  }

  public switchLanguage(): void {
    if (this.addMenuType === 'program') {
      this.addProgramResetForm();
    }
    this.sysMenuTreeUiService.setMenuTreeName(this.languageOption, this.menuTreeNodes);
  }

  // // #1888:Tree???checkedNodeList?????????????????????Tree???????????? https://github.com/NG-ZORRO/ng-zorro-antd/issues/1888
  // // #1888 ??????
  // private nodeListReSet(checklist: DwTreeNode[]): void {
  //   checklist.forEach(
  //     (tn: DwTreeNode) => {
  //       if (tn.isChecked) {
  //         tn.isChecked = false;
  //       }

  //       if (tn.isSelected) {
  //         tn.isSelected = false;
  //       }

  //       if (tn.children.length > 0) {
  //         this.nodeListReSet(tn.children);
  //       }
  //     }
  //   );
  // }

  private setMenuTree(): void {
    this.sysMenuRepository.tree([]).subscribe(
      responseMenuTree => {
        // this.nodeListReSet(this.menuTreeNodes); // #1888 ??????
        this.checkedNodeList = [];
        this.activedNode = null;
        this.menuTreeNodes = [];

        const initData = this.menuInit(null, responseMenuTree.data.dw_menu);
        const len = initData.length;

        for (let i = 0; i < len; i++) {
          this.menuTreeNodes.push(new DwTreeNode(initData[i]));
        }

        if (len > 0) {
          this.sysMenuTreeUiService.setMenuTreeName(this.languageOption, this.menuTreeNodes);
        }
      }
    );
  }

  public treeDelete(node?: any): void {
    this.modalService.confirm({
      dwTitle: this.translateService.instant('dw-sys-menu-msg-confirmDelete'),
      dwContent: '',
      dwOkText: this.translateService.instant('dw-sys-menu-delete'),
      dwOkType: 'danger',
      dwOnOk: (): void => {
        const deleteList = []; // ?????????API???????????????
        if (node) {
          deleteList.push(
            {
              $state: DELETE,
              id: node.key,
              version: node.origin.version
            }
          );
        } else {
          this.checkedNodeList.forEach(
            checkedNode => {
              deleteList.push(
                {
                  $state: DELETE,
                  id: checkedNode.key,
                  version: checkedNode.origin.version
                }
              );
            }
          );
        }

        const dataset = {
          dw_menu: deleteList
        };

        // API Request Method: DELETE????????????????????????body
        this.deleteService.delete('restful/service/DWSys/menu', dataset).subscribe(
          (result: any) => {
            if (result.success) {
              this.checkedNodeList = [];
              this.setMenuTree();
              const msg = this.translateService.instant('dw-sys-menu-msg-deleted');
              this.messageService.create('success', `${msg}`);
            } else {
              const msg = this.translateService.instant('dw-sys-menu-msg-deleteFailed');
              this.messageService.create('error', `${msg}`);
            }
          }
        );
      },
      dwCancelText: this.translateService.instant('dw-sys-menu-cancel'),
      dwOnCancel: (): void => {
      }
    });
  }

  private menuInit(parentNode: any, menuDataSource: IDwSysMenuNode[]): Array<any> {
    const menuTreeList = [];
    const len = menuDataSource.length;

    for (let i = 0; i < len; i++) {
      const obj: IDwSysMenuNode = JSON.parse(JSON.stringify(menuDataSource[i]));

      const treeNode = {
        // title: obj.code,
        name: obj.code,
        key: obj.id,
        version: obj.version,
        sequence: obj.sequence,
        iconClass: obj.icon_class,
        type: obj.type,
        code: obj.code, // ????????????
        isLeaf: obj.type === 'category' ? false : true,
        children: [],
        parentNode: parentNode,
        checked: false
      };

      if (obj.hasOwnProperty('child')) {
        if (obj.child.dw_menu.length > 0) {
          treeNode.children = this.menuInit(treeNode, obj.child.dw_menu);
        }
      }

      menuTreeList.push(treeNode);
    }

    return menuTreeList;
  }

  public mouseAction(name: string, e: DwFormatEmitEvent): void {
    // if (name !== 'over') {
    //   console.log(name, e);
    // }
  }

  public menuTreeCheckBoxChange(): void {
    this.checkedNodeList = this.menuTreeView.getCheckedNodeList();

    // // #1888 ??????
    // this.checkedNodeList = [];
    // const list = this.menuTreeView.getCheckedNodeList();
    // list.forEach(
    //   (tn: DwTreeNode) => {
    //     if (tn.isChecked) {
    //       this.checkedNodeList.push(tn);
    //     }
    //   }
    // );

    // console.log('checkedNodes: %o', this.menuTreeView.getCheckedNodeList());
    // console.log('selectedNodes: %o', this.menuTreeView.getSelectedNodeList());
    // console.log('halfCheckedNodes: %o', this.menuTreeView.getHalfCheckedNodeList());
    // console.log(this.menuTreeView.dwTreeService.getCheckedNodeList());
  }

  // ????????????
  public menuTreeOnClick(data: DwFormatEmitEvent): void {
    if (data.node.isSelected) {
      this.activedNode = data.node;
    } else {
      this.activedNode = null;
    }
  }

  public menuTreeOnDragStart(event: DwFormatEmitEvent): void {
    // disallow drag if root or search
    this.activedNode = null;
    this.dragNodeElement = event.event.srcElement;
    if (this.dragNodeElement.className.indexOf('dw-f-sysmenu-is-dragging') === -1) {
      this.dragNodeElement.className = this.dragNodeElement.className + ' dw-f-sysmenu-is-dragging';
    }
  }

  // DwFormatBeforeDropEvent???Tree??????????????????????????????this???service????????????????????????????????????DwFormatEmitEvent??????
  public menuTreeBeforeDrop(event: DwFormatBeforeDropEvent): Observable<boolean> {
    let canDrop = true;
    const dragNode = event.dragNode;
    const targeNode = event.node;
    const pos = event.pos; // ????????????
    let parentNode: DwTreeNode = null;
    let parent_id = '';
    const code = dragNode.origin.code ? dragNode.origin.code : '';
    let sibling: DwTreeNode[] = []; // ???????????????
    let isExist = false;

    // ???????????????-1????????????????????????0????????????????????????1????????????????????????
    // ??????????????????????????????????????????????????????????????????addNodeIsExist()????????????????????????????????????????????????
    if (pos === 0) {
      parentNode = targeNode;
    } else {
      parentNode = targeNode.parentNode;
    }

    if (parentNode) {
      parent_id = parentNode.key;
      sibling = parentNode.children;
      if (code !== '') {
        sibling.forEach(
          s => {
            if (s.origin.code === code && s.key !== dragNode.key) {
              isExist = true;
            }
          }
        );
      }
    }

    if (isExist) {
      canDrop = false;
    }

    if (canDrop) {
      event.dragNode.isChecked = false; // ?????????????????????????????????menuTreeOnDrop???menuTreeCheckBoxChange()
    }

    event.dragNode.origin.dragTemp = { // ????????????
      canDrop: canDrop,
      dragPos: event.pos,
      parentNode: parentNode,
      parent_id: parent_id
    };

    return of(canDrop);
  }

  public menuTreeOnDrop(event: DwFormatEmitEvent): void {
    const dragNode = event.dragNode;
    const targeNode = event.node;
    const canDrop = dragNode.origin.dragTemp.canDrop;

    if (canDrop) {
      const pos = dragNode.origin.dragTemp.dragPos; // ????????????

      // let parentNode: DwTreeNode;
      // let parent_id = '';
      const id = dragNode.key;
      const parentNode = dragNode.origin.dragTemp.parentNode;
      const parent_id = dragNode.origin.dragTemp.parent_id;
      let sequence = 0;

      this.menuTreeCheckBoxChange(); // ?????????????????????????????????menuTreeBeforeDrop???????????????

      // ???????????????-1????????????????????????0????????????????????????1????????????????????????
      if (pos === 0) {
        sequence = this.sysMenuTreeUiService.sequenceMax(parentNode.children, id) + 1;
      } else {
        if (pos === -1) {
          sequence = targeNode.origin.sequence;
        } else if (pos === 1) {
          sequence = targeNode.origin.sequence + 1;
        }
      }

      // // ???????????????-1????????????????????????0????????????????????????1????????????????????????
      // if (pos === 0) {
      //   parentNode = targeNode;
      //   parent_id = parentNode.key;
      //   sequence = this.sysMenuTreeUiService.sequenceMax(parentNode.children, id) + 1;
      // } else {
      //   parentNode = targeNode.parentNode;

      //   if (parentNode) {
      //     parent_id = parentNode.key;
      //   }

      //   if (pos === -1) {
      //     sequence = targeNode.origin.sequence;
      //   } else if (pos === 1) {
      //     sequence = targeNode.origin.sequence + 1;
      //   }
      // }

      delete dragNode.origin['dragTemp']; // ??????menuTreeBeforeDrop??????????????????????????????

      const reqData = {
        dw_menu: {
          $state: UPDATE,
          id: id,
          parent_id: parent_id,
          sequence: sequence
        }
      };

      this.updateService.update('restful/service/DWSys/menu/drag', reqData).subscribe(
        (response: any) => {
          this.rsetMenuTreeChild(parentNode); // ???????????????????????????
        }
      );
    } else {
      const message = this.translateService.instant('dw-sys-menu-msg-exist');
      this.messageService.create('error', `${message}`);
    }
  }

  private resetForm(e: MouseEvent, fGroup: FormGroup): void {
    // ???radio????????????MouseEvent???????????????????????????????????????????????????
    if (e.type) {
      e.preventDefault();
    }

    fGroup.reset();

    for (const key in fGroup.controls) {
      if (fGroup.controls.hasOwnProperty(key)) {
        fGroup.controls[key].markAsPristine();
        fGroup.controls[key].updateValueAndValidity();
      }
    }
  }

  public iconClassSelect(fControl: AbstractControl): void {
    this.sysMenuIconService.iconClassSelect(fControl);
  }

  public iconClassDelete(fControl: AbstractControl): void {
    this.sysMenuIconService.iconClassDelete(fControl);
  }

  public addMenuTypeChange(type: string, e: MouseEvent): void {
    switch (type) {
      case 'category':
        this.addCategoryResetForm(e);
        break;
      case 'program':
        this.addProgramResetForm();
        break;
      case 'fineReport':
        this.addProgramResetForm();
        break;
      case 'externalUrl':
        this.addExternalUrlResetForm(e);
        break;
      default:
    }
  }

  // ???????????????
  private rsetMenuTreeChild(parentNode: DwTreeNode): void {
    this.activedNode = null;

    if (parentNode) {
      const parentId = parentNode.key;
      parentNode.isSelected = false; // ???activedNode = null??????????????????????????????????????????
      parentNode.clearChildren();

      this.sysMenuRepository.tree([parentId]).subscribe(
        responseMenuTree => {
          const initData = this.menuInit(null, responseMenuTree.data.dw_menu[0].child.dw_menu);
          const len = initData.length;
          parentNode.addChildren(initData);

          if (len > 0) {
            this.sysMenuTreeUiService.setMenuTreeName(this.languageOption, this.menuTreeNodes);
          }
        }
      );
    } else {
      this.setMenuTree();
    }
  }

  // ???????????? *******************************************
  public addCategoryResetForm(e: MouseEvent): void {
    const iconClass = this.addCategoryForm.get('addCategoryIconClass').value;
    this.resetForm(e, this.addCategoryForm);
    this.addCategoryForm.controls['addCategoryIconClass'].setValue(iconClass);
    this.addCategoryForm.controls['addCategoryDefaultExpand'].setValue(false);
  }

  public addCategorySave(): void {
    const data: DwSysMenuNodeCreateModel = new DwSysMenuNodeCreateModel();
    const dataC: DwSysMenuNodeCreateModel[] = [];
    data.type = this.addMenuType;

    const tMenuLanguage: DwTMenuLangCModel = new DwTMenuLangCModel();
    tMenuLanguage.language = this.languageOption;
    tMenuLanguage.name = this.addCategoryForm.get('addCategoryName').value;
    data.dw_menu_language.push(tMenuLanguage);

    data.icon_class = this.addCategoryForm.get('addCategoryIconClass').value;
    data.default_expand = this.addCategoryForm.get('addCategoryDefaultExpand').value;
    dataC.push(data);

    this.sysMenuTreeUiService.addNodeSave(this.activedNode, dataC, this.menuTreeNodes).subscribe(
      result => {
        if (result.success) {
          this.rsetMenuTreeChild(result.parentNode); // ???????????????????????????
        } else if (result.message) {
          this.messageService.create('error', `${result.message}`);
          // const msg = this.translateService.instant('dw-sys-menu-msg-addfail', { value1: parentTitle });
        }
      }
    );
  }

  // ???????????? *******************************************
  public addProgramResetForm(): void {
    this.getProgramOptions();
    this.programSearchValue = '';
  }

  public addProgramSave(): void {
    const dataC: DwSysMenuNodeCreateModel[] = [];

    this.programOptions.forEach(
      option => {
        if (option.check) {
          const data: DwSysMenuNodeCreateModel = new DwSysMenuNodeCreateModel();
          data.type = option.menuType;
          data.code = option.key;
          dataC.push(data);
        }
      }
    );

    this.sysMenuTreeUiService.addNodeSave(this.activedNode, dataC, this.menuTreeNodes).subscribe(
      result => {
        if (result.success) {
          this.rsetMenuTreeChild(result.parentNode); // ???????????????????????????
        } else if (result.message) {
          this.messageService.create('error', `${result.message}`);
          // const msg = this.translateService.instant('dw-sys-menu-msg-addfail', { value1: parentTitle });
        }
      }
    );

    // ???????????????
    this.programOptions.forEach(
      option => {
        option.check = false;
      }
    );
  }

  public getProgramOptions(): void {
    this.programOptions = [];
    this.checkedProgramOption = [];
    const _dwProgramInfoFrameworkJson = this.programInfoListJsonService.dwProgramInfoFrameworkJson;

    this.dwIamRepository.permissionUserActions().subscribe(
      iamPua => {
        if (iamPua.hasOwnProperty('actions')) {
          const iamAct: Array<any> = Object.assign([], iamPua.actions);
          const iamActLen = iamAct.length;

          this.programInfoListJsonService.programListJsonMap$.subscribe(
            (programListJsonMap: IDwOperationMap) => {
              this.programInfoLangLoaderService.getTranslation(this.languageOption).subscribe(
                (translation: any) => {
                  Object.keys(programListJsonMap).forEach(
                    key => {
                      // ???????????????????????????
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
                        // ??????????????????????????????(??????????????????)
                        for (let i = 0; i < iamActLen; i++) {
                          if (key === iamAct[i].id) {
                            show = true;
                            break;
                          }
                        }
                      }

                      if (show) {
                        const name = translation[key] + ' (' + key + ')';
                        this.programOptions.push(
                          {
                            check: false,
                            menuType: 'program',
                            key: key, // ???????????????????????????
                            // type: programListJsonMap[key].type,
                            name: name,
                            isMatched: true
                          }
                        );
                      }
                    }
                  );

                  this.sysReportRepository.language(this.languageOption).subscribe(
                    (reportList: any) => {
                      Object.keys(reportList).forEach(
                        key => {
                          let show = false;
                          // ??????????????????????????????(??????????????????)
                          for (let i = 0; i < iamActLen; i++) {
                            if (key === iamAct[i].id) {
                              show = true;
                              break;
                            }
                          }

                          if (show) {
                            const rItem = reportList[key];
                            this.programOptions.push(
                              {
                                check: false,
                                menuType: 'fineReport',
                                key: key, // ???????????????????????????
                                // type: '',
                                name: rItem,
                                isMatched: true
                              }
                            );
                          }
                        }
                      );
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
      }
    );
  }

  /**
   * ????????????
   */
  public programSearch(): void {
    this.programOptions.forEach(
      option => {
        const key: string = option.key;
        const name: string = option.name;

        option.check = false;

        if (this.programSearchValue === '') {
          option.isMatched = true;
        } else if (key.indexOf(this.programSearchValue, 0) >= 0) {
          option.isMatched = true;
        } else if (name.indexOf(this.programSearchValue, 0) >= 0) {
          option.isMatched = true;
        } else {
          option.isMatched = false;
        }
      }
    );
  }

  public programOptionChecked(checkList: Array<string>): void {
    this.checkedProgramOption = checkList;
    const len = this.checkedProgramOption.length;

    this.programOptions.forEach(
      option => {
        let checked = false;
        for (let i = 0; i < len; i++) {
          if (option.key === this.checkedProgramOption[i]) {
            checked = true;
            break;
          }
        }
        option.check = checked;
      }
    );
  }

  // ?????????????????? *******************************************
  public addExternalUrlResetForm(e: MouseEvent): void {
    const iconClass = this.addExternalUrlForm.get('addExternalUrlIconClass').value;
    this.resetForm(e, this.addExternalUrlForm);
    this.addExternalUrlForm.controls['addExternalUrlIconClass'].setValue(iconClass);
    this.addExternalUrlForm.controls['addExternalUrlOpenMode'].setValue('iframe');
  }

  public addExternalUrlSave(): void {
    const data: DwSysMenuNodeCreateModel = new DwSysMenuNodeCreateModel();
    const dataC: DwSysMenuNodeCreateModel[] = [];
    data.type = this.addMenuType;

    const tMenuLanguage: DwTMenuLangCModel = new DwTMenuLangCModel();
    tMenuLanguage.language = this.languageOption;
    tMenuLanguage.name = this.addExternalUrlForm.get('addExternalUrlName').value;
    data.dw_menu_language.push(tMenuLanguage);

    data.icon_class = this.addExternalUrlForm.get('addExternalUrlIconClass').value;
    data.url = this.addExternalUrlForm.get('addExternalUrlUrl').value;
    data.open_mode = this.addExternalUrlForm.get('addExternalUrlOpenMode').value;
    dataC.push(data);

    this.sysMenuTreeUiService.addNodeSave(this.activedNode, dataC, this.menuTreeNodes).subscribe(
      result => {
        if (result.success) {
          this.rsetMenuTreeChild(result.parentNode); // ???????????????????????????
        } else if (result.message) {
          this.messageService.create('error', `${result.message}`);
        }
      }
    );
  }

  public menuTreeNodeEdit(editNode: DwTreeNode): void {
    const id = editNode.key;
    const type = editNode.origin.type;

    this.sysMenuRepository.menuRead([id]).subscribe(
      response => {
        if (response.success) {
          const dataLen = response.data.dw_menu.length;
          if (dataLen > 0) {
            const dataSource = response.data.dw_menu[0];
            this.modalService.create({
              // dwWidth: 1000,
              dwTitle: this.translateService.instant('dw-sys-menu-nodeEditing'),
              dwStyle: {top: '20px'},
              dwMaskClosable: false, // ??????????????????????????????
              dwContent: DwSysMenuEditComponent,
              dwOnOk: (data: any): void => {
                // Menu>Prog>Report
                data.menuEditForm.get('editMenuLanguage').controls.forEach(
                  fGroup => {
                    if (fGroup.get('language').value === this.languageOption) {
                      editNode.origin.name = fGroup.get('name').value;
                    }
                  }
                );

                if (!editNode.origin.name) {
                  editNode.origin.name = data.master.codeName;
                }
                editNode.origin.version = data.master.version;
                editNode.origin.iconClass = data.menuEditForm.get('editIconClass').value;
              },
              dwOnCancel(): void {
              },
              dwFooter: null,
              dwComponentParams: {
                languageOption: this.languageOption,
                type: type,
                dataSource: dataSource
              }
            });
          } else {
            // ????????????
            const msg = this.translateService.instant('dw-sys-menu-msg-notExist', {value1: editNode.origin.name});
            this.messageService.create('error', msg);
          }
        } else if (response.message) {
          this.messageService.create('error', `${response.message}`);
        }
      }
    );
  }
}
