import { Injectable, Optional } from '@angular/core';
import { DwPostMessageAuthService } from './post-message-auth.service';
import { DwPostMessageConnect } from './post-message-connect';
import { IDwPostMessageEventTarget } from './post-message-event-target.interface';
import { DwPostMessageHub } from './post-message-hub';


@Injectable({
  providedIn: 'root'
})
export class DwPostMessageFactoryService {
  private static _instance: DwPostMessageFactoryService = null;
  private static _hub: DwPostMessageHub = null;

  constructor(@Optional() private messageAuthService: DwPostMessageAuthService) {
    if (!DwPostMessageFactoryService._hub) {
      DwPostMessageFactoryService._hub = new DwPostMessageHub(window);
    }

    return DwPostMessageFactoryService._instance = DwPostMessageFactoryService._instance || this;
  }

  getHubInstance(): DwPostMessageHub {
    return DwPostMessageFactoryService._hub;
  }

  connect(target: IDwPostMessageEventTarget): DwPostMessageConnect {
    return new DwPostMessageConnect(window, target, this.messageAuthService);
  }
}
