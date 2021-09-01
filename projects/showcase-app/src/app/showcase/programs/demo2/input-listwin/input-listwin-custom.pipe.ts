import { Injectable, Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'InputListwinCustomPipe'
})
export class InputListwinCustomPipe implements PipeTransform {
  constructor(
    private sanitized: DomSanitizer
  ) {
  }

  transform(datas: any, args?: Array<any>): any {
    const _color = (datas === 'C01') ? args[1] : 'blue';
    return this.sanitized.bypassSecurityTrustHtml(`<span style="${args[0]}: ${_color};">${datas}</span>`);
  }

}
