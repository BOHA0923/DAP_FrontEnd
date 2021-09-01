import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FrameworkUIModule } from '@webdpt/components';


/**
 * 共享模組
 *
 * @export
 * @class ShowcaseSharedModule
 */
@NgModule({
  imports: [
    CommonModule
  ],
  exports: [
    FrameworkUIModule
  ]
})
export class ShowcaseSharedModule { }
