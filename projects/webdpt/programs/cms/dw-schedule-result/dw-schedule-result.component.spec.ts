import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DwScheduleResultComponent } from './dw-schedule-result.component';

describe('DwScheduleResultComponent', () => {
  let component: DwScheduleResultComponent;
  let fixture: ComponentFixture<DwScheduleResultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DwScheduleResultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DwScheduleResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
