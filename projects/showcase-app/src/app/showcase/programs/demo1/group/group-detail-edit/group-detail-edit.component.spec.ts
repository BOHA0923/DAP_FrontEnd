import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {GroupDetailEditComponent} from './group-detail-edit.component';

describe('GroupDetailEditComponent', () => {
  let component: GroupDetailEditComponent;
  let fixture: ComponentFixture<GroupDetailEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupDetailEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupDetailEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
