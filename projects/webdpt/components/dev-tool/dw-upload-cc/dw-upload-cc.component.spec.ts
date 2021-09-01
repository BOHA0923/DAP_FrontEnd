import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DwUploadCcComponent } from './dw-upload-cc.component';

describe('DwUploadCcComponent', () => {
  let component: DwUploadCcComponent;
  let fixture: ComponentFixture<DwUploadCcComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DwUploadCcComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DwUploadCcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
