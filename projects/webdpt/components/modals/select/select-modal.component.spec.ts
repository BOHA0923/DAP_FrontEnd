import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DwSelectModalComponent } from './select-modal.component';

describe('DwSelectModalComponent', () => {
  let component: DwSelectModalComponent;
  let fixture: ComponentFixture<DwSelectModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DwSelectModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DwSelectModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
