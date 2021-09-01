import { APP_INITIALIZER, InjectionToken, ModuleWithProviders, NgModule, Provider } from '@angular/core';
import { DwServiceWorkerUpdateService } from './sw-update.service';
import { ServiceWorkerModule } from '@angular/service-worker';
import { DwSwUpdateContentComponent } from './sw-update-content.component';

export const SERVICE_WORK_INTERVAL: InjectionToken<number> = new InjectionToken<number>('SERVICE_WORK_INTERVAL');
export const SERVICE_WORK_ENABLE: InjectionToken<number> = new InjectionToken<number>('SERVICE_WORK_ENABLE');

export function initServiceWorker(interval: number, enable: boolean, swUpdater: DwServiceWorkerUpdateService): any {
    const func = (): any => {
      if (enable) {
        swUpdater.initialize(interval, enable);
      }
    };
    return func;
}

@NgModule({
  imports: [
  ],
  declarations: [
    DwSwUpdateContentComponent
  ],
  entryComponents: [
    DwSwUpdateContentComponent
  ],
  exports: [
    ServiceWorkerModule,
    DwSwUpdateContentComponent
  ]
})
export class DwServiceWorkerModule {
  static forRoot(interval: number, enable: boolean): ModuleWithProviders<DwServiceWorkerModule> {
    return {
      ngModule: DwServiceWorkerModule,
      providers: [
        ...ServiceWorkerModule.register('/ngsw-worker.js', { enabled: enable }).providers,
        DwServiceWorkerUpdateService,
        {
          provide: SERVICE_WORK_INTERVAL,
          useValue: interval
        },
        {
          provide: SERVICE_WORK_ENABLE,
          useValue: enable
        },
        {
          provide: APP_INITIALIZER,
          useFactory: initServiceWorker,
          deps: [SERVICE_WORK_INTERVAL, SERVICE_WORK_ENABLE, DwServiceWorkerUpdateService],
          multi: true
        }
      ]
    };
  }
}
