import { Directive, forwardRef, OnInit, Optional, TemplateRef, ViewContainerRef } from '@angular/core';
import { DwIdBase } from './dw-id-base';
import { DwComponent } from './dw-component';

@Directive({
  selector: '[dwInsertAfter],[dwInsertAfter][dwInsertAfterOf]',
  providers: [{provide: DwIdBase, useExisting: forwardRef(() => DwInsertAfterDirective)}]
})
export class DwInsertAfterDirective extends DwIdBase implements OnInit {

  constructor(
    public templateRef: TemplateRef<any>,
    public viewContainer: ViewContainerRef,
    @Optional() dwComponent: DwComponent) {
    super(templateRef, viewContainer, dwComponent);
  }

  ngOnInit(): void {
    super.onInit();
  }
}
