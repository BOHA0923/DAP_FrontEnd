import { DwProgramsModule } from './programs.module';

describe('DwProgramsModule', () => {
  let dwProgramsModule: DwProgramsModule;

  beforeEach(() => {
    dwProgramsModule = new DwProgramsModule();
  });

  it('should create an instance', () => {
    expect(dwProgramsModule).toBeTruthy();
  });
});
