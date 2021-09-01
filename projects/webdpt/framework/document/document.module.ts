import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DwDocDeleteDirective } from './directive/document-delete.directive';
import { DwDocReadDirective } from './directive/document-read.directive';
import { DwDocSaveDirective } from './directive/document-save.directive';


/**
 * Document Module
 *
 * @export
 */
@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    DwDocSaveDirective,
    DwDocDeleteDirective,
    DwDocReadDirective
  ],
  exports: [
    DwDocSaveDirective,
    DwDocDeleteDirective,
    DwDocReadDirective
  ]
})
export class DwDocumentModule { }
