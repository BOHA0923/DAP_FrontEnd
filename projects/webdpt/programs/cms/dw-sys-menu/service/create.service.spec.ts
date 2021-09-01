import { TestBed, inject } from '@angular/core/testing';

import { DwSysMenuCreateService } from './create.service';

describe('DwSysMenuCreateService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DwSysMenuCreateService]
    });
  });

  it('should be created', inject([DwSysMenuCreateService], (service: DwSysMenuCreateService) => {
    expect(service).toBeTruthy();
  }));
});
