import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';

import { IDwLanguageList } from '@webdpt/framework/language';
import { DwLanguageListService } from '@webdpt/framework/language';
import { DwLanguageService } from '@webdpt/framework/language';


@Component({
  selector: 'dw-language',
  templateUrl: './language.component.html',
  styleUrls: ['./language.component.css']
})
export class DwLanguageComponent implements OnInit {
  languageOption: string;
  index: any = 0;
  languageList: IDwLanguageList[];

  constructor(
    private languageListService: DwLanguageListService,
    private languageService: DwLanguageService
  ) {
    this.languageListService.getLanguagesList().subscribe(
      (list: IDwLanguageList[]) => {
        this.languageList = list;
      }
    );
  }

  /**
   * 'basic'基本樣板：左右切換+下拉清單
   * 'dropdown'下拉樣板：下拉清單
   */
  @Input() template: string;

  // 翻译
  switchLanguage(language: string): void {
    this.languageOption = language;
    this.languageService.setUp(language);
  }
  // 上一个
  previous(): void {
    this.index--;
    if (this.index < 0) {
      this.index = Object.keys(this.languageList).length - 1;
    }

    this.switchLanguage(this.languageList[this.index].value);
  }
  // 下一个
  next(): void {
    this.index++;
    if (this.index >= Object.keys(this.languageList).length) {
      this.index = 0;
    }

    this.switchLanguage(this.languageList[this.index].value);
  }
  ngOnInit(): void {
    this.switchLanguage(this.languageService.currentLanguage);
    this.index = this.languageList.findIndex(language => language.value === this.languageOption);
  }

}
