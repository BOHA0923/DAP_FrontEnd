import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountInfoRoutingModule } from './account-info-routing.module';
import { AccountInfoComponent } from './account-info.component';
import { ShowcaseSharedModule } from '../../../shared/shared.module';


@NgModule({
  imports: [
    CommonModule,
    ShowcaseSharedModule,
    AccountInfoRoutingModule
  ],
  declarations: [
    AccountInfoComponent
  ]
})

export class AccountInfoModule { }
