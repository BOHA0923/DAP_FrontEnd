import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { DwSsoLoginRoutingModule } from './sso-login-routing.module';
import { DwSsoLoginComponent } from './sso-login.component';
import { DwSsoButtonComponent } from './sso-button/sso-button.component';


@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    DwSsoLoginRoutingModule,
  ],
  declarations: [DwSsoLoginComponent, DwSsoButtonComponent],
  exports: [DwSsoButtonComponent]
})
export class DwSsoLoginModule { }
