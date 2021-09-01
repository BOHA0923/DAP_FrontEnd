import { Directive, ElementRef, HostListener } from '@angular/core';
import { DwDocument } from '../document';

@Directive({
  selector: '[dwDocSave]]'
})
export class DwDocSaveDirective {
  constructor(private el: ElementRef, private doc: DwDocument) { }

  @HostListener('click') onClick(): void {
    this.doc.save().subscribe();
  }
}
