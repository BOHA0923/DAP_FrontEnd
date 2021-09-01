import { DwSysMenuModule } from './dw-sys-menu.module';

describe('DwSysMenuModule', () => {
  let dwSysMenuModule: DwSysMenuModule;

  beforeEach(() => {
    dwSysMenuModule = new DwSysMenuModule();
  });

  it('should create an instance', () => {
    expect(dwSysMenuModule).toBeTruthy();
  });
});
