import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LanguageStyleRoutingModule } from './language-style-routing.module';
import { LanguageStyleComponent } from './language-style/language-style.component';
import { ShowcaseSharedModule } from '../../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    ShowcaseSharedModule,
    LanguageStyleRoutingModule
  ],
  declarations: [LanguageStyleComponent]
})
export class LanguageStyleModule {
}
