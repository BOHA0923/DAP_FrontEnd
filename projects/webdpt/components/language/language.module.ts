import { APP_INITIALIZER, ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


import { DwButtonModule } from 'ng-quicksilver/button';
import { DwSelectModule } from 'ng-quicksilver/select';
import { DwIconModule } from 'ng-quicksilver/icon';
import { TranslateModule } from '@ngx-translate/core';
import { DwLanguageComponent } from './language.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DwButtonModule,
    DwSelectModule,
    DwIconModule
  ],
  declarations: [DwLanguageComponent],
  exports: [
    TranslateModule,
    DwLanguageComponent
  ]
})
export class DwLanguageModule {}
