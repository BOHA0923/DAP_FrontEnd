import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DwImageViewerFileIconComponent } from './dw-image-viewer-file-icon.component';

describe('DwImageViewerFileIconComponent', () => {
  let component: DwImageViewerFileIconComponent;
  let fixture: ComponentFixture<DwImageViewerFileIconComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DwImageViewerFileIconComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DwImageViewerFileIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
