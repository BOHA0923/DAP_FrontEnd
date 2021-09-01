import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DateToStringDirective } from './date-to-string.directive';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [DateToStringDirective],
  exports: [
    DateToStringDirective
  ]
})
export class DwDateToStringModule { }
