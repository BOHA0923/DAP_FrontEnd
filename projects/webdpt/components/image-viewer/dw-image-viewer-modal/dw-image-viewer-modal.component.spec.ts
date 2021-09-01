import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DwImageViewerModalComponent } from './dw-image-viewer-modal.component';

describe('DwImageViewerModalComponent', () => {
  let component: DwImageViewerModalComponent;
  let fixture: ComponentFixture<DwImageViewerModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DwImageViewerModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DwImageViewerModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
