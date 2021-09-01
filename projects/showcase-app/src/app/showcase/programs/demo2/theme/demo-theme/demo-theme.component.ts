import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';

import { ThemeBaseComponent } from './theme-base/theme-base.component';
const themeBaseCode = require('!raw-loader!./theme-base/theme-base.component.ts');
import { ThemeButtonTemplateComponent } from './theme-button-template/theme-button.template';
const themeTmpCode = require('!raw-loader!./theme-button-template/theme-button.template.ts');
import { ThemePopComponent } from './theme-pop/theme-pop.component';
const themePopCode = require('!raw-loader!./theme-pop/theme-pop.component.ts');
import { DwSystemConfigService } from '@webdpt/framework/config';

@Component({
  selector: 'app-demo-theme',
  templateUrl: './demo-theme.component.html'
  // styleUrls: ['./demo-theme.component.less']
})
export class DemoThemeComponent implements OnInit, OnDestroy {
  subsc: Subscription;
  dataSet2 = [
    {
      dwCommonvarName: '@dw-f-header-h:',
      dwCommonInitial: '42px;',
      dwCommonDescription: 'Header 的高度'
    },
    {
      dwCommonvarName: '@dw-f-tabbar-h:',
      dwCommonInitial: '48px',
      dwCommonDescription: 'Tabbar 頁籤的高度'
    },
    // {
    //   dwCommonvarName: '@dw-f-footer-h:',
    //   dwCommonInitial: '28px;',
    //   dwCommonDescription: 'Footer 的高度'
    // },
    {
      dwCommonvarName: '@dw-f-siderWidth:',
      dwCommonInitial: '200px',
      dwCommonDescription: '左側 sider 的寬度'
    },
    {
      dwCommonvarName: '@dw-f-siderCollapsedWidt:',
      dwCommonInitial: '72px;',
      dwCommonDescription: '左側 sider 縮小的寬度'
    },
    {
      dwCommonvarName: '@body-background:',
      dwCommonInitial: '#fff;',
      dwCommonDescription: '<body> 的背景色'
    },
    {
      dwCommonvarName: '@layout-body-background:',
      dwCommonInitial: '#f0f2f5;',
      dwCommonDescription: 'layout  背景色'
    },
    {
      dwCommonvarName: '@layout-header-background:',
      dwCommonInitial: '#001529;',
      dwCommonDescription: 'layout-header 背景色'
    },
    {
      dwCommonvarName: '@layout-footer-background:',
      dwCommonInitial: '@layout-body-background;',
      dwCommonDescription: '頁尾背景色'
    },
    {
      dwCommonvarName: '@layout-sider-background:',
      dwCommonInitial: '@layout-header-background;',
      dwCommonDescription: '左側 sider 背景色'
    },
    {
      dwCommonvarName: '@iframe-finereport-background-color:',
      dwCommonInitial: '#001529;',
      dwCommonDescription: 'iframe 相關頁面 背景色'
    },
    {
      dwCommonvarName: '@text-color:',
      dwCommonInitial: 'fade(rgb(0, 0, 0), 65%);',
      dwCommonDescription: '文字顏色'
    },
    {
      dwCommonvarName: '@link-color:',
      dwCommonInitial: '@primary-color;',
      dwCommonDescription: '文字連結顏色'
    },
    {
      dwCommonvarName: '@tabs-hover-color:',
      dwCommonInitial: '@primary-5;',
      dwCommonDescription: '頁籤 hover 文字顏色'
    },
    {
      dwCommonvarName: '@tabs-card-active-color:',
      dwCommonInitial: '@primary-7;',
      dwCommonDescription: '頁籤 active 文字顏色'
    },
    {
      dwCommonvarName: '@btn-primary-color:',
      dwCommonInitial: '#fff;',
      dwCommonDescription: '主按鈕文字顏色'
    },
    {
      dwCommonvarName: '@btn-primary-bg:',
      dwCommonInitial: '@primary-color;',
      dwCommonDescription: '主按鈕 背景色'
    },
    {
      dwCommonvarName: '@menu-inline-toplevel-item-height:',
      dwCommonInitial: '40px;',
      dwCommonDescription: 'Slider Menu item 行距主按鈕 背景色'
    },
    {
      dwCommonvarName: '@menu-item-height:',
      dwCommonInitial: '40px;',
      dwCommonDescription: 'Slider Menu item 高度'
    },
    {
      dwCommonvarName: '@menu-collapsed-width:',
      dwCommonInitial: '72px;',
      dwCommonDescription: 'Slider Menu item 縮小選單的寬度'
    },
    {
      dwCommonvarName: '@menu-bg:',
      dwCommonInitial: '@component-background;',
      dwCommonDescription: 'Slider Menu item ul 背景色'
    },
    {
      dwCommonvarName: '@menu-dark-color:',
      dwCommonInitial: '@text-color-secondary-dark;',
      dwCommonDescription: 'Slider Menu item 文字顏色'
    },
    {
      dwCommonvarName: '@menu-dark-bg:',
      dwCommonInitial: '@layout-header-background;',
      dwCommonDescription: 'Slider Menu item 背景色'
    },
    {
      dwCommonvarName: '@menu-dark-arrow-color:',
      dwCommonInitial: '#fff;',
      dwCommonDescription: 'Slider Menu item ' > ' 符號色'
    },
    {
      dwCommonvarName: '@menu-dark-submenu-bg:',
      dwCommonInitial: '#000c17;',
      dwCommonDescription: 'Slider Menu item 次選項背景色'
    },
    {
      dwCommonvarName: '@menu-dark-highlight-color:',
      dwCommonInitial: '#fff;',
      dwCommonDescription: 'Slider Menu item active 文字顏色'
    },
    {
      dwCommonvarName: '@menu-dark-item-active-bg:',
      dwCommonInitial: '@primary-color;',
      dwCommonDescription: 'Slider Menu item active  背景色'
    }
  ];
  prefix: string = 'customTheme-';
  nowThemeStyleId = 'default';
  defaultTheme: any[] = [{
    id: 'default',
    path: 'default',
    description: '預設樣式'
  }];
  themeBase: any = ThemeBaseComponent;
  themeBaseCodeString: string = themeBaseCode;
  themeTmp: any = ThemeButtonTemplateComponent;
  themeTmpCodeString: string = themeTmpCode;
  themePop: any = ThemePopComponent;
  themePopCodeString: string = themePopCode;
  sampleTheme: any[] = [{ id: 'theme-green', path: 'assets/themes/theme-green.css', description: '樣式-green' }];
  // themeList: any[] = [];
  constructor(
    private http: HttpClient
    ) {
    // this.http.get('assets/themes/themeJson.json')
    //   .pipe(
    //     map((res: any) => {
    //       res.forEach(i => {
    //         let id = i.id;
    //         i.description = id;
    //         switch (id) {
    //           case id = 'theme-green':
    //             i.description = '樣式-green';
    //             break;
    //           case id = 'theme-red':
    //             i.description = '樣式-red';
    //             break;
    //           case id = 'theme-yellow':
    //             i.description = '樣式-yellow';
    //             break;
    //           case id = 'theme-white':
    //             i.description = '樣式-white';
    //             break;
    //           default:
    //             break;
    //         }
    //       });
    //       return res;
    //     })
    //   )
    //   .subscribe((res: any) => {
    //     console.log(res);
    //     this.themeList = [...this.themeList, ...res];
    //     console.log(this.themeList);
    //   });
  }
  changeTheme(theme: any): void {
    if (theme.id === 'default') {
      this.removeOtherThemeStyle();
      this.nowThemeStyleId = 'default';
      return;
    }
    const regEx = /([^\/]+)\.css/g;
    const match = regEx.exec(theme.path);
    if (!!match) {
      const elem = document.querySelector('#' + match[1]);
      if (!elem) {
        this.removeOtherThemeStyle();
        this.http.get(theme.path, { responseType: 'text' })
          .subscribe(
            (res) => {
              const css = res;
              const head = document.head || document.getElementsByTagName('head')[0];
              const style = document.createElement('style');
              style.id = this.prefix + match[1];
              style.type = 'text/css';
              style.appendChild(document.createTextNode(css));
              head.appendChild(style);
              this.nowThemeStyleId = match[1];
            }
          );
      }
    }

  }
  removeOtherThemeStyle(): void {
    const elems = document.querySelectorAll('style');
    const head = document.head || document.getElementsByTagName('head')[0];

    if (elems.length) {
      for (let i = 0; i < elems.length; i++) {
        if (!!elems[i].id && elems[i].id.search(this.prefix) !== -1) {
          head.removeChild(elems[i]);
        }
      }
    }
  }
  ngOnInit(): void {
    // this.subsc = fromEvent(document.body, 'click').subscribe(res => console.log(res));
  }
  ngOnDestroy(): void {
    // console.log('theme destory');
    // if( this.subsc ) {
    //   this.subsc.unsubscribe();
    // }
  }
}
