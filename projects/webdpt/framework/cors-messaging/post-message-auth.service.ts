import { Inject, Injectable } from '@angular/core';
import { DW_APP_AUTH_TOKEN, DW_APP_ID } from '@webdpt/framework/config';
import { IDwPostMessageData } from './post-message-event-target.interface';

@Injectable({
  providedIn: 'root'
})
export class DwPostMessageAuthService {
  constructor(
    @Inject(DW_APP_ID) private dwAppId: string,
    @Inject(DW_APP_AUTH_TOKEN) private dwAppAuthToken: string
  ) { }

  auth(data: IDwPostMessageData): boolean {
    if (this.dwAppId && this.dwAppAuthToken) {
      return this.dwAppId === data.appId && this.dwAppAuthToken === data.appToken;
    } else {
      return false;
    }
  }
}
