import { TestBed } from '@angular/core/testing';

import { DwImageViewerFileService } from './dw-image-viewer-file.service';

describe('DwImageViewerFileService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DwImageViewerFileService = TestBed.get(DwImageViewerFileService);
    expect(service).toBeTruthy();
  });
});
