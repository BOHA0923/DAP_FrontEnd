import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { DwTreeModule } from 'ng-quicksilver/tree';
import { DwGridModule } from 'ng-quicksilver/grid';
import { DwInputModule } from 'ng-quicksilver/input';
import { DwIconModule } from 'ng-quicksilver/icon';
import { DwButtonModule } from 'ng-quicksilver/button';

import { TranslateModule } from '@ngx-translate/core';

import { DwOrganizeTreeModalComponent } from './organize-tree-modal.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    DwTreeModule,
    DwGridModule,
    DwInputModule,
    DwIconModule,
    DwButtonModule,
    TranslateModule
  ],
  declarations: [
    DwOrganizeTreeModalComponent
  ],
  entryComponents: [ // 所有要 [ 動態 ] 加載的組件, 都需要在entryComponents模塊部分進行聲明。
    DwOrganizeTreeModalComponent
  ]
})
export class DwOrganizeTreeModalModule { }
