import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AsisDetailEditComponent} from './asis-detail-edit.component';

describe('AsisDetailEditComponent', () => {
  let component: AsisDetailEditComponent;
  let fixture: ComponentFixture<AsisDetailEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AsisDetailEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AsisDetailEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
