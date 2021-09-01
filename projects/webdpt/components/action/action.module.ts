import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DwActionAuthorizedDirective } from './action-authorized.directive';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    DwActionAuthorizedDirective
  ],
  exports: [
    DwActionAuthorizedDirective
  ]
})
export class DwActionModule {}
