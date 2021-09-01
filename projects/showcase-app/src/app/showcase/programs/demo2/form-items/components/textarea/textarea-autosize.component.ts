import { Component } from '@angular/core';

@Component({
  selector: 'dw-textarea-autosize',
  template: `
    <dw-form-textarea dwAutosize
                      [(ngModel)]="description"
                      dwLabel="自適高度"
                      dwPlaceHolder="請輸入文字"
                      dwLabelSpan="6" dwInputSpan="18"></dw-form-textarea>
    <dw-form-textarea [dwAutosize]="{ minRows: 3, maxRows: 6 }"
                      [(ngModel)]="description"
                      dwLabel="限制高度"
                      dwPlaceHolder="請輸入文字"
                      dwLabelSpan="6" dwInputSpan="18"></dw-form-textarea>
    {{ '[dwAutosize]="{ minRows: 3, maxRows: 6 }"' }}
  `
})
export class TextareaAutosizeComponentComponent {

  description = 'hello';

  constructor() { }

}
