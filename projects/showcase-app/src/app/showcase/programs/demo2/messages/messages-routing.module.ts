import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShowcaseSendMessagesComponent } from './send-messages/send-messages.component';
import { ShowcaseRouteBackPageComponent } from './route-back-page/route-back-page.component';
import { DwAuthGuardService } from '@webdpt/framework/auth';
import { DwLanguageService } from '@webdpt/framework/language';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dw-send-message'
  },
  {
    path: 'dw-send-message',
    component: ShowcaseSendMessagesComponent,
    canActivate: [DwAuthGuardService],
    data: {
      dwRouteData: {
        dwAuthId: 'dw-messages',
        programId: 'dw-messages'
      }
    },
    resolve: {
      transaction: DwLanguageService
    }
  },
  {
    path: 'dw-route-back-page',
    component: ShowcaseRouteBackPageComponent,
    canActivate: [DwAuthGuardService],
    data: {
      dwRouteData: {
        dwAuthId: 'dw-messages',
        programId: 'dw-messages'
      }
    },
    resolve: {
      transaction: DwLanguageService
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShowcaseMessagesRoutingModule { }
