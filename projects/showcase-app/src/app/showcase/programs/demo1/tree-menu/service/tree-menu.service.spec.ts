import {inject, TestBed} from '@angular/core/testing';
import { TreeMenuService } from './tree-menu.service';

describe('TreeMenuService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TreeMenuService]
    });
  });

  it('should be created', inject([TreeMenuService], (service: TreeMenuService) => {
    expect(service).toBeTruthy();
  }));
});
