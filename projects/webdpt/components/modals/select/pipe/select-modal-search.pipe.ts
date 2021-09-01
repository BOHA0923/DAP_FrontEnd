import { Injectable, Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'DwSelectModalSearchPipe'
})
export class DwSelectModalSearchPipe implements PipeTransform {
  transform(datas: any, args?: string): any {
    if (!args) {
      return datas;
    }

    return datas.filter((item: any) => {
      return Object.values(item).find((param: any) => {
        if (param === null || param === undefined || param === '') {
          return;
        }

        // 當欄位值有可能是 object 時, toString() 無法轉換成字串.
        return JSON.stringify(param).indexOf(args) >= 0;
      });
    });
  }

}
