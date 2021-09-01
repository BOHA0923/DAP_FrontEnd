import { Injectable, Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'DwtranslatePipe'
})
export class DwTranslatePipe implements PipeTransform {
  transform(property: string | string[], ...args: any[]): string | string[] {
    // console.log(args[0]);
    // language='en'|'cn'|'tw'
    const regex = /{{\$.+?}}/;
    const regexG = /{{\$.+?}}/g;
    const language = args[0].language;
    const translation = args[0].translation;
    let strArr: string[] = [];
    const reStr: string[] = [];
    if (typeof property !== 'string') {
      strArr = Object.assign(strArr, property);
    } else {
      strArr.push(property.toString());
    }
    for (let i = 0; i < strArr.length; i++) {
      let str = translation[language][strArr[i]];
      if (!str) {
        str = strArr[i];
      }
      let replaceArr: any[] = [];
      if (args[0].hasOwnProperty('replaceArr')) {
        replaceArr = Object.assign(replaceArr, args[0].replaceArr);
      }
      if (replaceArr.length) {
        while (replaceArr.length) {
          str = str.replace(regex, replaceArr.shift());
        }
      }
      // 如果有{{$xxx}},替換''
      str = str.replace(regexG, '');
      reStr.push(str);
    }

    if (reStr.length > 1) {
      // console.log(reStr);
      return reStr;
    } else {
      return reStr[0];
    }

  }

}
