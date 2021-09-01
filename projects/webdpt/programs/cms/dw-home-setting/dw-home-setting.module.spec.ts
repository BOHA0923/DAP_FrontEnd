import { DwHomeSettingModule } from './dw-home-setting.module';

describe('DwHomeSettingModule', () => {
  let dwHomeSettingModule: DwHomeSettingModule;

  beforeEach(() => {
    dwHomeSettingModule = new DwHomeSettingModule();
  });

  it('should create an instance', () => {
    expect(DwHomeSettingModule).toBeTruthy();
  });
});
