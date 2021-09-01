import { TestBed, inject } from '@angular/core/testing';

import { DwSysMenuTreeUiService } from './tree-ui.service';

describe('DwSysMenuTreeUiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DwSysMenuTreeUiService]
    });
  });

  it('should be created', inject([DwSysMenuTreeUiService], (service: DwSysMenuTreeUiService) => {
    expect(service).toBeTruthy();
  }));
});
