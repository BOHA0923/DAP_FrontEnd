import { Injectable } from '@angular/core';

/**
 * 行事曆顏色服務
 */
@Injectable()
export class DwPlanCalendarColorService {

  constructor(
  ) {
  }

  /**
   * 預設顏色
   *
   * @returns 預設顏色
   */
  public default(): string {
    return '#039BE5';
  }

  /**
   * 顏色列表
   *
   * @returns 顏色列表
   */
  public colorList(): Array<string> {
    return [
      '#AD1457',
      '#D81B60',
      '#D50000',
      '#E67C73',
      '#F4511E',
      '#EF6C00',
      '#F09300',
      '#FFCC00',
      '#E4C441',
      '#C0CA33',
      '#7DB342',
      '#33B679',
      '#0B8043',
      '#009688',
      '#039BE5',
      '#4285F4',
      '#3F51B5',
      '#7986CB',
      '#9E69AF',
      '#8E24AA'
    ];
  }
}
