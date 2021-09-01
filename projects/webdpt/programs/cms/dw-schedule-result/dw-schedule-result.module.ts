import { NgModule, Provider, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { DwDocument } from '@webdpt/framework/document';

import { DwGridModule } from 'ng-quicksilver/grid';
import { DwFormModule } from 'ng-quicksilver/form';
import { DwButtonModule } from 'ng-quicksilver/button';
import { DwIconModule } from 'ng-quicksilver/icon';
import { DwSelectModule } from 'ng-quicksilver/select';
import { DwDatePickerModule } from 'ng-quicksilver/date-picker';
import { DwTableModule } from 'ng-quicksilver/table';
import { DwLayoutModule } from 'ng-quicksilver/layout';
import { DwFormItemsModule } from '@webdpt/components/form-items';
import { DwModalModule } from 'ng-quicksilver/modal';

import { DwScheduleResultRoutingModule } from './dw-schedule-result-routing.module';
import { DwScheduleResultComponent } from './dw-schedule-result.component';
import { DwScheduleResultListComponent } from './dw-schedule-result-list/dw-schedule-result-list.component';
import { DwScheduleResultMessageComponent } from './dw-schedule-result-message/dw-schedule-result-message.component';

// 排程任務記錄
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    DwFormItemsModule,
    DwGridModule,
    DwFormModule,
    DwButtonModule,
    DwIconModule,
    DwSelectModule,
    DwDatePickerModule,
    DwTableModule,
    DwLayoutModule,
    DwModalModule,
    DwScheduleResultRoutingModule
  ],
  declarations: [
    DwScheduleResultComponent,
    DwScheduleResultListComponent,
    DwScheduleResultMessageComponent
  ],
  entryComponents: [ // 對話框使用component模式，需要加入自定義component
    DwScheduleResultMessageComponent
  ],
  exports: [
    DwScheduleResultRoutingModule,
    DwScheduleResultComponent,
    DwScheduleResultListComponent,
    DwScheduleResultMessageComponent
  ],
  providers: [
    DwDocument,
    { provide: 'DocumentResource', useValue: 'restful/service/DWSys/schedule/result' } // 排程執行結果
  ],
})
export class DwScheduleResultModule {
  static forRoot(providers: Provider[]): ModuleWithProviders<DwScheduleResultModule> {
    return {
      ngModule: DwScheduleResultModule,
      providers: [
        ...providers
      ]
    };
  }
}
