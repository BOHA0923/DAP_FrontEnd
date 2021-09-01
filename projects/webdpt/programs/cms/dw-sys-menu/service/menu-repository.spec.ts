import { TestBed, inject } from '@angular/core/testing';

import { DwSysMenuRepository } from './menu-repository';

describe('DwSysMenuRepository', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DwSysMenuRepository]
    });
  });

  it('should be created', inject([DwSysMenuRepository], (service: DwSysMenuRepository) => {
    expect(service).toBeTruthy();
  }));
});
