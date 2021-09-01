/**
 * 行事曆檢視模式
 */
export enum CalendarView {
  /**
   * 月曆
   */
  GridMonth = 'dayGridMonth',
  /**
   * 週曆
   */
  GridWeek = 'timeGridWeek',
  /**
   * 日曆
   */
  GridDay = 'timeGridDay',
  /**
   * 月清單
   */
  ListMonth = 'listMonth',
  /**
   * 週清單
   */
  ListWeek = 'listWeek',
  /**
   * 日清單
   */
  ListDay = 'listDay'
}

export interface CalendarVisibleDateRange {
  activeStart: Date;
  activeEnd: Date;
  start: Date;
  end: Date;
  type: string;
}
