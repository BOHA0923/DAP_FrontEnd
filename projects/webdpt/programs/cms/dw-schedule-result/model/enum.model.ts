export class DwScheduleEnumModel {
  // 執行狀態: completed=完成,error=錯誤,failure=失敗,running=執行中,skipped=忽略
  static statusList = [
    { value: 'completed' },
    { value: 'error' },
    { value: 'failure' },
    { value: 'running' },
    { value: 'skipped' }
  ];

  // 排程類型：0.立即執行 1.指定時間於背景執行 2.周期性背景執行 3.複雜週期性 4.重覆規則R Rule
  static scheduleTypeList = [
    { value: '0' },
    { value: '1' },
    { value: '2' },
    { value: '3' },
    { value: '4' }
  ];
}
