import { CommonModule } from '@angular/common';
import { APP_INITIALIZER, ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DwLanguageSetupService } from './language-setup.service';

import { Observable } from 'rxjs';

import { DwLanguageStylePipe } from './pipe/language-style.pipe';
import { DW_I18N, en_US } from 'ng-quicksilver/i18n';

export function ngQuicksilverLanguageSetupFactory(languageSetup: DwLanguageSetupService): Function {
  const func = (): any => {
    const promise = new Observable((observer): void => {
      observer.next(true);
      observer.complete();
    }).toPromise();
    return promise;
  };
  return func;
}

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [
    DwLanguageStylePipe
  ],
  exports: [
    DwLanguageStylePipe
  ]
})
export class DwLanguageCoreModule {
  static forRoot(): ModuleWithProviders<DwLanguageCoreModule> {
    return {
      ngModule: DwLanguageCoreModule,
      providers: [
        {
          provide: DW_I18N,
          useValue: en_US
        },
        DwLanguageSetupService,
        DwLanguageStylePipe,
        {
          provide: APP_INITIALIZER,
          useFactory: ngQuicksilverLanguageSetupFactory,
          deps: [DwLanguageSetupService],
          multi: true
        }
      ]
    };
  }
}
