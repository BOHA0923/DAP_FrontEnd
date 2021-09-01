import { Directive, forwardRef, OnInit, Optional, TemplateRef, ViewContainerRef } from '@angular/core';
import { DwIdBase } from './dw-id-base';
import { DwComponent } from './dw-component';

@Directive({
  selector: '[dwReplace],[dwReplace][dwReplaceOf]',
  providers: [{provide: DwIdBase, useExisting: forwardRef(() => DwReplaceDirective)}]
})
export class DwReplaceDirective extends DwIdBase implements OnInit {

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
