/*開窗參數資料格式*/
export interface IDwLoginBlockModal {
  description: string; // 描述內容, 必填
  btnTitle: string; // 關閉button顯示文字, 必填
  width?: string; // 開窗寬度, 預設400
  closable?: boolean; // 顯示關閉鈕, 預設false不顯示
  maskClosable?: boolean; // 按遮罩關閉, 預設false
}
