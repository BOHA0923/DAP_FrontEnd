import { Component, OnInit, Inject } from '@angular/core';
import { Subject } from 'rxjs';
import fnsFormat from 'date-fns/format';
import { TranslateService } from '@ngx-translate/core';
import { DwModalService } from 'ng-quicksilver/modal';

import { DataModel, OriginDataModel } from './model/model';
import { ShowcaseDataModalComponent } from './data-modal/data-modal.component';
import { ShowcaseEditShowcaseDataModalComponent } from './edit-data-modal/edit-data-modal.component';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { DwLoadingMaskService } from '@webdpt/components/loading';
import { APP_DATE_FORMAT, APP_TIME_FORMAT } from '@webdpt/framework/config';

@Component({
  selector: 'app-dw-showcase-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.css']
})
export class ShowcaseTreeComponent implements OnInit {

  constructor(
    private dwModalService: DwModalService,
    private dwLoadingMaskService: DwLoadingMaskService,
    private translateService: TranslateService,
    @Inject(APP_DATE_FORMAT) private dwDateFormat: string,
    @Inject(APP_TIME_FORMAT) private dwTimeFormat: string
  ) {
    // 過濾用ShowcaseTreeSearchPipe,目前用不到的subject功能
    this.term$.pipe(
      debounceTime(500),
      distinctUntilChanged()
      )
      .subscribe(val => {
        // console.log(val);
        // this.filterData(val);
      });

  }
  term$ = new Subject<string>();
  allChecked: boolean = false;
  disabledButton: boolean = true;
  checkedNumber: number = 0;
  checkedDescription: string = '';
  checkData: DataModel[] = [];
  operating: boolean = false;
  indeterminate: boolean = false;
  value: string = '';
  shouldExpendNodes: number[] = []; // 記錄onInit後，要展開的節點
  originData: OriginDataModel[] = [
    {
      key: 1,
      name: 'John Brown sr.',
      amount: 60,
      status: true,
      update: '2016-09-21  08:50:08',
      address: 'New York No. 1 Lake Park',
      children: [{
        key: 11,
        name: 'John Brown',
        amount: 42,
        status: true,
        update: '2016-09-21  08:50:08',
        address: 'New York No. 2 Lake Park',
      }, {
        key: 12,
        name: 'John Brown jr.',
        amount: 30,
        status: true,
        update: '2016-09-21  08:50:08',
        address: 'New York No. 3 Lake Park',
        children: [{
          key: 121,
          name: 'Jimmy Brown',
          amount: 16,
          status: true,
          update: '2016-09-21  08:50:08',
          address: 'New York No. 3 Lake Park',
        }],
      }, {
        key: 13,
        name: 'Jim Green sr.',
        amount: 72,
        status: true,
        update: '2016-09-21  08:50:08',
        address: 'London No. 1 Lake Park',
        children: [{
          key: 131,
          name: 'Jim Green',
          amount: 42,
          status: true,
          update: '2016-09-21  08:50:08',
          address: 'London No. 2 Lake Park',
          children: [{
            key: 1311,
            name: 'Jim Green jr.',
            amount: 25,
            status: true,
            update: '2016-09-21  08:50:08',
            address: 'London No. 3 Lake Park',
          }, {
            key: 1312,
            name: 'Jimmy Green sr.',
            amount: 18,
            status: true,
            update: '2016-09-21  08:50:08',
            address: 'London No. 4 Lake Park',
          }],
        }],
      }],
    },
    {
      key: 2,
      name: 'Joe Black',
      amount: 32,
      status: false,
      update: '2016-09-21  08:50:08',
      address: 'Sidney No. 1 Lake Park',
    }
  ];
  expandDataCache: { [name: number]: DataModel[] } = {

  };
  checkDataChange(): void {
    this.checkData = [];
    for (const name in this.expandDataCache) {
      if (this.expandDataCache.hasOwnProperty(name)) {
        this.checkData = this.checkData.concat(this.expandDataCache[name]);
      }
    }
  }

  refreshStatus(): void {
    this.checkDataChange();
    const allChecked = this.checkData.every(value => value.checked === true);
    const allUnChecked = this.checkData.every(value => !value.checked);
    this.allChecked = allChecked;
    this.indeterminate = (!allChecked) && (!allUnChecked);
    this.disabledButton = !this.checkData.some(value => value.checked);
    this.checkedNumber = this.checkData.filter(value => value.checked).length;
    this.checkedDescription = '已选择  ' + this.checkedNumber + ' 项 ';
  }

  checkAll(value: boolean): void {
    if (value) {
      this.checkData.forEach(data => data.checked = true);
    } else {
      this.checkData.forEach(data => data.checked = false);
    }
    this.refreshStatus();
  }

  operateData(command: string): void {
    if (command === 'delete') {
      const items = this.checkData.filter(value => value.checked);
      const that = this;

      const deleteData = (): void => {
        const tip = this.translateService.instant('dw-tree-mask-tip-processing'); // '處理中...'
        const loadingMaskId = this.dwLoadingMaskService.show(0, tip);
        // 模擬API的延遲
        setTimeout(() => {
          items.forEach((item) => that.deleteOriginItem(item));
          that.ngOnInit();
          this.dwLoadingMaskService.hide(loadingMaskId);
        }, 4000);
      };

      this.dwModalService.confirm({
        dwIconType: 'close-circle',
        dwTitle: '刪除資料會將會一併刪除子項目，確定刪除?',
        // content: '<b>一些解释</b>',
        dwOnOk(): void {
          // that.operating = true;
          deleteData();
          // that.operating = false;
          // that.ngOnInit();
          // setTimeout(() => {
          //   console.log('刪除:');
          //   console.log(items);
          //   that.operating = false;
          // }, 1000);
        },
        dwOnCancel(): void {
        }
      });
    }

    // setTimeout( => {
    //   console.log(this.checkData.filter(value => value.checked));
    //   this.checkData.forEach(value => value.checked = false);
    //   this.refreshStatus();
    //   this.operating = false;
    // }, 1000);
  }

  showLoading(): void {
    const tip = this.translateService.instant('dw-tree-mask-tip-loading'); // '加載中...'
    const loadingMaskId = this.dwLoadingMaskService.show(1000, tip);
    // 模擬API的延遲
    setTimeout(() => {
      this.dwLoadingMaskService.hide(loadingMaskId);
    }, 3000);
  }

  filterData(item: DataModel): void {
    // for(var name in this.expandDataCache){
    //   if(this.expandDataCache[name].length){
    //     for(var i=0;i<this.expandDataCache[name].length;i++){
    //       // if((this.expandDataCache[name][i].key).toString().search(value)===-1&&
    // this.expandDataCache[name][i].name.search(value)===-1){
    //       if(this.expandDataCache[name][i].name.search(value)===-1){
    //         this.expandDataCache[name].splice(i,1);
    //       }
    //     }
    //   }
    //  }
  }
  collapse(array: DataModel[], data: DataModel, $event: boolean): void {
    if ($event === false) {
      this.shouldExpendNodes.splice(this.shouldExpendNodes.findIndex((elem) => elem === data.key), 1);
      if (data.children) {
        data.children.forEach(d => {
          const target = array.find(a => a.key === d.key);
          target.expand = false;
          this.collapse(array, target, false);
        });
      } else {
        return;
      }
    }
    if ($event) { this.shouldExpendNodes.push(data.key); }
  }

  convertTreeToList(root: OriginDataModel): DataModel[] {
    const shouldExpendNodes = this.shouldExpendNodes.join(',');
    const stack: DataModel[] = [], array: DataModel[] = [], hashMap = {};
    stack.push({ ...root, level: 0, expand: shouldExpendNodes.search(root.key.toString()) !== -1 ? true : false, checked: false });

    while (stack.length !== 0) {
      const node: DataModel = stack.pop();
      this.visitNode(node, hashMap, array);
      if (node.children) {
        for (let i = node.children.length - 1; i >= 0; i--) {
          const isExpend = shouldExpendNodes.search(node.children[i].key.toString()) !== -1 ? true : false;
          stack.push({ ...node.children[i], level: node.level + 1, expand: isExpend, checked: false, parent: node });
        }
      }
    }

    return array;
  }

  visitNode(node: DataModel, hashMap: {}, array: DataModel[]): void {
    if (!hashMap[node.key]) {
      hashMap[node.key] = true;
      array.push(node);
    }
  }
  changeParentChildStatus(item: DataModel): void {
    if (item.hasOwnProperty('parent')) {
      if (!item.checked) {
        changeParentStatus.call(this, item);
      }
    }
    if (item.hasOwnProperty('children')) {
      changeChildStatus.call(this, item);
    }
    function changeChildStatus(treeItem: DataModel): void {
      treeItem.children.forEach(data => {
        const childItem = this.getExpandItem(data.key);
        childItem.checked = treeItem.checked;
        if (childItem.hasOwnProperty('children')) {
          changeChildStatus.call(this, childItem);
        }
      });
    }
    function changeParentStatus(treeItem: DataModel): void {
      const parentItem = this.getExpandItem(treeItem.parent.key);
      parentItem.checked = false;
      if (parentItem.hasOwnProperty('parent')) {
        changeParentStatus.call(this, parentItem);
      }
    }
  }
  getExpandItem(key: string | number): DataModel {
    for (const name in this.expandDataCache) {
      if (this.expandDataCache[name].length) {
        for (let i = 0; i < this.expandDataCache[name].length; i++) {
          if (this.expandDataCache[name][i].key === key) {
            return this.expandDataCache[name][i];
          }
        }
      }
    }
    return <DataModel>{};
  }
  showConfirm = (item: DataModel): void => {
    const that = this;
    this.dwModalService.confirm({
      dwIconType: 'close-circle',
      dwTitle: '刪除此筆資料會將會一併刪除子項目，確定刪除?',
      // content: '<b>一些解释</b>',
      dwOnOk(): void {
        that.deleteOriginItem(item);
        that.ngOnInit();

        // return new Promise((resolve, reject) => {
        //   setTimeout(() => {
        //     console.log('刪除:');
        //     console.log(item);
        //     resolve(item);
        //   }, 3000);
        // });
      },
      dwOnCancel(): void {
      }
    });
  }
  addDataModal(item?: DataModel): void {
    const subscription = this.dwModalService.create({
      dwTitle: '新增組織',
      dwContent: ShowcaseDataModalComponent,
      dwOnOk: (data): void => {
        const result = data.validateForm.value;
        if (typeof result === 'object') {
          // 加key值
          result.key = (function (): Date {
            return new Date();
          })().getTime();

          if (result.type === 1) {
            delete result.type;
            delete result.parent;
            this.originData.push(result);
            this.ngOnInit();
          }

          if (result.type === 2 && result.parent) {
            delete result.type;
            const parentKeys: any[] = result.parent;
            delete result.parent;
            let parentItem: OriginDataModel;
            let childrenItems: OriginDataModel[] = this.originData;
            // 依parentKeys依序找出節點
            while (parentKeys.length) {
              const parentKey = parentKeys.shift();
              parentItem = this.findParent(parentKey, childrenItems);
              childrenItems = [];
              if (parentItem.hasOwnProperty('children')) { childrenItems = parentItem.children; }
            }

            // 最後的節點為要push至children的父節點
            parentItem.hasOwnProperty('children') ? parentItem.children.push(result) : parentItem.children = [result];
            this.ngOnInit();
          }
        }
      },
      dwOnCancel(): void {
        // console.log('Click cancel');
      },
      dwFooter: null,
      dwComponentParams: {
        originData: this.originData,
        item: item ? item : <DataModel>{}
      }
    });
  }

  findParent(key: string | number, childrenItems: OriginDataModel[]): OriginDataModel {
    let parentItem: OriginDataModel;
    for (let i = 0; i < childrenItems.length; i++) {
      if (childrenItems[i].key === key) {
        parentItem = childrenItems[i];
        this.shouldExpendNodes.push(parentItem.key);
        break;
      }
    }
    return parentItem;
  }
  editDataModal(item?: DataModel): void {
    this.dwModalService.create({
      dwTitle: '編輯組織',
      dwContent: ShowcaseEditShowcaseDataModalComponent,
      dwOnOk: (data): void => {
        const result = data.validateForm.value;
        if (typeof result === 'object') {
          let originItem = this.findOriginItem(result.key, this.originData);
          // var expendItem=this.getExpandItem(result.key);
          // console.log(expendItem);
          if (!!originItem) {
            delete result.parent;
            result.update = fnsFormat(new Date(), `${this.dwDateFormat} ${this.dwTimeFormat}`);
            originItem = Object.assign(originItem, result);
            this.ngOnInit();
          }
        }
      },
      dwOnCancel(): void {
        // console.log('Click cancel');
      },
      dwFooter: null,
      dwComponentParams: {
        item: item ? item : <DataModel>{}
      }
    });
  }
  findOriginItem(key: string | number, items: OriginDataModel[]): OriginDataModel {
    let item: OriginDataModel = null;
    for (let i = 0; i < items.length; i++) {
      // console.log(items[i].key);
      if (items[i].key === key) {
        // console.log(items[i].key);
        return items[i];
      } else if (item === null && items[i].hasOwnProperty('children')) {
        item = this.findOriginItem(key, items[i].children);
      }
    }
    return item;
  }
  deleteOriginItem(item: DataModel): void {
    let index: number;
    let originParent: OriginDataModel;
    if (item.hasOwnProperty('parent')) {
      originParent = this.findOriginItem(item.parent.key, this.originData);
      if (originParent) { index = originParent.children.findIndex((elem) => elem.key === item.key); }
      if (index >= 0) {
        originParent.children.splice(index, 1);
        if (!originParent.children.length) { delete originParent.children; } // 沒值就刪掉children
      }
    } else {
      index = this.originData.findIndex((elem) => elem.key === item.key);
      if (index >= 0) { this.originData.splice(index, 1); }
    }
    // console.log(this.originData);
  }

  ngOnInit(): void {
    this.originData.forEach(item => {
      this.expandDataCache[item.key] = this.convertTreeToList(item);
    });
    // console.log(this.originData);
    // console.log(this.expandDataCache);
    this.checkDataChange();
  }
}
