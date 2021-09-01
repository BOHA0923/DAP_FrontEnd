import { DwDevToolModule } from './dev-tool.module';

describe('DwDevToolModule', () => {
  let dwDevToolModule: DwDevToolModule;

  beforeEach(() => {
    dwDevToolModule = new DwDevToolModule();
  });

  it('should create an instance', () => {
    expect(dwDevToolModule).toBeTruthy();
  });
});
