import { DwUpdatePasswordModalComponent } from '../update-password-modal.component';

/**
 * 開窗元件的預設參數.
 *
 */
export interface IDwUpdatePasswordModal {
  dwTitle: string; // modal 標題.
  dwWidth: string; // modal 寬度.
  dwOkText: string; // 確認按鈕文字.
  dwCancelText: string; // 取消按鈕文字.
  customOnOk?(): void; // 點擊[確認]回調-[作業定義].
  customOnCancel?(): void; // 點擊[遮罩層]或[右上角叉]或[取消按鈕]的回調-[作業定義].
  customAfterClose?(): void; // Modal 完全關閉後的回調-[作業定義].
  customAfterOpen?(): void; // Modal 打開後的回調-[作業定義].
  dwOnOk?(result: DwUpdatePasswordModalComponent): void; // 點擊[確認]回調-[Modal定義].
  dwOnCancel?(result: DwUpdatePasswordModalComponent): void; // 點擊[遮罩層]或[右上角叉]或[取消按鈕]的回調-[Modal定義].
}
