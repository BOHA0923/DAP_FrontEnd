import { Injectable } from '@angular/core';

import { DwProgramInfoModule } from './program-info.module';


// TODO: framework會用到，此類沒任何依賴，搬回framework
/**
 * 多語言翻譯編號的前綴詞服務
 */
@Injectable({
  providedIn: DwProgramInfoModule
})
export class DwLanguagePreService {
  private languagePre = { // 多語言翻譯編號的前綴詞
    menu: 'menu.', // 選單
    program: 'prog.', // 作業
    page: 'page.' // 作業子頁面
  };

  constructor(
  ) {
  }

  get menu(): string {
    return this.languagePre.menu;
  }

  get program(): string {
    return this.languagePre.program;
  }

  get page(): string {
    return this.languagePre.page;
  }
}
