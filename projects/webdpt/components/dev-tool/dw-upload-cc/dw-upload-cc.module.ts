import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { DwTreeService } from 'ng-quicksilver/tree';
import { DwGridModule } from 'ng-quicksilver/grid';
import { DwButtonModule } from 'ng-quicksilver/button';
import { DwTableModule } from 'ng-quicksilver/table';
import { DwToolTipModule } from 'ng-quicksilver/tooltip';
import { DwLayoutModule } from 'ng-quicksilver/layout';
import { DwUploadCcComponent } from './dw-upload-cc.component';
import { DwUploadCcListComponent } from './dw-upload-cc-list/dw-upload-cc-list.component';

// 上傳互聯應用
@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    RouterModule,
    DwGridModule,
    DwButtonModule,
    DwTableModule,
    DwToolTipModule,
    DwLayoutModule,
  ],
  declarations: [
    DwUploadCcComponent,
    DwUploadCcListComponent
  ],
  exports: [
    DwUploadCcComponent,
    DwUploadCcListComponent
  ],
  providers: [
    DwTreeService
  ]
})
export class DwUploadCcModule { }
