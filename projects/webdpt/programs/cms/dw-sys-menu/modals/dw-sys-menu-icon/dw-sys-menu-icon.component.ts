import { Component, OnInit, Input } from '@angular/core';
import { DwModalRef } from 'ng-quicksilver/modal';

/**
 * 選擇圖示樣式
 */
@Component({
  selector: 'app-dw-sys-menu-icon',
  templateUrl: './dw-sys-menu-icon.component.html',
  styleUrls: ['./dw-sys-menu-icon.component.less']
})
export class DwSysMenuIconComponent implements OnInit {
  iconClassSelect = '';
  iconList = [
    'dwType:profile',
    'dwType:appstore',
    'dwType:appstore dwTheme:fill',
    'dwType:user',
    'dwType:team',
    'dwType:idcard',
    'dwType:contacts',
    'dwType:solution',
    'dwType:tag',
    'dwType:tag dwTheme:fill',
    'dwType:line-chart',
    'dwType:area-chart',
    'dwType:pie-chart',
    'dwType:bar-chart',
    'dwType:dot-chart',
    'dwType:credit-card',
    'dwType:global',
    'dwType:cloud',
    'dwType:cloud dwTheme:fill',
    'dwType:calendar',
    'dwType:schedule',
    'dwType:book',
    'dwType:smile',
    'dwType:smile dwTheme:fill',
    'dwType:link',
    'dwType:disconnect',
    'dwType:star',
    'dwType:star dwTheme:fill',
    'dwType:heart',
    'dwType:heart dwTheme:fill',
    'dwType:aliwangwang',
    'dwType:aliwangwang dwTheme:fill'
  ];

  @Input()
  set iconClass(iconClass: string) {
    this.iconClassSelect = iconClass;
  }

  constructor(
    private modalSubject: DwModalRef
  ) { }

  ngOnInit(): void {
  }

  public selected(item: string): void {
    this.iconClassSelect = item;
    this.emitDataOutside();
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

}
