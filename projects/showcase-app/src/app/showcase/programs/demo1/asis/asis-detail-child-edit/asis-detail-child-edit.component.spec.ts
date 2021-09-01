import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AsisDetailChildEditComponent} from './asis-detail-child-edit.component';

describe('AsisDetailChildEditComponent', () => {
  let component: AsisDetailChildEditComponent;
  let fixture: ComponentFixture<AsisDetailChildEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AsisDetailChildEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AsisDetailChildEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
