import { FormControl } from '@angular/forms';

export class DwDataColumn extends FormControl {

  public updateValue(value: any): void {
    this.markAsDirty();
    this.setValue(value);
  }

  reset(formState?: any, options?: {
    onlySelf?: boolean;
    emitEvent?: boolean;
  }): void {
    super.reset(formState, options); // 為了要把輸入清空還原
    this.markAsPristine(); // 還原成初始狀態, super.reset()的還原無作用
    this.markAsUntouched(); // 還原成初始狀態, super.reset()的還原無作用
    // 如果沒有 setErrors() 時, FormControl 仍保有校驗失敗的訊息, 如 errors: {required: true}
    // 如果都是 setErrors(null) 時, form valid 會過, 保存可以按
    if (this.errors) {
      this.setErrors({});
    }

  }

}
