import { NgModule } from '@angular/core';
import {
  CommonModule,
  CurrencyPipe,
  DatePipe,
  DecimalPipe,
  I18nSelectPipe,
  JsonPipe,
  LowerCasePipe,
  PercentPipe,
  SlicePipe,
  UpperCasePipe,
  TitleCasePipe
} from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DwFormModule } from 'ng-quicksilver/form';
import { DwTableModule } from 'ng-quicksilver/table';
import { DwInputModule } from 'ng-quicksilver/input';
import { DwTagModule } from 'ng-quicksilver/tag';
import { DwRadioModule } from 'ng-quicksilver/radio';
import { DwLayoutModule } from 'ng-quicksilver/layout';

import { DwSelectModalComponent } from './select-modal.component';
import { DwSelectModalSearchPipe } from './pipe/select-modal-search.pipe';
import { TranslateModule } from '@ngx-translate/core';
import { DwSelectModalCustomFilterPipe } from './pipe/select-modal-custom-filter.pipe';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    DwFormModule,
    DwTableModule,
    DwInputModule,
    DwTagModule,
    DwRadioModule,
    DwLayoutModule,
    TranslateModule
  ],
  declarations: [
    DwSelectModalComponent,
    DwSelectModalSearchPipe,
    DwSelectModalCustomFilterPipe
  ],
  entryComponents: [ // 所有要 [ 動態 ] 加載的組件, 都需要在entryComponents模塊部分進行聲明。
    DwSelectModalComponent
  ],
  providers: [
    DwSelectModalSearchPipe,
    DwSelectModalCustomFilterPipe,
    CurrencyPipe,
    DatePipe,
    DecimalPipe,
    I18nSelectPipe,
    JsonPipe,
    LowerCasePipe,
    PercentPipe,
    SlicePipe,
    UpperCasePipe,
    TitleCasePipe
  ]
})
export class DwSelectModalModule { }
