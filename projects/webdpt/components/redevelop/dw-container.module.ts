import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DwReplaceDirective } from './dw-replace.directive';
import { DwInsertBeforeDirective } from './dw-insert-before.directive';
import { DwInsertAfterDirective } from './dw-insert-after.directive';
import { DwForOfDirective } from './dw-for.directive';
import { DwIdDirective } from './dw-id.directive';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    DwIdDirective,
    DwForOfDirective,
    DwInsertAfterDirective,
    DwInsertBeforeDirective,
    DwReplaceDirective
  ],
  entryComponents: [],
  providers: [],
  exports: [
    DwIdDirective,
    DwForOfDirective,
    DwInsertAfterDirective,
    DwInsertBeforeDirective,
    DwReplaceDirective
  ]
})
export class DwContainerModule { }
