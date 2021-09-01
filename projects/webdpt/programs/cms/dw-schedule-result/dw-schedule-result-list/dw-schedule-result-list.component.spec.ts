import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DwScheduleResultListComponent } from './dw-schedule-result-list.component';

describe('DwScheduleResultListComponent', () => {
  let component: DwScheduleResultListComponent;
  let fixture: ComponentFixture<DwScheduleResultListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DwScheduleResultListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DwScheduleResultListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
