import { TestBed } from '@angular/core/testing';

import { DwImageViewerService } from './dw-image-viewer.service';

describe('DwImageViewerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DwImageViewerService = TestBed.get(DwImageViewerService);
    expect(service).toBeTruthy();
  });
});
