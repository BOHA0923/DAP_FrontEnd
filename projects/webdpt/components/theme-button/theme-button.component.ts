import { Component, OnInit, Input, TemplateRef, } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'dw-theme-button',
  templateUrl: './theme-button.component.html',
  styleUrls: ['./theme-button.component.less'],
})
export class DwThemeButtonComponent implements OnInit {
  @Input()
  componentTemplate: string | TemplateRef<void>;
  @Input()
  dwGhost: boolean = false;
  @Input()
  dwLoading: boolean = false;
  @Input()
  dwType: string = 'primary';
  @Input()
  dwSize: string = 'default';
  @Input()
  dwShape: string = 'circle';
  @Input()
  dwTitle: string = '佈景主題樣式';
  @Input()
  dwPlacement: string = 'bottom';
  @Input()
  dwBlock: boolean = false;
  @Input()
  dwTrigger: string = 'click'; // click|hover|focus
  private _dwPopWidth: number = 350;
  @Input()
  set dwPopWidth(val: any) {
    this._dwPopWidth = val;
    this.listWidth = this.dwPopWidth / this.dwColorColSplit;
  }
  get dwPopWidth(): any {
    return this._dwPopWidth;
  }
  private _dwColorColSplit: number = 2;

  @Input()
  set dwColorColSplit(val: any) {
    this._dwColorColSplit = val;
    this.listWidth = this.dwPopWidth / this.dwColorColSplit;
  }
  get dwColorColSplit(): any {
    return this._dwColorColSplit;
  }
  @Input()
  dwShowDesc: boolean = true;

  listWidth: number = this.dwPopWidth / this.dwColorColSplit;
  prefix: string = 'customTheme-';
  nowThemeStyleId = 'default';
  private _themeList: any[] = [{ id: 'default', path: 'default', description: '預設樣式' }];
  @Input()
  set themeList(val: any[]) {
    const idx = val.findIndex(v => v.id === 'default');
    if (idx !== -1) {
      this._themeList = val;
    } else {
      this._themeList = [...this._themeList, ...val];
    }
    // this._themeList.forEach(i => {
    //   i.showDesc = this.dwShowDesc;
    // });
  }
  get themeList(): any[] {
    return this._themeList;
  }
  defaultTheme: any = { id: 'default', path: 'default', description: '預設樣式' };
  constructor(private http: HttpClient) {
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
  }

}
