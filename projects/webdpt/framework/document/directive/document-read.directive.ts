import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { DwDocument } from '../document';

@Directive({
  selector: '[dwDocRead]]'
})
export class DwDocReadDirective {
  @Input() oid: object;
  constructor(private el: ElementRef, private doc: DwDocument) { }

  @HostListener('click') onClick(): void {
    // let oid = this.oid || [];
    // oid = (Array.isArray(oid)) ? oid : [oid];
    this.doc.read([this.oid]).subscribe();
  }
}
