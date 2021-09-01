import { Injectable } from '@angular/core';

import { IDwMenu } from '../interface/menu.interface';
import { DwProgramExecuteService } from '@webdpt/framework/program-info';

@Injectable({ providedIn: 'root' })
export class DwMenuExecuteService {

  constructor(
    private dwProgramExecuteService: DwProgramExecuteService
  ) {
  }

  // 點選Menu
  menuClick(menuItem: IDwMenu): void {
    let programId = '';
    const queryParams = {};

    if (menuItem.hasOwnProperty('programId')) {
      programId = menuItem.programId;
    }

    if (menuItem.hasOwnProperty('parameter')) {
      menuItem.parameter.forEach(
        param => {
          queryParams[param.name] = param.value;
        }
      );
    }

    if (menuItem.hasOwnProperty('url')) {
      if (menuItem.url) {
        queryParams['url'] = menuItem.url;
      }
    }

    switch (menuItem.type) {
      case 'category':
        break;
      case 'program':
        // 執行作業
        this.dwProgramExecuteService.byMenu(menuItem.type, menuItem.id, programId, queryParams);
        break;
      case 'fineReport':
        this.dwProgramExecuteService.byMenu(menuItem.type, menuItem.id, programId, queryParams);
        break;
      case 'externalUrl':
        if (menuItem.openMode === 'iframe') {
          this.dwProgramExecuteService.byMenu(menuItem.type, menuItem.id, programId, queryParams);
        } else {
          if (menuItem.url !== '') {
            // 另開外部網頁
            window.open(menuItem.url);
          }
        }

        break;
      default:
    }
  }
}
