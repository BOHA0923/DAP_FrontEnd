import { Directive, forwardRef, OnInit, Optional, TemplateRef, ViewContainerRef } from '@angular/core';
import { DwIdBase } from './dw-id-base';
import { DwComponent } from './dw-component';

@Directive({
  selector: '[dwId],[dwId][dwIdOf]',
  providers: [{provide: DwIdBase, useExisting: forwardRef(() => DwIdDirective)}]
})
export class DwIdDirective extends DwIdBase implements OnInit {

  constructor(
    @Optional() public templateRef: TemplateRef<any>,
    @Optional() public viewContainer: ViewContainerRef,
    @Optional() dwComponent: DwComponent) {
    super(templateRef, viewContainer, dwComponent);
  }

  ngOnInit(): void {
    super.onInit();
  }

}
