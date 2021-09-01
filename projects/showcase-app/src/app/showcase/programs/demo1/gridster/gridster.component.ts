import { Component, OnInit, AfterViewInit, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { GridsterConfig, GridsterItem, GridsterItemComponentInterface, GridType, DisplayGrid } from 'angular-gridster2';
import { HttpClient } from '@angular/common/http';
import { combineLatest } from 'rxjs';
import { DwLanguageService } from '@webdpt/framework/language';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dw-gridster',
  templateUrl: './gridster.component.html',
  styleUrls: ['./gridster.component.less']
})
export class GridsterComponent implements OnInit, AfterViewInit {
  options: GridsterConfig;
  dashboard: Array<GridsterItem>;
  isSave: boolean = false;
  showMask: boolean;
  private _combineLatest: Subscription;

  // 開始-拖拉區塊.
  draggtStartEvent(item: GridsterItem, itemComponent: GridsterItemComponentInterface, event: MouseEvent): void {
    this.showMask = true;
  }

  // 結束-拖拉區塊.
  draggStopEvent(item: GridsterItem, itemComponent: GridsterItemComponentInterface, event: MouseEvent): void {
    this.showMask = false;
  }

  // 開始-改變區塊大小.
  resizeStartEvent(item: GridsterItem, itemComponent: GridsterItemComponentInterface, event: MouseEvent): void {
    this.showMask = true;
  }

  // 停止-改變區塊大小.
  resizeStopEvent(item: GridsterItem, itemComponent: GridsterItemComponentInterface, event: MouseEvent): void {
    this.showMask = false;
  }

  constructor(private http: HttpClient, private dwLanguageService: DwLanguageService) {
  }

  saveDashboard(item: GridsterItem, itemComponent: GridsterItemComponentInterface): void {
    if (this.isSave) {
      // console.log('this.dashboard', this.dashboard);
    }
  }

  ngOnInit(): void {
    this.options = {
      gridType: GridType.Fit,
      displayGrid: DisplayGrid.Always,
      pushItems: true,
      swap: true,
      itemChangeCallback: this.saveDashboard.bind(this), // 括號裡的 this, 是要替換掉 function[saveDashboard()] 裡的this
      draggable: {
        enabled: true,
        start: this.draggtStartEvent.bind(this),
        stop: this.draggStopEvent.bind(this),
        ignoreContentClass: 'gridster-item-content',
        ignoreContent: false,
        dragHandleClass: 'drag-handler'
      },
      resizable: {
        enabled: true,
        start: this.resizeStartEvent.bind(this),
        stop: this.resizeStopEvent.bind(this),
        handles: {
          s: false,
          e: false,
          n: false,
          w: false,
          se: true, // 只允許這個方向改變大小.
          ne: false,
          sw: false,
          nw: false
        }
      },
      minCols: 8, // 最小 - grid 畫布(面積)
      minRows: 8, // 最小 - grid 畫布(面積)
      maxCols: 8, // 最大 - grid 畫布(面積).
      maxRows: 8, // 最大 - grid 畫布(面積).
      maxItemCols: 8, // 每一區塊最大佔位(面積)
      maxItemRows: 8, // 每一區塊最大佔位(面積)
      minItemCols: 1, // 每一區塊最小佔位(面積)
      minItemRows: 1, // 每一區塊最小佔位(面積)
      defaultItemCols: 1, // 預設每一個區塊佔位(面積).
      defaultItemRows: 1 // 預設每一個區塊佔位(面積).
    };

    // 當使用帆軟的 url 時, <iframe> 必需存在 sandbox="allow-scripts allow-popups", 此時其他的 url 可能會報錯.
    // combineLatest 需要 impor 'rxjs/observable/combineLatest';
    this._combineLatest = combineLatest([
      this.http.post('showcase/demo1/getGridster', {}),
      this.dwLanguageService.language$
    ]).subscribe(
      (datas: Array<any>) => {
        const arrItems: Array<GridsterItem> = datas[0]; // 區塊的定義.
        const langCode: string = datas[1]; // 使用語系.

        this.dashboard = Object.assign([], arrItems);
        this.dashboard.forEach(item => {
          if (item.type === 'fineReport') {
            // item.attr = 'allow-forms allow-scripts allow-popups';
            item.url = item.url.replace('{{lang_code}}', langCode); // 替換使用語系.
          }
        });

        this._combineLatest.unsubscribe();
      }
    );

  }

  // 因為有設置dwActionAuthorized, 不需要阻止冒泡.
  removeItem($event: any, item: GridsterItem): void {
    this.dashboard.splice(this.dashboard.indexOf(item), 1);
  }

  onMousedown($event: any): void {
    $event.preventDefault();
    $event.stopPropagation();
  }

  ngAfterViewInit(): void {
    this.isSave  = true;
  }

}
