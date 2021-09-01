import { OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { DwPostMessageFactoryService } from './post-message-factory.service';

export class DwPostMessageManager implements OnDestroy {
  static __listeners__: Function[] = [];
  readonly __destroy$__: Subject<any> = new Subject<any>();

  constructor(public messageService: DwPostMessageFactoryService) {
    while (DwPostMessageManager.__listeners__.length > 0) {
      const func = DwPostMessageManager.__listeners__.pop();
      func.apply(this);
    }
  }

  ngOnDestroy(): void {
    this.__destroy$__.unsubscribe();
    this.__destroy$__.complete();
  }
}
