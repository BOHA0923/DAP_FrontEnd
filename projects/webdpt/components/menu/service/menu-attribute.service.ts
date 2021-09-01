import { Injectable } from '@angular/core';

import { IDwMenu } from '../interface/menu.interface';


@Injectable({ providedIn: 'root' })
export class DwMenuAttributeService {
  constructor(
  ) { }

  /**
   * 選單預設屬性
   * @param menuItem 選單節點
   * @param level 節點層級
   */
  public default(menuItem: IDwMenu, level: number): void {
    // 節點層級
    const obj = menuItem;
    obj.level = level;

    if (!obj.hasOwnProperty('disabled')) {
      obj.disabled = false;
    } else if (obj.disabled === undefined) {
      obj.disabled = false;
    }

    if (!obj.hasOwnProperty('selected')) {
      obj.selected = false;
    } else if (obj.selected === undefined) {
      obj.selected = false;
    }

    if (!obj.hasOwnProperty('open')) {
      obj.open = false;
    } else if (obj.open === undefined) {
      obj.open = false;
    }

    if (!obj.hasOwnProperty('url')) {
      obj.url = '';
    } else if (obj.url === undefined) {
      obj.url = '';
    }

    if (!obj.hasOwnProperty('iconClass')) {
      obj.iconClass = '';
    } else if (obj.iconClass === undefined) {
      obj.iconClass = '';
    }

    if (!obj.hasOwnProperty('programId')) {
      obj.programId = '';
    } else if (obj.programId === undefined) {
      obj.programId = '';
    }

    if (!obj.hasOwnProperty('parameter')) {
      obj.parameter = [];
    } else if (obj.parameter === undefined) {
      obj.parameter = [];
    }

    // // 關聯作業清單
    // if (obj.hasOwnProperty('programId')) {
    //   const programId = obj.programId;

    //   if (operationMap[programId]) {
    //     const operationInfo = operationMap[programId];
    //     obj.routerLink = operationInfo.routerLink;
    //     if (!obj.routerLink) {
    //       obj.disabled = true;
    //     }
    //   }
    // }

    // 沒有子節點
    if (!obj.hasOwnProperty('child')) {
      obj.child = [];
    }
  }
}
