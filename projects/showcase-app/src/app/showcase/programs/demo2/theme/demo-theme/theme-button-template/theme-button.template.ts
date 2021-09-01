import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
@Component({
  selector: 'cust-theme-button-template',
  template: `
  <div style="width:50px">
    <dw-theme-button
      [themeList]="themeList"
      dwType="primary"
      dwSize="default"
      dwShape="circle"
      dwTrigger="click"
      dwPopWidth ="100"
      dwColorColSplit = "2"
      dwPlacement = "bottom"
      [dwShowDesc]= "false"
      [componentTemplate]="componentTemplate"
      dwTitle="佈景主題樣式-元件">
  </dw-theme-button>
  </div>
  <ng-template #componentTemplate>
  <a>選擇樣式</a>
  </ng-template>
  `
})
export class ThemeButtonTemplateComponent implements OnInit {

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

