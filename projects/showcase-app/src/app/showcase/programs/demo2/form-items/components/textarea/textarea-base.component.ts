import { Component } from '@angular/core';

@Component({
  selector: 'dw-textarea-base',
  template: `
    <dw-form-textarea [(ngModel)]="description"
                      dwLabel="{{'說明' | translate}}"
                      dwPlaceHolder="請輸入文字"
                      dwLabelSpan="4" dwInputSpan="20"></dw-form-textarea>
    說明：{{description}}
  `
})
export class TextareaBaseComponent {

  description = 'hello';

  constructor() { }

}
