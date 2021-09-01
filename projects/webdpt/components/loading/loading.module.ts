import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DwSpinModule } from 'ng-quicksilver/spin';

import { DwLoadingHttpComponent } from './spin/loading-http.component';

@NgModule({
  imports: [
    CommonModule,
    DwSpinModule
  ],
  declarations: [
    DwLoadingHttpComponent
  ],
  entryComponents: [
    DwLoadingHttpComponent
  ],
  exports: []
})
export class DwLoadingModule {}
