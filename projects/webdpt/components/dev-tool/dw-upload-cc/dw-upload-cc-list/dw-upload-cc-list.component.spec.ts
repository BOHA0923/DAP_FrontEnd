import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DwUploadCcListComponent } from './dw-upload-cc-list.component';

describe('DwUploadCcListComponent', () => {
  let component: DwUploadCcListComponent;
  let fixture: ComponentFixture<DwUploadCcListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DwUploadCcListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DwUploadCcListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
