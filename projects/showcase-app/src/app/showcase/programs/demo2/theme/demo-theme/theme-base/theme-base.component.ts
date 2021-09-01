import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
@Component({
  selector: 'cust-theme-base',
  template: `
    <dw-theme-button
      [themeList]="themeList"
      dwType="primary"
      dwSize="default"
      dwShape="circle"
      dwTrigger="click"
      dwPopWidth ="350"
      dwColorColSplit = "2"
      [dwShowDesc]= "true"
      dwTitle="佈景主題樣式-元件">
  </dw-theme-button>
  `
})
export class ThemeBaseComponent implements OnInit {

  themeList: any[] = [];
  constructor(private http: HttpClient) {
    this.http.get('assets/themes/themeJson.json')
      .pipe(
        map((res: any) => {
          res.forEach(i => {
            let id = i.id;
            i.description = id;
            switch (id) {
              case id = 'theme-green':
                i.description = '樣式-green';
                break;
              case id = 'theme-red':
                i.description = '樣式-red';
                break;
              case id = 'theme-yellow':
                i.description = '樣式-yellow';
                break;
              case id = 'theme-white':
                i.description = '樣式-white';
                break;
              default:
                break;
            }
          });
          return res;
        })
      )
      .subscribe((res: any) => {
        this.themeList = [...this.themeList, ...res];
      });
  }

  ngOnInit(): void {
  }

}

