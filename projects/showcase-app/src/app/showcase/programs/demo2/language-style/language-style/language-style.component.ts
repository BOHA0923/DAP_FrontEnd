import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dw-language-style',
  templateUrl: './language-style.component.html'
  // styleUrls: ['./language-style.component.less']
})
export class LanguageStyleComponent implements OnInit {
  listData: any;
  dataSet2 = [
    // {
    //   dwCommonvarName: '.en_US.dw-fWp-top-fixed',
    //   dwCommonInitial: '.zh_CN.dw-fWp-top-fixed',
    //   dwCommonDescription: '整體最外層'
    // },
    {
      dwCommonvarName: '.en_US.dw-f-menusider',
      dwCommonInitial: '.zh_CN.dw-f-menusider',
      dwCommonDescription: '左側選單最外層'
    },
    {
      dwCommonvarName: '.en_US.dw-f-menu-ul',
      dwCommonInitial: '.zh_CN.dw-f-menu-ul',
      dwCommonDescription: '選單 ul 層'
    },
    {
      dwCommonvarName: '.en_US.ant-menu-inline',
      dwCommonInitial: '.zh_CN.ant-menu-inline',
      dwCommonDescription: '選單展開'
    },
    {
      dwCommonvarName: '.en_US.ant-menu-inline-collapsed',
      dwCommonInitial: '.zh_CN.ant-menu-inline-collapsed',
      dwCommonDescription: '選單縮小'
    },
    {
      dwCommonvarName: '.en_US.ant-menu-vertical',
      dwCommonInitial: '.zh_CN.ant-menu-vertical',
      dwCommonDescription: '選單縮小直列'
    },
    {
      dwCommonvarName: '.en_US.dw-f-wrapper',
      dwCommonInitial: '.zh_CN.dw-f-wrapper',
      dwCommonDescription: '內容最外層'
    },
    {
      dwCommonvarName: '.en_US.dw-f-header',
      dwCommonInitial: '.zh_CN.dw-f-header',
      dwCommonDescription: '上方抬頭'
    },
    {
      dwCommonvarName: '.en_US.dw-f-content-wp',
      dwCommonInitial: '.zh_CN.dw-f-content-wp',
      dwCommonDescription: '作業內容外層'
    },
    // {
    //   dwCommonvarName: '.en_US.dw-f-footer',
    //   dwCommonInitial: '.zh_CN.dw-f-footer',
    //   dwCommonDescription: '頁尾'
    // },
    {
      dwCommonvarName: '.ant-modal-body .en_US',
      dwCommonInitial: '.ant-modal-body .zh_CN',
      dwCommonDescription: 'modal 彈窗'
    }
  ];

  constructor() {
  }

  ngOnInit(): void {

  }

}
