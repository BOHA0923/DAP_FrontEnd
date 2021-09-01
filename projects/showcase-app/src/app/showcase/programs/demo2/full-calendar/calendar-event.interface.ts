export interface DwCalendarEventInterface {
  /**
   * 編號
   */
  id: string;
  /**
   * 整天
   */
  allDay: boolean;
  /**
   * 開始時間
   */
  start: Date;
  /**
   * 結束時間
   */
  end: Date;
  // /**
  //  * 開始時間：'01:00'
  //  */
  // startTime: string;
  // /**
  //  * 結束時間：'01:00'
  //  * 如果省略，則視為持續的時間
  //  */
  // endTime: string;
  /**
   * 事件名稱
   */
  title: string;
  /**
   * 連結
   */
  url: string;
  /**
   * 樣式名稱
   * 接受字串陣列的樣式名稱["classname1", "classname2"]
   */
  classNames: string[];
  /**
   * 此事件是否可編輯，覆寫master的editable設定
   */
  editable: boolean;
  /**
   * 事件背景色
   */
  backgroundColor: string;
  /**
   * 事件文字顏色
   */
  textColor: string;
  /**
   * rrule
   */
  rrule: string;
  /**
   * 事件的詳細描述
   */
  description: string;
}
