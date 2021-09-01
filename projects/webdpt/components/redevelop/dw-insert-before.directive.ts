import { Directive, forwardRef, Host, OnInit, Optional, TemplateRef, ViewContainerRef } from '@angular/core';
import { DwIdBase } from './dw-id-base';
import { DwComponent } from './dw-component';

@Directive({
  selector: '[dwInsertBefore],[dwInsertBefore][dwInsertBeforeOf]',
  providers: [{provide: DwIdBase, useExisting: forwardRef(() => DwInsertBeforeDirective)}]
})
export class DwInsertBeforeDirective extends DwIdBase implements OnInit {

  constructor(
    public templateRef: TemplateRef<any>,
    public viewContainer: ViewContainerRef,
    @Host() @Optional() dwComponent: DwComponent) {
    super(templateRef, viewContainer, dwComponent);
  }

  ngOnInit(): void {
    super.onInit();
  }
}
