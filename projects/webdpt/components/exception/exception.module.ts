import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { TranslateModule } from '@ngx-translate/core';
import { DwModalModule } from 'ng-quicksilver/modal';

import { DwExceptionComponent } from './exception.component';


@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    DwModalModule,
    TranslateModule
  ],
  declarations: [DwExceptionComponent],
  entryComponents: [DwExceptionComponent],
  exports: [DwExceptionComponent]
})
export class DwExceptionModule {}
