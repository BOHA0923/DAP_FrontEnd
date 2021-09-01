import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DwIconModule } from 'ng-quicksilver/icon';
import { DwButtonModule } from 'ng-quicksilver/button';
import { DwFormModule } from 'ng-quicksilver/form';
import { DwGridModule } from 'ng-quicksilver/grid';
import { DwCardModule } from 'ng-quicksilver/card';
import { DwInputModule } from 'ng-quicksilver/input';

import { ShowcaseSharedModule } from '../../../shared/shared.module';
import { ShowcaseMessagesRoutingModule } from './messages-routing.module';
import { ShowcaseSendMessagesComponent } from './send-messages/send-messages.component';
import { ShowcaseSinglePageComponent } from './single-page/single-page.component';
import { ShowcaseSinglePageBatchComponent } from './single-page-batch/single-page-batch.component';
import { ShowcaseRoutedMessageComponent } from './routed-message/routed-message.component';
import { ShowcaseRouteBackPageComponent } from './route-back-page/route-back-page.component';

@NgModule({
  imports: [
    CommonModule,
    DwIconModule,
    DwButtonModule,
    DwFormModule,
    DwGridModule,
    DwCardModule,
    DwInputModule,
    ShowcaseSharedModule,
    ShowcaseMessagesRoutingModule,
  ],
  declarations: [
    ShowcaseSendMessagesComponent,
    ShowcaseSinglePageComponent,
    ShowcaseSinglePageBatchComponent,
    ShowcaseRoutedMessageComponent,
    ShowcaseRouteBackPageComponent]
})
export class ShowcaseMessagesModule {
}
