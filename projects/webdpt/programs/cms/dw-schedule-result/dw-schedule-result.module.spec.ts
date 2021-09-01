import { DwScheduleResultModule } from './dw-schedule-result.module';

describe('DwScheduleResultModule', () => {
  let dwScheduleResultModule: DwScheduleResultModule;

  beforeEach(() => {
    dwScheduleResultModule = new DwScheduleResultModule();
  });

  it('should create an instance', () => {
    expect(dwScheduleResultModule).toBeTruthy();
  });
});
