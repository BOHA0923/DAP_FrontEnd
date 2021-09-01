import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { DwFormModule } from 'ng-quicksilver/form';
import { DwSelectModule } from 'ng-quicksilver/select';
import { DwButtonModule } from 'ng-quicksilver/button';
import { DwIconModule } from 'ng-quicksilver/icon';
import { DwInputModule } from 'ng-quicksilver/input';
import { DwGridModule } from 'ng-quicksilver/grid';

import { TranslateModule } from '@ngx-translate/core';

import { DwUpdatePasswordModalComponent } from './update-password-modal.component';


@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DwFormModule,
    DwSelectModule,
    DwButtonModule,
    DwIconModule,
    DwInputModule,
    // DwGridModule,
    TranslateModule
  ],
  declarations: [
    DwUpdatePasswordModalComponent
  ],
  entryComponents: [ // 所有要 [ 動態 ] 加載的組件, 都需要在entryComponents模塊部分進行聲明。
    DwUpdatePasswordModalComponent
  ]
})
export class DwUpdatePasswordModalModule { }
