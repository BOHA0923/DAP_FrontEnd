import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';

import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

registerLocaleData(zh);

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));
