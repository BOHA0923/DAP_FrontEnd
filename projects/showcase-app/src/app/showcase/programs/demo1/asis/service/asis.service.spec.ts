import {inject, TestBed} from '@angular/core/testing';

import {AsisService} from './asis.service';

describe('AsisService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AsisService]
    });
  });

  it('should be created', inject([AsisService], (service: AsisService) => {
    expect(service).toBeTruthy();
  }));
});
