import { DwUploadCcModule } from './dw-upload-cc.module';

describe('DwUploadCcModule', () => {
  let dwSysMenuModule: DwUploadCcModule;

  beforeEach(() => {
    dwSysMenuModule = new DwUploadCcModule();
  });

  it('should create an instance', () => {
    expect(dwSysMenuModule).toBeTruthy();
  });
});
