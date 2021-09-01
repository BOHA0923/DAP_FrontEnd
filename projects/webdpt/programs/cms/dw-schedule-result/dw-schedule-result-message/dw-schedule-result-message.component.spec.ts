import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {DwScheduleResultMessageComponent} from './dw-schedule-result-message.component';

describe('DwScheduleResultMessageComponent', () => {
  let component: DwScheduleResultMessageComponent;
  let fixture: ComponentFixture<DwScheduleResultMessageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DwScheduleResultMessageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DwScheduleResultMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
