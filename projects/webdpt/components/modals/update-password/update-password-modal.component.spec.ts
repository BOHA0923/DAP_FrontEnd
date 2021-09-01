import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DwUpdatePasswordModalComponent } from './update-password-modal.component';

describe('DwUpdatePasswordModalComponent', () => {
  let component: DwUpdatePasswordModalComponent;
  let fixture: ComponentFixture<DwUpdatePasswordModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DwUpdatePasswordModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DwUpdatePasswordModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
