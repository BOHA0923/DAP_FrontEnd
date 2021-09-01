import { DwCmsModule } from './cms.module';

describe('DwCmsModule', () => {
  let dwCmsModule: DwCmsModule;

  beforeEach(() => {
    dwCmsModule = new DwCmsModule();
  });

  it('should create an instance', () => {
    expect(dwCmsModule).toBeTruthy();
  });
});
