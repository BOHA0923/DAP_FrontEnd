export interface IDwPostMessageEventTarget extends EventTarget {
  postMessage(message: any, targetOrigin?: string, transfer?: any[]): void;
}

export interface IDwPostMessageData {
  sourceUrl: string;
  channelName: string;
  appId: string;
  appToken: string;
  data: any;
}
