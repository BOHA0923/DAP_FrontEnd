import { DwPostMessageManager } from '../post-message-manager';

export function PostMessageListener(validApp?: boolean): Function {
  return (
    target: DwPostMessageManager,
    propertyKey: string,
    descriptor: TypedPropertyDescriptor<any>
    ): TypedPropertyDescriptor<any> => {
    const constructor = Object.getPrototypeOf(target).constructor;
    if (constructor && constructor.__listeners__) {
      constructor.__listeners__.push(function (): void {
        // (this as DwPostMessageManager).messageService.addListener(propertyKey, (msg) => descriptor.value.call(this));
      });
    }
    return descriptor;
  };
}
