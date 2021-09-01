import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Provider } from '@angular/compiler/src/core';

import { DwMockModule } from '@webdpt/framework/mock';
import { DW_MOCK, DW_APP_AUTH_TOKEN } from '@webdpt/framework/config';
import { environment } from '../../environments/environment';
import { DigiMiddlewareAuthApp } from './app-auth-token';


@NgModule({
  imports: [
    CommonModule,
    DwMockModule
  ],
  declarations: []
})
export class SystemModule {
  static forRoot(providers: Provider[]): ModuleWithProviders<SystemModule> {
    return {
      ngModule: SystemModule,
      providers: [
        {
          provide: DW_MOCK,
          useValue: environment.mock
        },
        {
          provide: DW_APP_AUTH_TOKEN,
          useValue: DigiMiddlewareAuthApp
        },
        ...providers
      ]
    };
  }
}
