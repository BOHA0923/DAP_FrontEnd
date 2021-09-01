import { DynamicListwinModule } from './dynamic-listwin.module';

describe('DynamicListwinModule', () => {
  let dynamicListwinModule: DynamicListwinModule;

  beforeEach(() => {
    dynamicListwinModule = new DynamicListwinModule();
  });

  it('should create an instance', () => {
    expect(dynamicListwinModule).toBeTruthy();
  });
});
