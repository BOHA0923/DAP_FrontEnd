import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { DwIconModule } from 'ng-quicksilver/icon';
import { DwButtonModule } from 'ng-quicksilver/button';

import { DwLoginBlockModalComponent } from './login-block-modal.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    DwIconModule,
    DwButtonModule,
  ],
  providers: [],
  declarations: [DwLoginBlockModalComponent],
  entryComponents: [DwLoginBlockModalComponent],
  exports: [DwLoginBlockModalComponent]
})
export class DwLoginBlockModalModule {}
