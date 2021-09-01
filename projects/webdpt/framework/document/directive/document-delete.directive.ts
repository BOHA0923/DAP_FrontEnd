import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { DwDocument } from '../document';

@Directive({
  selector: '[dwDocDelete]]'
})
export class DwDocDeleteDirective {
  @Input() oid: Object;
  constructor(private el: ElementRef, private doc: DwDocument) { }

  @HostListener('click') onClick(): void {
    const oid = [this.oid];
    this.doc.delete(oid).subscribe();
  }
}
